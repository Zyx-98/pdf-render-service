import { hashString } from "@/utils/hash";
import sharp from "sharp";

export default class ImageService {
  private cachedImage: {
    [key: string]: { image: ArrayBuffer; widthCM: number; heightCM: number };
  } = {};
  private withCache: boolean;
  private cacheTime: number;

  constructor(options: { withCache?: boolean; cacheTime?: number } = {}) {
    const { withCache = false } = options;
    const { cacheTime = 10 * 60 * 1000 } = options; // 10 minutes
    this.withCache = withCache;
    this.cacheTime = cacheTime;
  }

  setWithCache(withCache: boolean) {
    this.withCache = withCache;
    return this
  }

  async getFullInformationOfImageWithUrl(url: string) {
    const hashedUrl = hashString(url);
    if (this.withCache && this.cachedImage[hashedUrl]) {
      return this.cachedImage[hashedUrl];
    }

    const image = await this.getImageFromUrl(url);
    const { widthCM, heightCM } = await this.getImageDimensionsInCM(
      Buffer.from(image)
    );

    if (this.withCache) {
      this.cachedImage[hashedUrl] = {
        image,
        widthCM: widthCM,
        heightCM: heightCM,
      };
      setTimeout(() => {
        delete this.cachedImage[hashedUrl];
      }, this.cacheTime);
    }

    return { image, widthCM, heightCM };
  }

  async getImageFromUrl(url: string) {
    const resp = await fetch(url);
    const image = await resp.arrayBuffer();

    return image;
  }

  async getImageDimensionsInCM(buffer: Buffer) {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Unable to get image dimensions");
    }

    const DPI = 96;

    // Convert pixels to centimeters (1 inch = 2.54 cm)
    const widthCM = (metadata.width / DPI) * 2.54;
    const heightCM = (metadata.height / DPI) * 2.54;

    return { widthCM, heightCM };
  }
}
