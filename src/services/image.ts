import sharp from "sharp";

export default class ImageService {
  async getImageFromUrl(url: string) {
    const resp = await fetch(url);
    const image = await resp.arrayBuffer();

    return image;
  }

  async getImageDimensionsInCM(buffer: Buffer) {

    const image = sharp(buffer);
    const metadata = await image.metadata();
  
    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to get image dimensions');
    }
  
    const DPI = 96;
  
    // Convert pixels to centimeters (1 inch = 2.54 cm)
    const widthCM = (metadata.width / DPI) * 2.54;
    const heightCM = (metadata.height / DPI) * 2.54;
  
    return { widthCM, heightCM };
  }
}
