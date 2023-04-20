/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: () => [
    {
      source: "/api/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL}:path*`,
    },
  ],
};

module.exports = nextConfig;
