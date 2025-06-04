import React from "react";
import { Link } from "react-router-dom";
import styles from "../App.module.css";

function NotFound() {
  return (
    <div className={styles.aboutPage}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className={styles.navLink}>
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
