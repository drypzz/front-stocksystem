import React, { Component } from 'react';

import { FiEye, FiEyeOff, FiUserPlus, FiLoader } from 'react-icons/fi';

import api from '../../services/api';

import styles from './style.module.css';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      error: '',
      isLoading: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  togglePasswordVisibility = (field) => {
    this.setState((prev) => ({
      [field]: !prev[field],
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = this.state;

    this.setState({ isLoading: true, error: '' });

    if (password !== confirmPassword) {
      this.setState({ error: 'As senhas não coincidem.', isLoading: false });
      return;
    }

    try {
      await api.post('/register', { name, email, password });

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);

    } catch (err) {
      this.setState({
        error: err.response?.data?.message || 'Erro ao registrar.',
        isLoading: false,
      });
    }
  };

  render() {
    const {
      name,
      email,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      error,
      isLoading,
    } = this.state;

    return (
      <div className={styles.container}>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <h2 className={styles.title}>Registrar-se</h2>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={this.handleChange}
              placeholder="Seu nome"
              disabled={isLoading}
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
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={password}
                onChange={this.handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => this.togglePasswordVisibility('showPassword')}
                disabled={isLoading}
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={this.handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => this.togglePasswordVisibility('showConfirmPassword')}
                disabled={isLoading}
              >
                {showConfirmPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? (
              <>
                <FiLoader className={styles.spinner} /> Registrando...
              </>
            ) : (
              <>
                <FiUserPlus /> Registrar
              </>
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