import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://bbclpmxlpkzatlevwcce.supabase.co/storage/v1/object/public/editor-image/**')
    ]
  }
};

export default nextConfig;
