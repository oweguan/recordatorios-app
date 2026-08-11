export const PROJECT_COLORS = [
  '#e63946',
  '#f4a52a',
  '#4a90e2',
  '#2a9d8f',
  '#9b5de5',
  '#ff6b9d',
  '#06a77d',
  '#ee6c4d',
];

export function nextProjectColor(existingCount) {
  return PROJECT_COLORS[existingCount % PROJECT_COLORS.length];
}
