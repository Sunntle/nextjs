/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', "www.cryptocompare.com", "resources.cryptocompare.com"],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '/image/upload/v1706436846/generated_public_links/*',
          },
          {
            protocol: 'https',
            hostname: 'www.cryptocompare.com',
            pathname: '/media/37746251/*',
          },
          {
            protocol: 'https',
            hostname: 'resources.cryptocompare.com',
            pathname: '/asset-management/*',
          }
        ],
      },
};

module.exports = nextConfig;
