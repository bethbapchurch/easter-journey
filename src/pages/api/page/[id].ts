import { NextApiRequest, NextApiResponse } from 'next';
import { getGuideData, getSortedGuidesData } from 'lib/guides';
import _pages from 'pages/api/_content/pages';
import _schema from 'pages/api/_content/schema.json';
import { Schema } from '../schema';

interface Pages {
  [key: string]: string;
}

interface JsonBody {
  id: string;
  title: string;
  description?: string;
  content: string;
}

const pages = _pages as Pages;
const schema = _schema as Schema;

const guidesData = getSortedGuidesData();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JsonBody>
): Promise<void> {
  const { query } = req;
  const id = query.id as string;
  let json: JsonBody | undefined;

  if (!(id in schema)) {
    if (guidesData.find((g) => g.id === id)) {
      const guideData = await getGuideData(id);
      json = { id, title: guideData.title, content: guideData.contentHtml };
    } else {
      res.status(404);
    }
  }

  if (!json) {
    const { title, description } = schema[id];
    const content = pages[id];
    json = {
      id,
      title,
      description,
      content
    };
  }

  res.status(200).json(json);
}
