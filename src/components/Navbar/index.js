import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './style.module.css';

import { isAuthenticated, logout } from '../../services/auth';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobileMenuOpen: false,
      authenticated: false,
    };
  }

  componentDidMount() {
    this.setState({ authenticated: isAuthenticated() });
  }

  toggleMenu = () => {
    this.setState((prev) => ({
      isMobileMenuOpen: !prev.isMobileMenuOpen,
    }));
  };

  handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  render() {
    const { isMobileMenuOpen, authenticated } = this.state;

    return (
      <header className={styles.navbar}>
        <div className={styles.brand}>
          <a href='/'>STK</a>
        </div>

        <nav
          className={`${styles.links} ${
            isMobileMenuOpen ? styles.mobileActive : ''
          }`}
        >
          {authenticated ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                Dashboard
              </NavLink>
              <button onClick={this.handleLogout} className={styles.logout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                Registro
              </NavLink>
            </>
          )}
        </nav>

        <div
          className={`${styles.burger} ${
            isMobileMenuOpen ? styles.open : ''
          }`}
          onClick={this.toggleMenu}
          aria-label="Abrir menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>
    );
  }
}
