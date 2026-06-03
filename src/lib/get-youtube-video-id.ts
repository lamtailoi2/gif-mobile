export const getYoutubeVideoId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);

  return match?.[1];
};
