import React, { Component } from 'react';
import styles from './style.module.css';
import { Link } from 'react-router-dom';

export default class NotFound extends Component {
  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.text}>Página não encontrada</p>
        <Link to="/" className={styles.homeLink}>Voltar para o Início</Link>
      </div>
    );
  }
}