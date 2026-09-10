import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server be reached from a phone on the same Wi-Fi (via the
  // "Network:" URL printed by `next dev`). Without this, Next.js blocks the
  // client JS bundle on any non-localhost origin, so the page renders but
  // nothing is interactive. Update this IP if your local network address changes.
  allowedDevOrigins: ["10.245.16.77"],
};

export default nextConfig;
