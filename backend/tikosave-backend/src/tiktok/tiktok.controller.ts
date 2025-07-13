import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { TiktokService, VideoData } from './tiktok.service';
import { Response } from 'express';

@Controller('tiktok')
export class TiktokController {
  constructor(private readonly tiktokService: TiktokService) {}

  @Get('metadata')
  async getMetadata(@Query('url') videoUrl: string) {
    if (!videoUrl) {
      throw new HttpException('Video URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const metadata = await this.tiktokService.getVideoData(videoUrl);
      if (!metadata || !metadata.formats) {
        throw new HttpException(
          'Failed to retrieve video metadata',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return metadata;
    } catch (error) {
      const message = error.message || 'Error fetching metadata';
      throw new HttpException(
        message,
        message.includes('Rate limit exceeded')
          ? HttpStatus.TOO_MANY_REQUESTS
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('download/video')
  async downloadVideo(
    @Query('url') videoUrl: string,
    @Query('resolution') resolution: '240p' | '360p' | '480p' | '720p' | '1080p' = '720p',
    @Query('watermark') watermark: string,
    @Res() res: Response,
  ) {
    if (!videoUrl) {
      throw new HttpException('Video URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const metadata = await this.tiktokService.getVideoData(videoUrl);
      if (!metadata || !metadata.formats) {
        throw new HttpException(
          'Failed to retrieve video metadata',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const videoUrlToDownload =
        watermark === 'true' ? metadata.formats.withWatermark : metadata.formats.noWatermark;

      if (!videoUrlToDownload) {
        throw new HttpException(
          'No downloadable video URL found',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const videoBuffer = await this.tiktokService.downloadVideo(videoUrlToDownload, resolution);
      res.set({
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="tikosave-video-${resolution}${
          watermark === 'true' ? '-watermark' : ''
        }.mp4"`,
        'X-FFmpeg-Warning': !this.tiktokService['isFFmpegAvailable']()
          ? 'Video not processed due to missing FFmpeg; original resolution used'
          : undefined,
      });
      res.send(videoBuffer);
    } catch (error) {
      const message = error.message || 'Error downloading video';
      throw new HttpException(
        message,
        message.includes('Rate limit exceeded')
          ? HttpStatus.TOO_MANY_REQUESTS
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('download/audio')
  async downloadAudio(@Query('url') videoUrl: string, @Res() res: Response) {
    if (!videoUrl) {
      throw new HttpException('Video URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const metadata = await this.tiktokService.getVideoData(videoUrl);
      if (!metadata || !metadata.formats || !metadata.formats.mp3) {
        throw new HttpException(
          'Failed to retrieve audio metadata or no audio available',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const audioBuffer = await this.tiktokService.downloadAudio(metadata.formats.mp3);
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="tikosave-audio.mp3"',
      });
      res.send(audioBuffer);
    } catch (error) {
      const message = error.message || 'Error downloading audio';
      throw new HttpException(
        message,
        message.includes('Rate limit exceeded')
          ? HttpStatus.TOO_MANY_REQUESTS
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('size')
  async getVideoSize(@Query('url') videoUrl: string) {
    if (!videoUrl) {
      throw new HttpException('Video URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const metadata = await this.tiktokService.getVideoData(videoUrl);
      if (!metadata || !metadata.formats || !metadata.formats.noWatermark) {
        throw new HttpException(
          'Failed to retrieve video metadata or no video available',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const size = await this.tiktokService.getVideoSize(metadata.formats.noWatermark);
      return { size };
    } catch (error) {
      const message = error.message || 'Error fetching video size';
      throw new HttpException(
        message,
        message.includes('Rate limit exceeded')
          ? HttpStatus.TOO_MANY_REQUESTS
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('thumbnail-url')
  async getThumbnailUrl(@Query('url') videoUrl: string) {
    if (!videoUrl) {
      throw new HttpException('Video URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const metadata: VideoData = await this.tiktokService.getVideoData(videoUrl);
      if (!metadata || !metadata.formats || !metadata.formats.thumbnail) {
        throw new HttpException(
          'Failed to retrieve thumbnail URL',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { thumbnail: metadata.formats.thumbnail };
    } catch (error) {
      const message = error.message || 'Error fetching thumbnail URL';
      throw new HttpException(
        message,
        message.includes('Rate limit exceeded')
          ? HttpStatus.TOO_MANY_REQUESTS
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('thumbnail')
  async getThumbnail(@Query('url') videoUrl: string, @Res() res: Response) {
    if (!videoUrl) {
      throw new HttpException('Video URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const metadata: VideoData = await this.tiktokService.getVideoData(videoUrl);
      if (!metadata || !metadata.formats || !metadata.formats.thumbnail) {
        throw new HttpException(
          'Failed to retrieve thumbnail metadata',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const thumbnailBuffer = await this.tiktokService.downloadThumbnail(metadata.formats.thumbnail);
      res.set({
        'Content-Type': 'image/jpeg', // Adjust based on actual thumbnail format
        'Content-Disposition': `attachment; filename="tikosave-thumbnail.jpg"`,
        'Content-Length': thumbnailBuffer.length,
      });
      res.send(thumbnailBuffer);
    } catch (error) {
      const message = error.message || 'Error downloading thumbnail';
      throw new HttpException(
        message,
        message.includes('Rate limit exceeded')
          ? HttpStatus.TOO_MANY_REQUESTS
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}