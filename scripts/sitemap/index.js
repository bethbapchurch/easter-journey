const path = require('path');
const { promises: fs } = require('fs');
const { default: getRouteFromAssetPath } = require('next/dist/shared/lib/router/utils/get-route-from-asset-path');
const matter = require('gray-matter');
const generateSitemap = require('./generateSitemap');
const root = process.cwd();

/*
 * Include a list of async functions that will get called to generate a sitemap.
 * Each function should return an array of objects, including the required fields by the sitemap protocol.
 * https://www.sitemaps.org/protocol.html
 *
 * Example return value:
 * [
 *  {
 *      loc: 'https://pwa-boilerplate.com/', // Required 
 *      lastmod: '1917-11-18', // Optional
 *      changefreq: 'monthly', // Optional
 *      priority: '0.7' // Optional (defaults to 0.5)
 *  }
 * ]
 */

/*
 * Add the default next.js pages.
 *
 * Ignores api directory and anything that starts with _, [ or .
 */
const addStaticPages = async ({ baseUrl, skipIndex }) => {
    const getDirents = (path) => fs.readdir(path, { withFileTypes: true });

    const direntsToRoutes = async (dirents, directory) => {
        const routes = [];

        for (dirent of dirents) {
            const { name } = dirent;
            const startChar = name.charAt(0);
            const isAPIDirectory = dirent.isDirectory() && name === 'api';

            if (['.', '_', '['].includes(startChar) || isAPIDirectory) {
                continue;
            }

            if (dirent.isDirectory()) {
                const direntDirectory = path.resolve(directory, name);
                const directoryDirents = await getDirents(direntDirectory);
                const directoryRoutes = await direntsToRoutes(directoryDirents, direntDirectory);

                routes.push(...directoryRoutes);
            }

            const route = getRouteFromAssetPath(`/${name}`, '.tsx');
            const isNotIndexable = skipIndex.includes(route);

            if (isNotIndexable) {
                continue;
            }

            routes.push({ loc: `${baseUrl}${route}` });
        }

        return routes;
    };

    const directory = path.resolve(root, 'src', 'pages');
    const dirents = await getDirents(directory);

    return direntsToRoutes(dirents, directory);
};

const guidesDirectory = path.resolve(root, 'src', 'guides');

async function getSortedGuidesData() {
    // Get file names under /guides
    const fileNames = await fs.readdir(guidesDirectory);
    const allGuidesData = fileNames.map(async (fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(guidesDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            id,
            ...(matterResult.data)
        };
    });
    return allGuidesData;
}

async function getGuidesSchema() {
    const guidesData = await getSortedGuidesData();
    const guidesSchema = guidesData.reduce(
        (gs, g) => ({
            ...gs,
            [g.id]: { title: g.title }
        }),
        {}
    );
    return guidesSchema;
}

/*
 * Get our api pages
 */
const addDynamicPages = async ({ baseUrl }) => {
    const _schema = await require(path.resolve(root, 'src/pages/api/_content/schema.json'));
    const guidesSchema = getGuidesSchema();
    const schema = { ..._schema, ...guidesSchema };

    return Object.keys(schema).map(page => ({ loc: `${baseUrl}/${page}` }));
};

module.exports = (...args) => (
    generateSitemap([
        addStaticPages,
        addDynamicPages
    ], ...args)
);
