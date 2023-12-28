import { client } from "./client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

export const urlFor = (source: string) => {
  const url = builder.image(source);
  return url;
};
