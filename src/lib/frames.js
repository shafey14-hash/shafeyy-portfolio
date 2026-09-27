export const FRAME_COUNT = 300;

export function frameUrl(index) {
  return `/frames/f${String(index + 1).padStart(3, "0")}.webp`;
}
