/** @type {import('next').NextConfig} */
import withPWA from '@ducanh2912/next-pwa';

const pwa = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  output: 'standalone',
  // Add other Next.js config options here if needed
};

export default pwa(nextConfig);