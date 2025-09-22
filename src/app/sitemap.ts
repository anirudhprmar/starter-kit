import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();
  return [
    {
      url: "",
      // url: "https://starter-kit-vercel.com/",
      lastModified,
      priority: 1,
      changeFrequency: "daily",
    },
  ];
}
