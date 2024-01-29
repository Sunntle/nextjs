/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '/image/upload/v1706436846/generated_public_links/*',
          },
        ],
      },
};

module.exports = nextConfig;
