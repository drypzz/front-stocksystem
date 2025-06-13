import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FiCompass, FiArrowLeft } from "react-icons/fi";

import styles from "./style.module.css";

export default class NotFound extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <FiCompass className={styles.icon} />
          <h1 className={styles.title}>404</h1>
          <p className={styles.text}>Página Não Encontrada</p>
          <p className={styles.subtext}>
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
          <Link to="/" className={styles.homeLink}>
            <FiArrowLeft /> Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }
}