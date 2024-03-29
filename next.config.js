const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const generateSitemap = require('./scripts/sitemap');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://easter-journey-2023.vercel.app/';

const sitemapDest = path.resolve('.next/static');
const skipIndex = ['/profile'];

const serviceWorkerPath = 'static/sw.js';
const serviceWorkerUrl = `/_next/${serviceWorkerPath}`;
const serviceWorkerDest = `.next/${serviceWorkerPath}`;

/** @see https://stackoverflow.com/questions/65974337/import-es-module-in-next-js-err-require-esm */
const withTM = require('next-transpile-modules')([
  // remark package and dependencies
  'remark',
  'bail',
  'ccount',
  'character-entities',
  'comma-separated-tokens',
  'decode-named-character-reference',
  'hast-util-sanitize',
  'hast-util-to-html',
  'hast-util-whitespace',
  'html-void-elements',
  'longest-streak',
  'mdast-util-definitions',
  'mdast-util-from-markdown',
  'mdast-util-phrasing',
  'mdast-util-to-hast',
  'mdast-util-to-markdown',
  'mdast-util-to-string',
  'micromark',
  'micromark-util-combine-extensions',
  'micromark-util-encode',
  'micromark-util-html-tag-name',
  'micromark-util-resolve-all',
  'micromark-util-symbol',
  'property-information',
  'space-separated-tokens',
  'stringify-entities',
  'trim-lines',
  'trough',
  'unified',
  'unist-util-is',
  'unist-util-generated',
  'unist-util-position',
  'unist-util-stringify-position',
  'unist-util-visit',
  'vfile',
  'zwitch'
]);

module.exports = withTM({
  webpack5: true,
  reactStrictMode: true,
  env: {
    serviceWorkerUrl
  },
  pageExtensions: ['ts', 'tsx'],
  excludeFile: (str) => /\/src\/sw\/.*/.test(str),
  webpack: (config, { isServer, dev, webpack, buildId }) => {
    config.module.rules.push(
      {
        test: /\.svg$/,
        loader: '@svgr/webpack'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    );

    if (!dev) {
      config.plugins.push(
        new CopyPlugin({ patterns: [{ from: 'src/guides', to: 'src/guides' }] })
      );
    }

    if (isServer && !dev) {
      generateSitemap(
        {
          baseUrl,
          skipIndex
        },
        sitemapDest
      );
    }

    if (!isServer) {
      const additionalManifestEntries = fs
        .readdirSync('public', { withFileTypes: true })
        /*
         * Add the public files to precache-manifest entries.
         *
         * We're creating an MD5 hash from file contents
         * to know if they've changed, so that the service worker
         * would know to recache them if they have.
         */
        .reduce((manifest, file) => {
          const { name } = file;

          // Filter out directories and hidden files.
          if (!file.isFile() || name.startsWith('.')) {
            return manifest;
          }

          return [
            ...manifest,
            {
              url: `/${name}`,
              revision: crypto
                .createHash('md5')
                .update(Buffer.from(fs.readFileSync(`public/${name}`)))
                .digest('hex')
            }
          ];
        }, []);

      /*
       * In development mode pre-cache files up-to 5MB
       */
      const maximumFileSizeToCacheInBytes = dev ? 5000000 : undefined;

      config.plugins.push(
        new WorkboxPlugin.InjectManifest({
          swSrc: path.resolve('src', 'sw', 'index.ts'),
          swDest: path.resolve(serviceWorkerDest),
          dontCacheBustURLsMatching: /^\/_next\/static\//,
          maximumFileSizeToCacheInBytes,
          additionalManifestEntries,
          webpackCompilationPlugins: [
            new webpack.DefinePlugin({
              'self.__BUILD_ID': JSON.stringify(buildId)
            })
          ],
          exclude: [
            /*
             * Filter out our API route,
             * we need this here because our api is a NextJS page,
             * and is treated as a static endpoint.
             */
            /\/api\//i,
            /^build-manifest\.json$/i,
            /^react-loadable-manifest\.json$/i,
            /\/react-refresh\.js$/i,
            /\/_error\.js$/i,
            /\.js\.map$/i,
            // Don't cache the `guides/*.md` sources since their HTML is cached.
            /\/guides\/.*\.md$/i,
            /*
             * Since we're using variable fonts
             * we don't want to pre-cache any,
             * otherwise we're downloading both
             * variable & regular fonts.
             */
            /\.(ttf|woff)/i
          ],
          modifyURLPrefix: {
            'static/': '/_next/static/'
          }
        })
      );
    }

    return config;
  },
  headers: () => [
    {
      /*
       * Since we're outputing service worker
       * with static files in /_next/static directory
       * we have to return the service worker file with an additional header
       * so that the browser would know that it's safe to run it on the root scope.
       */
      source: serviceWorkerUrl,
      headers: [
        {
          key: 'service-worker-allowed',
          value: '/'
        }
      ]
    }
  ]
});
