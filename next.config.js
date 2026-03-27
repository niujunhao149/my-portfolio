/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/my-portfolio',
  assetPrefix: '/my-portfolio',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // 修复 @react-pdf/renderer 在客户端的问题
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        stream: false,
        zlib: false,
        canvas: false,
      };
    }

    // 忽略 canvas 警告
    config.externals = config.externals || [];
    config.externals.push({
      canvas: 'canvas',
    });

    return config;
  },
};

export default nextConfig;
