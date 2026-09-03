import { Subtitle } from '../types';

export const parseSrt = (srtContent: string): Subtitle[] => {
  const normalized = srtContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!normalized) return [];

  const regex = /(\d+)\n(\d{1,2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,\.]\d{3})\n([\s\S]*?)(?=\n\n\d+\n|\n*$)/g;
  const subtitles: Subtitle[] = [];
  let match;

  while ((match = regex.exec(normalized)) !== null) {
    subtitles.push({
      index: parseInt(match[1], 10),
      startTime: match[2],
      endTime: match[3],
      text: match[4].trim(),
    });
  }

  return subtitles;
};

export const formatSrt = (subtitles: Subtitle[]): string => {
  return subtitles
    .map(
      (sub, index) =>
        `${index + 1}\n${sub.startTime} --> ${sub.endTime}\n${sub.text.trim()}`
    )
    .join('\n\n');
};
