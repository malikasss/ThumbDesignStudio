// AI services have been removed for static deployment.

export const generateCreativeText = async (topic: string): Promise<string> => {
  console.warn("AI text generation is disabled in this build.");
  return topic;
};

export const generateImageElement = async (prompt: string): Promise<string | null> => {
  console.warn("AI image generation is disabled in this build.");
  return null;
};