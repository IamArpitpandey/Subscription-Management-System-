import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed turbopack config as we're using Webpack
  // CSS will be handled by PostCSS + Tailwind
};

export default nextConfig;