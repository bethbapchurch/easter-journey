import React from 'react';
import Head from 'next/head';
import Pages from 'components/pages';
import Placeholder from 'components/placeholder';
import styles from './PageList.module.scss';

const { pageList, pageListContainer } = styles;

export default function PageList(): JSX.Element {
  return (
    <>
      <Head>
        <title>EJ Guide</title>
      </Head>
      <main className={pageList}>
        <h1>Easter Journey Guide</h1>
        <p>
          Work through the stations in the order shown.
          <br />
          Read the description at each station. Take your time.
          <br />
          <br />
          <small>
            *Parental guidance is recommended for under-12s, and there is one
            area specifically PG15.
          </small>
        </p>
        <Pages className={pageListContainer}>
          <li>
            <Placeholder length="medium" />
          </li>
          <li>
            <Placeholder length="medium" />
          </li>
          <li>
            <Placeholder length="medium" />
          </li>
          <li>
            <Placeholder length="medium" />
          </li>
          <li>
            <Placeholder length="medium" />
          </li>
        </Pages>
      </main>
    </>
  );
}
