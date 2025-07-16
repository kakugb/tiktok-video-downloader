import axios from 'axios';

export interface VideoMetadata {
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
  error?: string; // Optional error property for failed responses
}

export interface ErrorResponse {
  message: string;
}

export const getVideoMetadata = async (url: string): Promise<VideoMetadata | ErrorResponse> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tiktok/metadata`, {
    params: { url },
  });
  return response.data;
};

export const getThumbnailUrl = async (url: string): Promise<{ thumbnail: string } | ErrorResponse> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tiktok/thumbnail-url`, {
    params: { url },
  });
  return response.data;
};

export const downloadVideo = async (
  url: string,
  resolution: '240p' | '360p' | '480p' | '720p' | '1080p',
  watermark: boolean,
): Promise<Blob> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tiktok/download/video`, {
    params: { url, resolution, watermark: watermark.toString() },
    responseType: 'blob',
  });
  if (response.headers['x-ffmpeg-warning']) {
    console.warn('FFmpeg Warning:', response.headers['x-ffmpeg-warning']);
  }
  return response.data;
};

export const downloadAudio = async (url: string): Promise<Blob> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tiktok/download/audio`, {
    params: { url },
    responseType: 'blob',
  });
  return response.data;
};

export const downloadThumbnail = async (url: string): Promise<Blob> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tiktok/thumbnail`, {
    params: { url },
    responseType: 'blob',
  });
  return response.data;
};











// import axios, { AxiosInstance, AxiosResponse } from 'axios';

// // Base URL for the API, configurable via environment variable
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// // Create an Axios instance for TikTok API
// const tiktokApi: AxiosInstance = axios.create({
//   baseURL: `${API_BASE_URL}/tiktok`,
//   timeout: 10000, // Set a reasonable timeout
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Custom error class for API errors
// class TikTokApiError extends Error {
//   constructor(message: string, public readonly status?: number) {
//     super(message);
//     this.name = 'TikTokApiError';
//   }
// }

// // Interfaces for type safety
// export interface VideoFormat {
//   noWatermark: string;
//   withWatermark: string;
//   mp3: string;
//   thumbnail: string;
//   duration: number;
// }

// export interface VideoMetadata {
//   videoUrl: string;
//   title: string;
//   author: string;
//   formats: VideoFormat;
// }

// export interface ErrorResponse {
//   message: string;
// }

// export type Resolution = '240p' | '360p' | '480p' | '720p' | '1080p';

// // Utility function to validate URL
// const validateUrl = (url: string): void => {
//   try {
//     new URL(url);
//   } catch {
//     throw new TikTokApiError('Invalid URL format');
//   }
// };

// // Utility function to handle API errors
// const handleApiError = (error: any): ErrorResponse => {
//   if (axios.isAxiosError(error)) {
//     return {
//       message: error.response?.data?.message || 'An error occurred while communicating with the API',
//     };
//   }
//   return { message: error.message || 'Unexpected error occurred' };
// };

// /**
//  * Fetches metadata for a TikTok video.
//  * @param url - The TikTok video URL.
//  * @returns A promise resolving to VideoMetadata or ErrorResponse.
//  * @throws TikTokApiError if the URL is invalid.
//  */
// export const getVideoMetadata = async (url: string): Promise<VideoMetadata | ErrorResponse> => {
//   validateUrl(url);
//   try {
//     const response: AxiosResponse<VideoMetadata> = await tiktokApi.get('/metadata', { params: { url } });
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// /**
//  * Fetches the thumbnail URL for a TikTok video.
//  * @param url - The TikTok video URL.
//  * @returns A promise resolving to an object with the thumbnail URL or ErrorResponse.
//  * @throws TikTokApiError if the URL is invalid.
//  */
// export const getThumbnailUrl = async (url: string): Promise<{ thumbnail: string } | ErrorResponse> => {
//   validateUrl(url);
//   try {
//     const response: AxiosResponse<{ thumbnail: string }> = await tiktokApi.get('/thumbnail-url', { params: { url } });
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// /**
//  * Downloads a TikTok video in the specified resolution with or without a watermark.
//  * @param url - The TikTok video URL.
//  * @param resolution - The desired video resolution.
//  * @param watermark - Whether to include a watermark.
//  * @returns A promise resolving to a Blob containing the video.
//  * @throws TikTokApiError if the URL is invalid or resolution is unsupported.
//  */
// export const downloadVideo = async (
//   url: string,
//   resolution: Resolution,
//   watermark: boolean,
// ): Promise<Blob> => {
//   validateUrl(url);
//   const validResolutions: Resolution[] = ['240p', '360p', '480p', '720p', '1080p'];
//   if (!validResolutions.includes(resolution)) {
//     throw new TikTokApiError(`Invalid resolution: ${resolution}`);
//   }
//   try {
//     const response: AxiosResponse<Blob> = await tiktokApi.get('/download/video', {
//       params: { url, resolution, watermark: watermark.toString() },
//       responseType: 'blob',
//     });
//     if (response.headers['x-ffmpeg-warning']) {
//       console.warn('FFmpeg Warning:', response.headers['x-ffmpeg-warning']);
//     }
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

// /**
//  * Downloads the audio track of a TikTok video.
//  * @param url - The TikTok video URL.
//  * @returns A promise resolving to a Blob containing the audio.
//  * @throws TikTokApiError if the URL is invalid.
//  */
// export const downloadAudio = async (url: string): Promise<Blob> => {
//   validateUrl(url);
//   try {
//     const response: AxiosResponse<Blob> = await tiktokApi.get('/download/audio', {
//       params: { url },
//       responseType: 'blob',
//     });
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

// /**
//  * Downloads the thumbnail image of a TikTok video.
//  * @param url - The TikTok video URL.
//  * @returns A promise resolving to a Blob containing the thumbnail.
//  * @throws TikTokApiError if the URL is invalid.
//  */
// export const downloadThumbnail = async (url: string): Promise<Blob> => {
//   validateUrl(url);
//   try {
//     const response: AxiosResponse<Blob> = await tiktokApi.get('/thumbnail', {
//       params: { url },
//       responseType: 'blob',
//     });
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };