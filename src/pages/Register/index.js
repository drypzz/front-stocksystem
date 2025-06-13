import React, { Component } from "react";

import { FiEye, FiEyeOff, FiUserPlus, FiLoader } from "react-icons/fi";

import api from "../../services/api";

import ToastService from "../../services/toastservice";

import styles from "./style.module.css";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  togglePasswordVisibility = (field) => {
    this.setState((prev) => ({ [field]: !prev[field] }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = this.state;

    if (!name || !email || !password || !confirmPassword) {
      ToastService.show({ type: "error", message: "Por favor, preencha todos os campos." });
      return;
    }

    if (password !== confirmPassword) {
      ToastService.show({
        key: "password-mismatch",
        type: "error",
        message: "As senhas não coincidem."
      });
      return;
    }

    this.setState({ isLoading: true });

    try {
      await api.post("/register", { name, email, password });

      ToastService.show({ type: "success", message: "Cadastro realizado com sucesso! Redirecionando para o login..." });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err) {
      const message = err.response?.data?.message || "Erro ao realizar o cadastro. Tente novamente.";
      ToastService.show({ type: "error", message });
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { name, email, password, confirmPassword, showPassword, showConfirmPassword, isLoading } = this.state;

    return (
      <div className={styles.container}>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <h2 className={styles.title}>Registrar-se</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={this.handleChange}
              placeholder="Seu nome completo"
              disabled={isLoading}
              autoComplete="name"
            />
          </div>

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
                autoComplete="new-password"
              />
              <button type="button" className={styles.iconButton} onClick={() => this.togglePasswordVisibility("showPassword")} disabled={isLoading}>
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={this.handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button type="button" className={styles.iconButton} onClick={() => this.togglePasswordVisibility("showConfirmPassword")} disabled={isLoading}>
                {showConfirmPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? (
              <><FiLoader className={styles.spinner} /> Registrando...</>
            ) : (
              <><FiUserPlus /> Registrar</>
            )}
          </button>

          <p className={styles.link}>
            Já possui uma conta? <a href="/login">Entrar</a>
          </p>
        </form>
      </div>
    );
  }
}