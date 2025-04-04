import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.a}></div>
          <div className={styles.a}></div>
          <div className={styles.a}></div>
          <div className={styles.a}></div>
          <div className={styles.a}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader; 