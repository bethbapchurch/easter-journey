import React from 'react';
import styles from './Footer.module.scss';

const { footer } = styles;

export default function Footer(): JSX.Element {
  return (
    <footer className={footer}>
      <p>© Easter Journey</p>
      <p>by</p>
      <p>
        <a href="https://bethlehem.org.nz/" target="_blank" rel="noreferrer">
          Bethlehem Baptist Church
        </a>
      </p>
    </footer>
  );
}
