import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import {
  FiHome,
  FiShoppingCart,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiUser,
  FiGrid,
  FiArchive 
} from "react-icons/fi";

import { isAuthenticated, logout, getUser } from "../../services/auth";
import { CartContext } from "../../contexts/CartContext";

import styles from "./style.module.css";

export default class Navbar extends Component {
  static contextType = CartContext;

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

    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
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

  closeMobileMenu = () => {
    this.setState({ isMobileMenuOpen: false });
  }

  closeAllMenus = () => {
    this.setState({ isMobileMenuOpen: false, isSubmenuOpen: false });
  }

  toggleSubmenu = () => {
    this.setState((prevState) => ({
      isSubmenuOpen: !prevState.isSubmenuOpen,
    }));
  };

  handleLogout = () => {
    this.closeAllMenus();
    logout();
    window.location.href = "/login"; 
  };

  getUserInitial = () => {
    const { user } = this.state;
    return user && user.name ? user.name.charAt(0).toUpperCase() : <FiUser />;
  };

  render() {
    const { isMobileMenuOpen, authenticated, isSubmenuOpen } = this.state;
    
    const { cartItems } = this.context;
    const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const getNavLinkClass = ({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ""}`;

    return (
      <header className={styles.navbar}>
        <NavLink to="/" className={styles.brand} onClick={this.closeMobileMenu}>
          <img src="/gfx/logo.png" alt="Logo" className={styles.logo} />
        </NavLink>

        <nav
          className={`${styles.links} ${isMobileMenuOpen ? styles.mobileActive : ""}`}
        >
          <NavLink to="/" className={getNavLinkClass} onClick={this.closeMobileMenu}>
            <FiHome /> Home
          </NavLink>

          {authenticated ? (
            <>
              <NavLink to="/shop" className={getNavLinkClass} onClick={this.closeMobileMenu}>
                <FiGrid /> Loja
              </NavLink>

              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `${getNavLinkClass({ isActive })} ${styles.cartLinkContainer}`
                }
                onClick={this.closeMobileMenu}
              >
                <FiShoppingCart />
                <span>Carrinho</span>
                {totalItemsInCart > 0 && (
                  <span className={styles.cartCount}>{totalItemsInCart}</span>
                )}
              </NavLink>

              <div className={styles.avatarContainer} ref={this.submenuRef}>
                <div className={styles.avatar} onClick={this.toggleSubmenu}>
                  {this.getUserInitial()}
                </div>
                {isSubmenuOpen && (
                  <div className={styles.submenu}>
                    <NavLink
                      to="/dashboard"
                      className={styles.submenuLink}
                      onClick={this.closeAllMenus}
                    >
                      <FiGrid /> Dashboard
                    </NavLink>
                    <NavLink
                      to="/orders"
                      className={styles.submenuLink}
                      onClick={this.closeAllMenus}
                    >
                      <FiArchive /> Meus Pedidos
                    </NavLink>
                    <button onClick={this.handleLogout} className={styles.submenuLogout}>
                      <FiLogOut /> Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getNavLinkClass} onClick={this.closeMobileMenu}>
                <FiLogIn /> Login
              </NavLink>
              <NavLink to="/register" className={getNavLinkClass} onClick={this.closeMobileMenu}>
                <FiUserPlus /> Registro
              </NavLink>
            </>
          )}
        </nav>

        <div
          className={`${styles.burger} ${isMobileMenuOpen ? styles.open : ""}`}
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