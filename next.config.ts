/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/019aa9e5-1de3-cb07-edc4-6271fb37c260',
        permanent: false, // 307 temporary redirect
      },
    ];
  },
};

module.exports = nextConfig;
