import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import Bottleneck from 'bottleneck';
import * as cache from 'memory-cache';

export interface VideoData {
  type: 'metadata';
  videoUrl: string;
  title: string;
  author: string;
  formats: {
    noWatermark: string;
    withWatermark: string;
    mp3: string;
    thumbnail: string;
    duration: number;
  };
}

@Injectable()
export class TiktokService {
  private readonly limiter: Bottleneck;
  private readonly CACHE_DURATION = 300000; // 5 minutes

  constructor(private readonly httpService: HttpService) {
    this.limiter = new Bottleneck({
      minTime: 2000,
      maxConcurrent: 1,
      reservoir: 1,
      reservoirRefreshAmount: 1,
      reservoirRefreshInterval: 2000,
    });
  }

  async resolveShortUrl(shortUrl: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(shortUrl, {
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400,
        }),
      );

      const redirectedUrl = response.headers['location'];
      if (!redirectedUrl || !redirectedUrl.includes('tiktok.com/@')) {
        throw new Error('Invalid TikTok redirect target');
      }

      return redirectedUrl;
    } catch (error) {
      if (error.response?.status >= 300 && error.response?.status < 400) {
        const redirectedUrl = error.response.headers['location'];
        if (!redirectedUrl || !redirectedUrl.includes('tiktok.com/@')) {
          throw new Error('Invalid TikTok short link redirect');
        }
        return redirectedUrl;
      }
      throw new Error('Failed to resolve TikTok short URL');
    }
  }

  async getVideoData(videoUrl: string): Promise<VideoData> {
    let resolvedUrl = videoUrl;

    if (videoUrl.startsWith('https://vt.tiktok.com/')) {
      resolvedUrl = await this.resolveShortUrl(videoUrl);
    }

    const tiktokUrlRegex = /^https:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/;
    if (!tiktokUrlRegex.test(resolvedUrl)) {
      throw new Error('Invalid TikTok URL format');
    }

    const cacheKey = `metadata_${resolvedUrl}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Returning cached metadata for URL: ${resolvedUrl}`);
      return cachedData;
    }

    const fetchMetadata = async (): Promise<VideoData> => {
      try {
        const response = await firstValueFrom(
          this.httpService.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(resolvedUrl)}`, {
            timeout: 20000,
          }),
        );

        if (response.data?.code !== 0 || !response.data?.data) {
          throw new Error(response.data?.msg || 'No data returned from TikWM API');
        }

        const data = response.data.data;
        const videoId = resolvedUrl.match(/video\/(\d+)/)?.[1] || 'Unknown';

        const metadata: VideoData = {
          type: 'metadata',
          videoUrl: data.play || '',
          title: data.title || `TikTok Video ${videoId}`,
          author: data.author?.nickname || 'Unknown',
          formats: {
            noWatermark: data.play || '',
            withWatermark: data.wmplay || '',
            mp3: data.music || '',
            thumbnail: data.cover || '',
            duration: data.duration || 0,
          },
        };

        if (!metadata.formats.noWatermark && !metadata.formats.withWatermark) {
          throw new Error('No downloadable video URLs found');
        }

        cache.put(cacheKey, metadata, this.CACHE_DURATION);
        return metadata;
      } catch (error) {
        console.error('Error fetching metadata:', {
          url: resolvedUrl,
          message: error.message,
          response: error.response?.data,
        });
        if (error.response?.status === 429 || error.message.includes('Free Api Limit')) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch video metadata: ${error.message}`);
      }
    };

    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        return await this.limiter.schedule(() => fetchMetadata());
      } catch (error) {
        if (error.message.includes('Rate limit exceeded') && attempts < maxAttempts - 1) {
          attempts++;
          const delay = 5000 * attempts;
          console.warn(`Rate limit hit, retrying (${attempts}/${maxAttempts}) after ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
    throw new Error('Failed to fetch metadata after retries');
  }

  async downloadVideo(videoUrl: string, resolution: '240p' | '360p' | '480p' | '720p' | '1080p' = '720p'): Promise<Buffer> {
    try {
      if (!videoUrl) {
        throw new Error('Invalid video URL');
      }

      const headResponse = await firstValueFrom(
        this.httpService.head(videoUrl, { timeout: 10000 }),
      );
      if (headResponse.status !== 200) {
        throw new Error(`Video URL inaccessible (status: ${headResponse.status})`);
      }

      const response = await firstValueFrom(
        this.httpService.get(videoUrl, { responseType: 'arraybuffer', timeout: 60000 }),
      );
      let videoBuffer = Buffer.from(response.data);

      if (!this.isFFmpegAvailable()) {
        console.warn('FFmpeg not found, returning raw video buffer');
        return videoBuffer;
      }

      const tempDir = path.join(__dirname, '../../temp');
      await fs.ensureDir(tempDir);
      const inputPath = path.join(tempDir, `input-${Date.now()}.mp4`);
      const outputPath = path.join(tempDir, `output-${Date.now()}-${resolution}.mp4`);

      try {
        await fs.writeFile(inputPath, videoBuffer);

        const resolutionMap = {
          '240p': '426:240',
          '360p': '640:360',
          '480p': '854:480',
          '720p': '1280:720',
          '1080p': '1920:1080',
        };

        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .videoCodec('libx264')
            .outputOptions([
              `-vf scale=${resolutionMap[resolution]}:force_original_aspect_ratio=decrease,pad=${resolutionMap[resolution]}:(ow-iw)/2:(oh-ih)/2`,
              '-preset fast',
              '-crf 23',
              '-max_muxing_queue_size 1024',
            ])
            .format('mp4')
            .output(outputPath)
            .on('end', resolve)
            .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
            .run();
        });

        videoBuffer = await fs.readFile(outputPath);
      } finally {
        await Promise.all([
          fs.unlink(inputPath).catch((err) => console.warn('Failed to delete input file:', err.message)),
          fs.unlink(outputPath).catch((err) => console.warn('Failed to delete output file:', err.message)),
        ]);
      }

      return videoBuffer;
    } catch (error) {
      console.error(`Error downloading video (${resolution}):`, {
        url: videoUrl,
        message: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to download video: ${error.message}`);
    }
  }

  async downloadAudio(audioUrl: string): Promise<Buffer> {
    try {
      if (!audioUrl) {
        throw new Error('Invalid audio URL');
      }

      const response = await firstValueFrom(
        this.httpService.get(audioUrl, { responseType: 'arraybuffer', timeout: 30000 }),
      );
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading audio:', {
        url: audioUrl,
        message: error.message,
      });
      throw new Error(`Failed to download audio: ${error.message}`);
    }
  }

  async downloadThumbnail(thumbnailUrl: string): Promise<Buffer> {
    try {
      if (!thumbnailUrl) {
        throw new Error('Invalid thumbnail URL');
      }
      const response = await firstValueFrom(
        this.httpService.get(thumbnailUrl, { responseType: 'arraybuffer', timeout: 30000 }),
      );
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading thumbnail:', {
        url: thumbnailUrl,
        message: error.message,
      });
      throw new Error(`Failed to download thumbnail: ${error.message}`);
    }
  }

  async getVideoSize(videoUrl: string): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpService.head(videoUrl, { timeout: 10000 }),
      );
      const size = parseInt(response.headers['content-length'] || '0', 10);
      return isNaN(size) ? 0 : size;
    } catch (error) {
      console.warn('Failed to fetch video size:', {
        url: videoUrl,
        message: error.message,
      });
      return 0;
    }
  }

  isFFmpegAvailable(): boolean {
    try {
      require('child_process').execSync('ffmpeg -version', { stdio: 'ignore' });
      return true;
    } catch (error) {
      console.warn('FFmpeg not available:', error.message);
      return false;
    }
  }
}