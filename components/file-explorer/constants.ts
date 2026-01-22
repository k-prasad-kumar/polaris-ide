export const BASE_PADDING = 12; // Base padding for root level items
export const LEVEL_PADDING = 12; // Padding for nested items

export const getItemPadding = (level: number, isFile: boolean) => {
  // Files need extra padding since they dont have chevron
  const fileOffset = isFile ? 16 : 0;

  return BASE_PADDING + level * LEVEL_PADDING + fileOffset;
};
