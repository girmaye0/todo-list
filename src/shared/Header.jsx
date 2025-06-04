import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

function Header({ title }) {
  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>{title}</h1>
      <nav className={styles.navbar}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeNavLink : styles.inactiveNavLink
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? styles.activeNavLink : styles.inactiveNavLink
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
