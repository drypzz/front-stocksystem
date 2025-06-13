import React, { Component } from "react";

import { FiSave, FiPlus, FiLoader } from "react-icons/fi";

import api from "../../services/api";

import ToastService from "../../services/toastservice";

import styles from "./style.module.css";

export default class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      category: { name: "" },
    };
    this.state = {
      category: props.categoryToEdit || this.initialState.category,
      isLoading: false,
    };
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState(prevState => ({
      category: { ...prevState.category, name: value }
    }));
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { category } = this.state;
    const isEditing = !!category.id;

    if (!category.name.trim()) {
      ToastService.show({ type: "error", message: "O nome da categoria é obrigatório." });
      this.setState({ isLoading: false });
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/category/${category.id}`, { name: category.name });
      } else {
        await api.post("/category", { name: category.name });
      }

      const successMessage = `Categoria "${category.name}" ${isEditing ? "atualizada" : "cadastrada"} com sucesso!`;
      ToastService.show({ type: "success", message: successMessage });

      this.setState({ isLoading: false });

      if (this.props.onSuccess) {
        this.props.onSuccess();
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || `Falha ao ${isEditing ? "atualizar" : "cadastrar"} categoria.`;
      ToastService.show({ type: "error", message: errorMessage });
      this.setState({ isLoading: false });
      console.error(`Erro ao ${isEditing ? "atualizar" : "cadastrar"} categoria:`, err);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      this.setState({
        category: this.props.categoryToEdit || this.initialState.category,
        isLoading: false,
      });
    }
  }

  render() {
    const { category, isLoading } = this.state;
    const isEditing = !!category.id;

    return (
      <form className={styles.form} onSubmit={this.handleSubmit}>
        <h2 className={styles.title}>{isEditing ? "Editar Categoria" : "Nova Categoria"}</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="categoryName">Nome da Categoria *</label>
          <input
            type="text"
            id="categoryName"
            name="name"
            value={category.name || ""}
            onChange={this.handleChange}
            placeholder="Ex: Eletrônicos"
            disabled={isLoading}
            autoComplete="off"
          />
        </div>

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? (
            <><FiLoader className={styles.spinner} /> {isEditing ? "Salvando..." : "Cadastrando..."}</>
          ) : (
            <>{isEditing ? <FiSave /> : <FiPlus />} {isEditing ? "Salvar Alterações" : "Cadastrar Categoria"}</>
          )}
        </button>
      </form>
    );
  }
}