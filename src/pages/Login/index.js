import React, { Component } from 'react';
import styles from './style.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import api from '../../services/api';
import { login, isAuthenticated } from '../../services/auth';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      error: '',
    };
  }

  componentDidMount() {
    if (isAuthenticated()) {
      window.location.href = '/dashboard';
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  togglePasswordVisibility = () => {
    this.setState((prev) => ({
      showPassword: !prev.showPassword,
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      const response = await api.post('/login', { email, password });
      const { token } = response.data;

      login(token);
      window.location.href = '/dashboard';
    } catch (err) {
      this.setState({
        error: err.response?.data?.message || 'Erro ao fazer login.',
      });
    }
  };

  render() {
    const { email, password, showPassword, error } = this.state;

    return (
      <div className={styles.container}>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <h2 className={styles.title}>Entrar na Plataforma</h2>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={this.handleChange}
              placeholder="exemplo@email.com"
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
                onClick={this.togglePasswordVisibility}
                aria-label="Mostrar/ocultar senha"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Entrar
          </button>

          <p className={styles.link}>
            Não tem uma conta? <a href="/register">Cadastre-se</a>
          </p>
        </form>
      </div>
    );
  }
}
