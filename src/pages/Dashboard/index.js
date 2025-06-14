import React, { Component } from "react";

import { FiEdit, FiTrash2, FiPlus, FiSearch, FiAlertTriangle } from "react-icons/fi";

import CategoryForm from "../../containers/CategoryForm";
import ProductForm from "../../containers/ProductForm";

import { TableSkeleton } from '../../containers/Skeletons';

import Modal from "../../components/Modal";

import ToastService from "../../services/toastservice.js";

import api from "../../services/api";

import styles from "./style.module.css";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            categoriesList: [],
            categoriesMap: {},
            categorySearchTerm: "",
            productSearchTerm: "",
            isCategoryModalOpen: false,
            isProductModalOpen: false,
            productToEdit: null,
            categoryToEdit: null,
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        this.setState({ loading: true, error: null });
        try {
            const [productsResponse, categoriesResponse] = await Promise.all([
                api.get("/product"),
                api.get("/category"),
            ]);
            const categoriesList = categoriesResponse.data?.categories || categoriesResponse.data || [];
            const categoriesMap = categoriesList.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
            }, {});
            const productsList = productsResponse.data?.products || [];
            this.setState({
                products: productsList,
                categoriesMap: categoriesMap,
                categoriesList: categoriesList,
                loading: false,
            });
        } catch (err) {
            this.setState({
                error: err.response?.data?.message || "Erro ao carregar os dados. Verifique sua conexão.",
                loading: false,
            });
        }
    };

    handleOpenEditProductModal = (product) => this.setState({ productToEdit: { ...product, categoryId: product.categoryId?.toString() || "" }, isProductModalOpen: true });
    handleOpenEditCategoryModal = (category) => this.setState({ categoryToEdit: { ...category }, isCategoryModalOpen: true });
    handleOpenCategoryModal = () => this.setState({ categoryToEdit: null, isCategoryModalOpen: true });
    handleCloseCategoryModal = () => this.setState({ isCategoryModalOpen: false, categoryToEdit: null });
    handleCloseProductModal = () => this.setState({ isProductModalOpen: false, productToEdit: null });

    handleOpenProductModal = () => {
        if (!this.state.categoriesList.length && !this.state.loading) {
            ToastService.show({
                key: "no-categories-warning",
                type: "info",
                message: "Cadastre uma categoria antes de adicionar um produto.",
            });
            return;
        }
        this.setState({ productToEdit: null, isProductModalOpen: true });
    };

    handleSuccessfulRegistration = () => {
        this.handleCloseProductModal();
        this.handleCloseCategoryModal();
        this.loadData();
    };

    handleDeleteProduct = (product) => {
        ToastService.confirm({
            key: `confirm-delete-product-${product.id}`,
            message: `Excluir o produto "${product.name}"?`,
            onConfirm: () => this.performDeleteProduct(product.id),
        });
    };

    handleDeleteCategory = (category) => {
        ToastService.confirm({
            key: `confirm-delete-category-${category.id}`,
            message: `Excluir a categoria "${category.name}"?`,
            onConfirm: () => this.performDeleteCategory(category.id),
        });
    };

    performDeleteProduct = async (productId) => {
        try {
            await api.delete(`/product/${productId}`);
            ToastService.show({
                key: "delete-product-success",
                type: "success", 
                message: "Produto excluído com sucesso!" 
            });
            this.setState(prevState => ({
                products: prevState.products.filter(p => p.id !== productId)
            }));
        } catch (err) {
            const message = err.response?.data?.message || "Erro ao excluir o produto.";
            ToastService.show({
                key: "delete-product-error",
                type: "error", 
                message 
            });
        }
    };

    performDeleteCategory = async (categoryId) => {
        try {
            await api.delete(`/category/${categoryId}`);
            ToastService.show({ 
                key: "delete-category-success",
                type: "success", 
                message: "Categoria excluída com sucesso!" 
            });
            this.loadData();
        } catch (err) {
            const message = err.response?.data?.message || "Erro ao excluir a categoria.";
            ToastService.show({ 
                key: "delete-category-error",
                type: "error", 
                message 
            });
        }
    };

    handleSearchChange = (e) => this.setState({ [e.target.name]: e.target.value });

    renderCategoryTable = () => {
        const { loading, categoriesList, categorySearchTerm } = this.state;
        const filteredCategories = categoriesList.filter(c =>
            c.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
        );

        if (!loading && filteredCategories.length === 0) {
            return (
                <div className={styles.tableEmptyState}>
                    <FiSearch size={32} />
                    <h3>Nenhuma Categoria Encontrada</h3>
                    <p>Tente ajustar sua busca ou adicione uma nova categoria.</p>
                </div>
            );
        }

        return (
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <TableSkeleton rows={3} columns={[{ width: "20%" }, { width: "60%" }, { width: "20%" }]} />
                        ) : (
                            filteredCategories.map(category => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td className={styles.actionsCell}>
                                        <button title="Editar Categoria" className={`${styles.tableButton} ${styles.editButton}`} onClick={() => this.handleOpenEditCategoryModal(category)}><FiEdit /></button>
                                        <button title="Excluir Categoria" className={`${styles.tableButton} ${styles.deleteButton}`} onClick={() => this.handleDeleteCategory(category)}><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    renderProductTable = () => {
        const { loading, products, categoriesMap, productSearchTerm } = this.state;
        const filteredProducts = products.filter(p =>
            p.name.toLowerCase().includes(productSearchTerm.toLowerCase())
        );

        if (!loading && filteredProducts.length === 0) {
            return (
                <div className={styles.tableEmptyState}>
                    <FiSearch size={32} />
                    <h3>Nenhum Produto Encontrado</h3>
                    <p>Tente ajustar sua busca ou adicione um novo produto.</p>
                </div>
            );
        }

        return (
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th><th>Nome do Produto</th><th>Categoria</th><th>Preço</th><th>Qtd.</th><th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <TableSkeleton rows={5} columns={[{ width: "10%" }, { width: "30%" }, { width: "20%" }, { width: "15%" }, { width: "15%" }, { width: "10%" }]} />
                        ) : (
                            filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{categoriesMap[product.categoryId] || <span style={{ color: "#94a3b8" }}>N/A</span>}</td>
                                    <td>{Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                                    <td>{product.quantity}</td>
                                    <td className={styles.actionsCell}>
                                        <button title="Editar Produto" className={`${styles.tableButton} ${styles.editButton}`} onClick={() => this.handleOpenEditProductModal(product)}><FiEdit /></button>
                                        <button title="Excluir Produto" className={`${styles.tableButton} ${styles.deleteButton}`} onClick={() => this.handleDeleteProduct(product)}><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        const {
            loading, error, categoriesList, isCategoryModalOpen, isProductModalOpen,
            productToEdit, categoryToEdit, categorySearchTerm, productSearchTerm
        } = this.state;

        return (
            <>
                <div className={styles.container}>
                    <div className={styles.dashboardContent}>
                        <header className={styles.mainHeader}>
                            <h1 className={styles.mainTitle}>Dashboard</h1>
                        </header>

                        {error && (
                            <div className={styles.errorState}>
                                <FiAlertTriangle className={styles.errorIcon} size={32} />
                                <div>
                                    <h3>Ocorreu um Erro ao Carregar os Dados</h3>
                                    <p>{error}</p>
                                </div>
                                <button className={styles.retryButton} onClick={this.loadData}>
                                    Tentar Novamente
                                </button>
                            </div>
                        )}

                        {!error && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                                <section className={styles.tableSection}>
                                    <div className={styles.sectionHeader}>
                                        <div className={styles.headerTitleAndFilter}>
                                            <h2>Categorias</h2>
                                            <div className={styles.filterInputContainer}>
                                                <FiSearch className={styles.filterInputIcon} />
                                                <input type="text" name="categorySearchTerm" placeholder="Buscar categoria..." className={styles.filterInput} value={categorySearchTerm} onChange={this.handleSearchChange} disabled={loading} />
                                            </div>
                                        </div>
                                        <button className={styles.button} onClick={this.handleOpenCategoryModal} disabled={loading}>
                                            <FiPlus /> Nova Categoria
                                        </button>
                                    </div>
                                    {this.renderCategoryTable()}
                                </section>

                                <section className={styles.tableSection}>
                                    <div className={styles.sectionHeader}>
                                        <div className={styles.headerTitleAndFilter}>
                                            <h2>Produtos</h2>
                                            <div className={styles.filterInputContainer}>
                                                <FiSearch className={styles.filterInputIcon} />
                                                <input type="text" name="productSearchTerm" placeholder="Buscar produto..." className={styles.filterInput} value={productSearchTerm} onChange={this.handleSearchChange} disabled={loading} />
                                            </div>
                                        </div>
                                        <button className={styles.button} onClick={this.handleOpenProductModal} disabled={loading || !categoriesList.length} title={!categoriesList.length ? "Cadastre uma categoria primeiro" : "Adicionar novo produto"}>
                                            <FiPlus /> Novo Produto
                                        </button>
                                    </div>
                                    {this.renderProductTable()}
                                </section>
                            </div>
                        )}
                    </div>
                </div>

                <Modal show={isCategoryModalOpen} onClose={this.handleCloseCategoryModal}>
                    <CategoryForm show={isCategoryModalOpen} onSuccess={this.handleSuccessfulRegistration} categoryToEdit={categoryToEdit} />
                </Modal>
                <Modal show={isProductModalOpen} onClose={this.handleCloseProductModal}>
                    <ProductForm show={isProductModalOpen} onSuccess={this.handleSuccessfulRegistration} productToEdit={productToEdit} categories={categoriesList} />
                </Modal>
            </>
        );
    };
};