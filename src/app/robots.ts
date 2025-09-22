import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/sign-in", "/sign-up", "/dashboard"],
    },
    // sitemap: "https://starter-kit-vercel.com/sitemap.xml",
  };
}
