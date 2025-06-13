import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FiArrowRight } from "react-icons/fi";

import styles from "./style.module.css";

export default class Main extends Component {

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.mainContent}>
          <h1 className={styles.mainTitle}>Bem-vindo à Nossa Loja</h1>
          <p className={styles.mainDescription}>
            Explore nossa coleção exclusiva de produtos selecionados especialmente para você. Qualidade, inovação e estilo em um só lugar.
          </p>
          <Link to="/shop" className={styles.mainButton}>
            <span>Ir para a Loja</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }
}