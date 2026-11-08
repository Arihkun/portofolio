import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/projects", "/about"];
  return [
    ...staticPages.map((route) => ({ url: `${siteConfig.url}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8 })),
    ...getAllProjects().map((project) => ({ url: `${siteConfig.url}/projects/${project.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
