import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://biselco79.com",
      lastModified: new Date(),
    },
    {
      url: "https://biselco79.com/distribution-map",
      lastModified: new Date(),
    },
    {
      url: "https://biselco79.com/complaints",
      lastModified: new Date(),
    },
    {
      url: "https://biselco79.com/complaints/dashboard",
      lastModified: new Date(),
    },
    {
      url: "https://biselco79.com/technical",
      lastModified: new Date(),
    },
    {
      url: "https://biselco79.com/agma-dashboard",
      lastModified: new Date(),
    },
    {
        url: "https://biselco79.com/agma-registration",
        lastModified: new Date(),
    },
    {
        url: "https://biselco79.com/agma-registration/registered",
        lastModified: new Date(),
    },
    {
        url: "https://biselco79.com/agma-spin-wheel",
        lastModified: new Date(),
    },
    {
        url: "https://biselco79.com/landing",
        lastModified: new Date(),
    }
  ];
}