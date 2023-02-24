import React from 'react';
import Image from 'components/image';
import styles from './Landing.module.scss';

const {
  wrapper,
  landing,
  landingText,
  landingImage,
  landingNavigationWrapper
} = styles;

export default function Landing(): JSX.Element {
  return (
    <div className={wrapper}>
      <div className={landing}>
        <div className={landingText}>
          <h1>Easter Journey</h1>
          <p>
            Designed to help you kick-start your next project.
            <br />
            This boilerplate is production ready and comes with a service
            worker, redux store, dark-mode, router, and plenty other useful
            features.
          </p>
        </div>
        <div className={landingNavigationWrapper}>
          <a
            href="https://github.com/bethbapchurch/easter-journey"
            target="_blank"
            rel="noreferrer"
          >
            View source code on GitHub
          </a>
          <p>Available under MIT license</p>
        </div>
        <Image
          className={landingImage}
          src="/assets/EJ_bLogo_512x360.png"
          alt="Easter Journey Application"
          width="512px"
          height="360px"
        />
      </div>
    </div>
  );
}
