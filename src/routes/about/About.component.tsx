import React from 'react';
import Head from 'next/head';
import Html from 'components/html';
import Image from 'components/image';
import { usePageData } from 'hooks/page';
import styles from './About.module.scss';

const {
  about,
  aboutMain,
  aboutPicture,
  aboutContent,
  appAbout,
  appAboutContent,
  placeholder
} = styles;

export default function About(): JSX.Element {
  const { content = '' } = usePageData();

  return (
    <>
      <Head>
        <title>About EJ</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={about}>
        <div className={aboutMain}>
          <Image
            src="api/assets/bbc-logo.png"
            className={aboutPicture}
            alt="BBC Logo"
          />
          <div className={aboutContent}>
            <h1>Easter Journey</h1>
            <p>is a ministry of</p>
            <h1>Bethlehem Baptist Church</h1>
            <p>
              <i>where new hope is born</i>
            </p>
          </div>
        </div>
        <div className={appAbout}>
          <h2>About This App</h2>
          <div className={appAboutContent}>
            {content ? (
              <Html content={content} />
            ) : (
              <>
                <figure className={placeholder} />
                <figure className={placeholder} />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
