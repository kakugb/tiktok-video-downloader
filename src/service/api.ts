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











