import { NextApiRequest, NextApiResponse } from 'next';
import { getSortedGuidesData } from 'lib/guides';
import _schema from 'pages/api/_content/schema.json';

export interface Schema {
  [key: string]: {
    title: string;
    description?: string;
  };
}

export function getGuidesSchema(): Schema {
  const guidesData = getSortedGuidesData();
  const guidesSchema = guidesData.reduce(
    (gs, g) => ({
      ...gs,
      [g.id]: { title: g.title }
    }),
    {}
  );
  return guidesSchema;
}

export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<Schema>
): void {
  const guidesSchema = getGuidesSchema();
  const schema: Schema = { ..._schema, ...guidesSchema };

  res.status(200).json(schema);
}
