import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useSwipeable } from 'react-swipeable';
import Landing from 'routes/page/landing';
import A2HS from 'components/a2hs';
import Sidebar from 'components/sidebar';
import Html from 'components/html';
import { usePageData, usePageDetails, useSchema } from 'hooks/page';
import { injectClassNames } from 'utils/css';
import styles from './Page.module.scss';

const { page, pageLanding, pageContent, placeholder } = styles;

type PageProps = {
  isLanding?: boolean;
};

export const addTitleTags = (title: string): JSX.Element => {
  if (!title) {
    return <></>;
  }

  return (
    <>
      <title>{title}</title>
      <meta name="og:title" content={title} />
    </>
  );
};

export const addDescriptionTag = (description: string): JSX.Element => {
  if (!description) {
    return <></>;
  }

  return (
    <meta name="description" property="og:description" content={description} />
  );
};

export default function Page(props: PageProps): JSX.Element {
  const { isLanding } = props;
  const { title = '', description = '' } = usePageDetails();
  const { content = '' } = usePageData();

  const classNames = injectClassNames(page, [pageLanding, isLanding]);

  const { home, about, ...schema } = useSchema();
  const routes = Object.keys(schema);

  const router = useRouter();
  const route = router.query.page;

  const config = {};
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (router.asPath === '/') return;
      if (typeof route !== 'string') return;
      if (!routes.includes(route)) return;

      const routeIndex = routes.indexOf(route);
      switch (eventData.dir) {
        case 'Left':
        case 'Up':
          // already at the last page?
          if (routeIndex >= routes.length - 1) return;
          // move forward a page
          router.push(`/${routes[routeIndex + 1]}`);
          break;
        case 'Right':
        case 'Down':
          // already at the first page?
          if (routeIndex <= 0) return;
          // move back a page
          router.push(`/${routes[routeIndex - 1]}`);
          break;
        default:
          break;
      }
    },
    ...config
  });

  return (
    <>
      <Head>
        {addTitleTags(title)}
        {addDescriptionTag(description)}
        <meta name="robots" content="INDEX,FOLLOW" />
      </Head>
      <main className={classNames} {...handlers}>
        {isLanding && <Landing />}
        <section>
          <div className={pageContent}>
            <A2HS />
            <div className={pageContent}>
              {content ? (
                <Html content={content} />
              ) : (
                <>
                  <figure className={placeholder} />
                  <figure className={placeholder} />
                  <figure className={placeholder} />
                </>
              )}
            </div>
          </div>
          <Sidebar />
        </section>
      </main>
    </>
  );
}
