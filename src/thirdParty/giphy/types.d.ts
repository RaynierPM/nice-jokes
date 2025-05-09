type GifData = {
  id: string;
  type: string;
  url: string;
  embed_url: string;
  title: string;
  images: GifMetadata;
};

type GifMetadata = {
  original: OriginalImage;
};

type OriginalImage = {
  width: string;
  height: string;
  size: string;
  url: string;
};
