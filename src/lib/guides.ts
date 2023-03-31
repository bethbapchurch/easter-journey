import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

let root = process.cwd();
if (process.env.NODE_ENV === 'production') {
  root = path.join(process.cwd(), '.next/server/chunks');
}
const guidesDirectory = path.resolve(root, 'src', 'guides');

export function getSortedGuidesData(): {
  date: string;
  title: string;
  id: string;
}[] {
  // Get file names under /guides
  const fileNames = fs.readdirSync(guidesDirectory);
  const allGuidesData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(guidesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as { date: string; title: string })
    };
  });
  // Sort guides by leading number in id
  return allGuidesData.sort((a, b) => {
    const _a = +a.id.split('-')[0];
    const _b = +b.id.split('-')[0];
    return _a - _b;
  });
}

export function getAllGuideIds(): {
  params: {
    id: string;
  };
}[] {
  const fileNames = fs.readdirSync(guidesDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    };
  });
}

export async function getGuideData(id: string): Promise<{
  date: string;
  title: string;
  id: string;
  contentHtml: any;
}> {
  const fullPath = path.join(guidesDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string })
  };
}
