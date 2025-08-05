/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons', '@douyinfe/semi-illustrations'],
  experimental: {
    esmExternals: 'loose'
  }
};

module.exports = nextConfig;
