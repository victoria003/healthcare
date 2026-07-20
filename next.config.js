/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.4'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
