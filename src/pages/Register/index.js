import React, { Component } from 'react';

import { FiEye, FiEyeOff } from 'react-icons/fi';

import styles from './style.module.css';

import api from '../../services/api';

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

    if (password !== confirmPassword) {
      this.setState({ error: 'As senhas não coincidem.' });
      return;
    }

    try {
      await api.post('/register', { name, email, password })
      window.location.href = '/login';
    } catch (err) {
      this.setState({
        error: err.response?.data?.message || 'Erro ao registrar.',
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
              placeholder="Seu nome completo"
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
              placeholder="email@exemplo.com"
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
              />
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => this.togglePasswordVisibility('showPassword')}
              >
                {showPassword ?
                  <FiEye size={18} />
                  :
                  <FiEyeOff size={18} />
                }
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
              />
              <button
                type="button"
                className={styles.iconButton}
                onClick={() =>
                  this.togglePasswordVisibility('showConfirmPassword')
                }
              >
                {showConfirmPassword ? (
                  <FiEye size={18} />
                ) : (
                  <FiEyeOff size={18} />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Registrar
          </button>

          <p className={styles.link}>
            Já possui uma conta? <a href="/login">Entrar</a>
          </p>
        </form>
      </div>
    );
  }
}
