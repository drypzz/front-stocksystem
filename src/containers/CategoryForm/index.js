import React, { Component } from 'react';
import api from '../../services/api';
import styles from './style.module.css';

export default class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      category: { name: '' },
    };
    this.state = {
      category: props.categoryToEdit || this.initialState.category,
      error: null,
      success: null,
      loading: false,
    };
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState(prevState => ({
      category: {
        ...prevState.category,
        name: value
      }
    }));
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ error: null, success: null, loading: true });
    
    const { category } = this.state;
    const isEditing = !!category.id;

    if (!category.name.trim()) {
      this.setState({ error: 'O nome da categoria é obrigatório.', loading: false });
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/category/${category.id}`, { name: category.name });
      } else {
        await api.post('/category', { name: category.name });
      }

      this.setState({
        success: `Categoria "${category.name}" ${isEditing ? 'atualizada' : 'cadastrada'} com sucesso!`,
        loading: false,
      });

      setTimeout(() => {
        if (this.props.onSuccess) {
          this.props.onSuccess();
        }
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || `Falha ao ${isEditing ? 'atualizar' : 'cadastrar'} categoria.`;
      this.setState({ error: errorMessage, loading: false });
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} categoria:`, err);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      const categoryToEdit = this.props.categoryToEdit;
      
      this.setState({
        category: categoryToEdit || this.initialState.category,
        error: null,
        success: null,
        loading: false,
      });
    }
  }

  render() {
    const { category, error, success, loading } = this.state;
    const isEditing = !!category.id;

    return (
      <form className={styles.form} onSubmit={this.handleSubmit}>
        <h2 className={styles.title}>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="categoryName">Nome da Categoria</label>
          <input
            type="text"
            id="categoryName"
            value={category.name || ''}
            onChange={this.handleChange}
            placeholder="Ex: Eletrônicos"
            disabled={loading}
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? (isEditing ? 'Salvando...' : 'Cadastrando...') : (isEditing ? 'Salvar Alterações' : 'Cadastrar')}
        </button>
      </form>
    );
  }
}