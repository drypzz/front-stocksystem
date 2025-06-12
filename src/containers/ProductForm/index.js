import React, { Component } from 'react';

import { FiPlus, FiSave, FiLoader } from 'react-icons/fi';

import Dropdown from '../../components/Dropdown';

import api from '../../services/api';

import styles from './style.module.css';

export default class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            product: { name: '', description: '', price: '', quantity: '', categoryId: '' },
        };
        this.state = {
            product: props.productToEdit || this.initialState.product,
            categories: props.categories || [],
            isLoading: false,
            error: null,
            success: null,
        };
    }

    fetchCategories = async () => {
        try {
            const response = await api.get('/category');
            const categoriesList = response.data?.categories || response.data;
            if (Array.isArray(categoriesList)) {
                this.setState({ categories: categoriesList });
            } else {
                this.setState({ categories: [], error: "Formato de categorias inválido." });
            }
        } catch (err) {
            this.setState({ error: 'Não foi possível carregar as categorias.' });
            console.error("Erro ao buscar categorias:", err);
        }
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            product: { ...prevState.product, [name]: value },
        }));
    };

    handleCategoryChange = (categoryId) => {
        this.setState(prevState => ({
            product: { ...prevState.product, categoryId: categoryId },
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ isLoading: true, error: null, success: null });
        const { product } = this.state;
        const isEditing = !!product.id;
        if (!product.name || !product.price || !product.quantity || !product.categoryId) {
            this.setState({ error: 'Preencha todos os campos obrigatórios (*).', isLoading: false });
            return;
        }
        const payload = {
            name: product.name,
            description: product.description,
            price: Number(product.price),
            quantity: Number(product.quantity),
            categoryId: Number(product.categoryId)
        };
        try {
            if (isEditing) {
                await api.put(`/product/${product.id}`, payload);
                this.setState({ success: 'Produto atualizado com sucesso!', isLoading: false });
            } else {
                await api.post('/product', payload);
                this.setState({ success: 'Produto cadastrado com sucesso!', isLoading: false });
            }
            setTimeout(() => {
                if (this.props.onSuccess) {
                    this.props.onSuccess();
                }
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || `Falha ao ${isEditing ? 'atualizar' : 'cadastrar'} produto.`;
            this.setState({ error: errorMessage, isLoading: false });
            console.error(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} produto:`, err);
        }
    };

    componentDidMount() {
        if (!this.props.categories || this.props.categories.length === 0) {
            this.fetchCategories();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.show && !prevProps.show) {
            const product = this.props.productToEdit || this.initialState.product;
            const hasCategories = Array.isArray(this.props.categories) && this.props.categories.length > 0;
            this.setState({
                product: {
                    ...product,
                    categoryId: product.categoryId?.toString() || '',
                },
                categories: this.props.categories || [],
                isLoading: false,
                error: null,
                success: null,
            }, () => {
                if (!hasCategories) {
                    this.fetchCategories();
                }
            });
        }
    }


    render() {
        const { product, categories, isLoading, error, success } = this.state;
        const isEditing = !!product.id;

        return (
            <form className={styles.form} onSubmit={this.handleSubmit}>
                <h2 className={styles.title}>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <div className={styles.inputGroup}>
                    <label htmlFor="name">Nome do Produto *</label>
                    <input type="text" id="name" name="name" autoComplete="off" value={product.name || ''} onChange={this.handleChange} disabled={isLoading} />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="description">Descrição *</label>
                    <textarea id="description" name="description" autoComplete="off" value={product.description || ''} onChange={this.handleChange} rows="3" disabled={isLoading}></textarea>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="price">Preço *</label>
                    <input type="number" id="price" name="price" autoComplete="off" value={product.price || ''} onChange={this.handleChange} step="0.01" placeholder="Ex: 19.99" disabled={isLoading} />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="quantity">Quantidade em Estoque *</label>
                    <input type="number" id="quantity" name="quantity" autoComplete="off" value={product.quantity || ''} onChange={this.handleChange} disabled={isLoading} />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="categoryId">Categoria *</label>
                    <Dropdown
                        options={categories}
                        value={product.categoryId}
                        onChange={this.handleCategoryChange}
                        placeholder="Selecione uma categoria"
                        disabled={isLoading}
                    />
                </div>

                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <FiLoader className={styles.spinner} />
                            {isEditing ? 'Salvando...' : 'Cadastrando...'}
                        </>
                    ) : (
                        <>
                            {isEditing ? <FiSave /> : <FiPlus />}
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
                        </>
                    )}
                </button>
            </form>
        );
    }
}