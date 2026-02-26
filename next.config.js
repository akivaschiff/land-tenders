/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/flow',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
