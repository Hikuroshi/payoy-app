import type { NextConfig } from "next";

const supabaseStoragePattern = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL("/storage/v1/object/public/menu_image/**", process.env.NEXT_PUBLIC_SUPABASE_URL) : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseStoragePattern ? [supabaseStoragePattern] : [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
