import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://justnyktsmp.net";

  const routes = [
    "",
    "/sunucu",
    "/market",
    "/siralama",
    "/kurallar",
    "/haberler",
    "/wiki",
    "/destek",
    "/oy-ver",
    "/klanlar",
    "/giris",
    "/kayit",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/haberler" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
