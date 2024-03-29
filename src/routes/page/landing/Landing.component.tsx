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
          <p>A reflective walk-through of the Easter story</p>
          <h2>
            <em>
              Revisit the Easter story at Bethlehem Baptist Church’s popular,
              reflective walk-through Easter Journey exhibition from April 6th
              to April 9th.
            </em>
          </h2>
          <p>
            Visitors will embark on a reflective walk-through of the Easter
            story, depicting Christ’s early life, ministry, death, and
            resurrection brought to life through visually stunning displays and
            multi-sensory experiences.
          </p>
        </div>
        <div className={landingNavigationWrapper}>
          <a
            href="https://bethlehem.org.nz/easter-journey/"
            target="_blank"
            rel="noreferrer"
          >
            At Bethlehem Baptist Church
          </a>
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
