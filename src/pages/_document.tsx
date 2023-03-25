import React from 'react';
  // eslint-disable-next-line @next/next/no-document-import-in-page
  import SourceDocument, { Html, Head, Main, NextScript } from 'next/document';

export default class Document extends SourceDocument {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
