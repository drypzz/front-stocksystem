import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { isAuthenticated, logout, getUser } from '../../services/auth';

import {
  FiHome,
  FiShoppingCart,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiUser,
  FiGrid
} from 'react-icons/fi';

import styles from './style.module.css';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobileMenuOpen: false,
      isSubmenuOpen: false,
      authenticated: false,
      user: null,
    };
    this.submenuRef = React.createRef();
  }

  componentDidMount() {
    const authenticated = isAuthenticated();
    this.setState({ authenticated });

    if (authenticated) {
      this.setState({ user: getUser() });
    }

    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.submenuRef.current && !this.submenuRef.current.contains(event.target)) {
      this.setState({ isSubmenuOpen: false });
    }
  };

  toggleMobileMenu = () => {
    this.setState((prevState) => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }));
  };

  toggleSubmenu = () => {
    this.setState((prevState) => ({
      isSubmenuOpen: !prevState.isSubmenuOpen,
    }));
  };

  handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  getUserInitial = () => {
    const { user } = this.state;
    return user && user.name ? user.name.charAt(0).toUpperCase() : <FiUser />;
  };

  getUserName = () => {
    const { user } = this.state;
    return user && user.name ? user.name : 'Usuário';
  }

  render() {
    const { isMobileMenuOpen, authenticated, isSubmenuOpen } = this.state;

    const getNavLinkClass = ({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ''}`;

    return (
      <header className={styles.navbar}>
        <NavLink to="/" className={styles.brand}>STK</NavLink>

        <nav
          className={`${styles.links} ${isMobileMenuOpen ? styles.mobileActive : ''
            }`}
        >
          <NavLink to="/" className={getNavLinkClass}>
            <FiHome /> Home
          </NavLink>
          {authenticated ? (
            <>
              <NavLink to="/shop" className={getNavLinkClass}>
                <FiShoppingCart /> Loja
              </NavLink>
              <div className={styles.avatarContainer} ref={this.submenuRef}>
                <div className={styles.avatar} onClick={this.toggleSubmenu}>
                  {this.getUserInitial()}
                </div>
                {isSubmenuOpen && (
                  <>
                    <div className={styles.submenu}>
                      <NavLink 
                        to="/dashboard" 
                        className={styles.submenuLink} 
                        onClick={this.closeSubmenu}
                      >
                        <FiGrid /> Dashboard
                      </NavLink>
                      <button onClick={this.handleLogout} className={styles.submenuLogout}>
                        <FiLogOut /> Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getNavLinkClass}>
                <FiLogIn /> Login
              </NavLink>
              <NavLink to="/register" className={getNavLinkClass}>
                <FiUserPlus /> Registro
              </NavLink>
            </>
          )}
        </nav>

        <div
          className={`${styles.burger} ${isMobileMenuOpen ? styles.open : ''
            }`}
          onClick={this.toggleMobileMenu}
          aria-label="Alternar menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </div>
      </header>
    );
  }
}