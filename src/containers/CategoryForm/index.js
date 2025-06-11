import React, { Component } from 'react';
import api from '../../services/api'; // 1. Importamos nosso serviço de API
import styles from './style.module.css';

export default class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      error: null,
      success: null,
      loading: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      this.setState({ name: '', error: null, success: null, loading: false });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ error: null, success: null, loading: true });
    const { name } = this.state;

    if (!name.trim()) {
      this.setState({ error: 'O nome da categoria é obrigatório.', loading: false });
      return;
    }

    try {
      await api.post('/category', { name });

      this.setState({
        success: `Categoria "${name}" cadastrada com sucesso!`,
        name: '',
        loading: false,
      });

      setTimeout(() => {
        if (this.props.onSuccess) {
          this.props.onSuccess();
        }
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao cadastrar categoria. Verifique se ela já existe.';
      this.setState({ error: errorMessage, loading: false });
      console.error("Erro ao cadastrar categoria:", err);
    }
  };

  render() {
    const { name, error, success, loading } = this.state;
    return (
      <form className={styles.form} onSubmit={this.handleSubmit}>
        <h2 className={styles.title}>Nova Categoria</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="categoryName">Nome da Categoria</label>
          <input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e) => this.setState({ name: e.target.value })}
            placeholder="Ex: Eletrônicos"
            disabled={loading}
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    );
  }
}