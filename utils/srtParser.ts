import type { Subtitle } from '../types';

const srtBlockRegex = /(\d+)\r?\n(\d{2}:\d{2}:\d{2},\d{3})\s-->\s(\d{2}:\d{2}:\d{2},\d{3})\r?\n([\s\S]+?)(?=\r?\n\r?\n|\s*$)/g;

export const parseSrt = (srtContent: string): Subtitle[] => {
  const subtitles: Subtitle[] = [];
  
  const normalizedSrt = srtContent.trim().replace(/\r\n/g, '\n');

  // Add a newline at the end to ensure the regex catches the last block
  const preparedSrt = normalizedSrt + '\n\n';

  let match;
  while ((match = srtBlockRegex.exec(preparedSrt)) !== null) {
    subtitles.push({
      index: parseInt(match[1], 10),
      startTime: match[2],
      endTime: match[3],
      text: match[4].trim(),
    });
  }
  
  // Note: We used to log an error here if no subtitles were found, 
  // but since we reuse this parser for plain text in FilterTool, 
  // we now silently return the empty array.

  return subtitles;
};

export const formatSrt = (subtitles: Subtitle[]): string => {
  return subtitles
    .map(
      (sub, index) =>
        `${index + 1}\n${sub.startTime} --> ${sub.endTime}\n${sub.text}`
    )
    .join('\n\n');
};
