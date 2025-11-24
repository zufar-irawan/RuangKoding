import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bbclpmxlpkzatlevwcce.supabase.co",
        pathname: "/storage/v1/object/public/editor-image/**",
      },
      {
        protocol: "https",
        hostname: "bbclpmxlpkzatlevwcce.supabase.co",
        pathname: "/storage/v1/object/sign/editor-image/**", // bila pakai signed URL
      },
      {
        protocol: "https",
        hostname: "bbclpmxlpkzatlevwcce.supabase.co",
        pathname: "/storage/v1/object/public/**",            // bila ada folder lain
      },
    ],
  }
};

export default nextConfig;
