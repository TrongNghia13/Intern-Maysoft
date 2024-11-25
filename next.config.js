const webpack = require('webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled:
    process.env.ANALYZE === 'true' && process.env.NODE_ENV === 'production',
});

/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'staging-asset-api.maysols.com',
        pathname: '/api/GetAccessUrl/**',
      },
      {
        protocol: 'https',
        hostname: 'static.maysols.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maysols-asset',
        pathname: '/apollo/**',
      },
      {
        protocol: 'https',
        hostname: 'maysols-asset.ap-south-1.linodeobjects.com',
        pathname: '/apollo/**',
      },
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hoanghamobile.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.travelapi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.deeptech.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'businesstripbooking.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'demo.deeptech.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'app.bizitrip.vn',
        pathname: '/**',
      },
    ],
    domains: ['picsum.photos'],
  },
  output: 'standalone',
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  i18n,


  // deeptech components
  optimizeFonts: true,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // compiler: {
  //   reactRemoveProperties: true,
  // },
  swcMinify: true,
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  webpack: (config, { defaultLoaders, dev, buildId }) => {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      // options: { icon: true }
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CONFIG_BUILD_ID': JSON.stringify(buildId),
      })
    );

    return config;
  },
  // experimental: {
  //   appDir: true,
  // },
}

module.exports = withBundleAnalyzer(nextConfig);