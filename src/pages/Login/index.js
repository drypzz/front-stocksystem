import React, { Component } from "react";

import { FiEye, FiEyeOff, FiLogIn, FiLoader } from "react-icons/fi";

import api from "../../services/api";

import { login, isAuthenticated } from "../../services/auth";

import ToastService from "../../services/toastservice";

import styles from "./style.module.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showPassword: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    if (isAuthenticated()) {
      window.location.href = "/shop";
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  togglePasswordVisibility = () => {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (!email || !password) {
      ToastService.show({ type: "error", message: "Por favor, preencha o email e a senha." });
      return;
    }

    this.setState({ isLoading: true });

    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      login(token, user);
      
      setTimeout(() => {
        window.location.href = "/shop";
      }, 1500);

    } catch (err) {
      const message = err.response?.data?.message || "Email ou senha inválidos. Tente novamente.";
      ToastService.show({ type: "error", message });
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { email, password, showPassword, isLoading } = this.state;

    return (
      <div className={styles.container}>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <h2 className={styles.title}>Entrar</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={this.handleChange}
              placeholder="exemplo@email.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={this.handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.iconButton}
                onClick={this.togglePasswordVisibility}
                aria-label="Mostrar/ocultar senha"
                disabled={isLoading}
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? (
              <><FiLoader className={styles.spinner} /> Entrando...</>
            ) : (
              <><FiLogIn /> Entrar</>
            )}
          </button>

          <p className={styles.link}>
            Não tem uma conta? <a href="/register">Cadastre-se</a>
          </p>
        </form>
      </div>
    );
  };
};