import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildIndexHtmlSeoTags,
  createRobotsTxt,
  createSeoPayload,
  createSitemapXml
} from "./src/seo/siteSeo.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const infoJsonPath = path.resolve(rootDir, "src/assets/json/info.json");
const seoConfigPath = path.resolve(rootDir, "src/seo/siteSeo.js");

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getSeoPayload() {
  return createSeoPayload({
    infoData: loadJson(infoJsonPath)
  });
}

function getSeoLastmod() {
  const latestMtime = Math.max(
    fs.statSync(infoJsonPath).mtimeMs,
    fs.statSync(seoConfigPath).mtimeMs
  );

  return new Date(latestMtime).toISOString().slice(0, 10);
}

function seoArtifactsPlugin() {
  let outDir = path.resolve(rootDir, "dist");

  return {
    name: "seo-artifacts",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml() {
      return {
        tags: buildIndexHtmlSeoTags(getSeoPayload())
      };
    },
    closeBundle() {
      const seoPayload = getSeoPayload();
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        createSitemapXml({
          canonicalUrl: seoPayload.canonicalUrl,
          lastmod: getSeoLastmod()
        }),
        "utf8"
      );
      fs.writeFileSync(
        path.join(outDir, "robots.txt"),
        createRobotsTxt({ canonicalUrl: seoPayload.canonicalUrl }),
        "utf8"
      );
    }
  };
}

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/2026/SDGsforum/" : "/",
  plugins: [
    vue(),
    tailwindcss(),
    seoArtifactsPlugin()
  ]
}));
