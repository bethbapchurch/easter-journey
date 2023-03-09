import React from 'react';
import Head from 'next/head';
import Image from 'components/image';
import styles from './About.module.scss';

const { about, aboutMain, aboutPicture, aboutContent, appAbout } = styles;

export default function About(): JSX.Element {
  return (
    <>
      <Head>
        <title>About</title>
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
          <p>
            Aliquam aliquet tempus metus et varius. Etiam convallis nunc at
            magna venenatis, vitae egestas nibh accumsan. Nam auctor neque eget
            odio pretium, non lobortis sem condimentum. Vestibulum tempus risus
            vel est tristique, sed malesuada leo facilisis. Etiam sagittis leo
            eget augue ullamcorper sagittis. Fusce efficitur convallis turpis,
            sed faucibus diam lobortis ac. Morbi tincidunt purus tincidunt,
            maximus est vitae, semper erat. Pellentesque dictum in nunc eu
            porttitor. Integer vitae justo sit amet metus malesuada eleifend.
          </p>
        </div>
      </main>
    </>
  );
}
