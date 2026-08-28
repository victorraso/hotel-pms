import styles from './Spinner.module.css';

export default function Spinner({ size = '40px', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="bg-bg text-txt flex h-dvh flex-col items-center justify-start gap-5 pt-[15%]">
        <div
          className={styles.spinner}
          style={{ '--spinner-size': size }}
        ></div>
        <span>loading...</span>
      </div>
    );
  }

  return (
    <div className={styles.spinner} style={{ '--spinner-size': size }}></div>
  );
}
