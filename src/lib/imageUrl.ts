import { client } from "@/sanity/lib/client";
import ImageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url";


const builder = ImageUrlBuilder(client);

 export function imageUrl (source: SanityImageSource) {
  return builder.image(source);
 }