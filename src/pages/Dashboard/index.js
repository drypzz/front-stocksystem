import React, { Component } from 'react';
import api from '../../services/api';

import Modal from '../../components/Modal';
import CategoryForm from '../../containers/CategoryForm';
import ProductForm from '../../containers/ProductForm';
import TableSkeleton from '../../containers/TableSkeleton';

import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

import styles from './style.module.css';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            categoriesList: [],
            categoriesMap: {},

            categorySearchTerm: '',
            productSearchTerm: '',

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
                api.get('/product'),
                api.get('/category'),
            ]);
            const categoriesList = categoriesResponse.data?.categories || categoriesResponse.data || [];
            const categoriesMap = {};
            categoriesList.forEach(category => {
                categoriesMap[category.id] = category.name;
            });
            const productsList = productsResponse.data?.products || [];
            this.setState({
                products: productsList,
                categoriesMap: categoriesMap,
                categoriesList: categoriesList,
                loading: false,
            });
        } catch (err) {
            this.setState({
                error: 'Não foi possível carregar os dados. Tente novamente mais tarde.',
                loading: false,
            });
            console.error("Erro ao buscar dados:", err);
        }
    };

    handleOpenEditProductModal = (product) => {
        const sanitizedProduct = { ...product, categoryId: product.categoryId?.toString() || '' };
        this.setState({ productToEdit: sanitizedProduct, isProductModalOpen: true });
    };
    
    handleOpenEditCategoryModal = (category) => {
        const sanitizedCategory = { ...category }
        this.setState({ categoryToEdit: sanitizedCategory, isCategoryModalOpen: true });
    };

    handleDeleteProduct = async (productId) => {
        if (!window.confirm("Tem certeza que deseja EXCLUIR este produto? Esta ação é irreversível.")) return;
        try {
            await api.delete(`/product/${productId}`);
            alert("Produto excluído com sucesso!");
            this.setState(prevState => ({
                products: prevState.products.filter(p => p.id !== productId)
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao excluir o produto.");
        }
    };

    handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("Tem certeza que deseja EXCLUIR esta categoria? Todos os produtos associados ficarão sem categoria.")) return;
        try {
            await api.delete(`/category/${categoryId}`)
            alert("Categoria excluída com sucesso!");
            this.setState(prevState => ({
                categoriesList: prevState.categoriesList.filter(c => c.id !== categoryId)
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao excluir a categoria.");
        }
    };
    handleOpenCategoryModal = () => this.setState({ categoryToEdit: null, isCategoryModalOpen: true });
    handleCloseCategoryModal = () => this.setState({ isCategoryModalOpen: false, categoryToEdit: null });

    handleOpenProductModal = () => {
        if (!this.state.categoriesList.length) {
            alert("Você precisa cadastrar ao menos uma categoria antes de adicionar um produto.");
            return;
        }
        this.setState({ productToEdit: null, isProductModalOpen: true });
    };
    handleCloseProductModal = () => this.setState({ isProductModalOpen: false, productToEdit: null });
    
    handleSuccessfulRegistration = () => {
        this.handleCloseProductModal();
        this.handleCloseCategoryModal();
        this.loadData();
    };

    handleSearchChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const {
            loading, error, products, categoriesList, categoriesMap,
            isCategoryModalOpen, isProductModalOpen, productToEdit, categoryToEdit,
            categorySearchTerm, productSearchTerm
        } = this.state;

        const filteredCategories = categoriesList.filter(category => category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) || category.id.toString().includes(categorySearchTerm.toLowerCase()));

        const filteredProducts = products.filter(product => {
            const categoryName = categoriesMap[product.categoryId] || '';
            const categoryId = product.categoryId ? product.categoryId.toString() : '';
            return product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) || categoryName.toLowerCase().includes(productSearchTerm.toLowerCase()) || categoryId.includes(productSearchTerm.toLowerCase()) || product.id.toString().includes(productSearchTerm.toLowerCase());
        });

        return (
            <>
                <div className={styles.container}>
                    <div className={styles.dashboardContent}>
                        <header className={styles.mainHeader}>
                            <h1 className={styles.mainTitle}>Dashboard</h1>
                        </header>

                        {error && <div className={styles.errorBanner}><p>{error}</p></div>}

                        <section className={styles.tableSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.headerTitleAndFilter}>
                                    <h2>Categorias</h2>
                                    <div className={styles.filterInputContainer}>
                                        <FiSearch className={styles.filterInputIcon} />
                                        <input
                                            type="text"
                                            name="categorySearchTerm"
                                            placeholder="Buscar categoria..."
                                            className={styles.filterInput}
                                            value={categorySearchTerm}
                                            onChange={this.handleSearchChange}
                                        />
                                    </div>
                                </div>
                                <button className={styles.button} onClick={this.handleOpenCategoryModal} disabled={loading}>
                                    <FiPlus /> Nova Categoria
                                </button>
                            </div>
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
                                            <TableSkeleton rows={3} columns={[{ width: '40%' }, { width: '70%' }, { width: '90%' }]} />
                                        ) : filteredCategories.length > 0 ? (
                                            filteredCategories.map(category => (
                                                <tr key={category.id}>
                                                    <td>{category.id}</td>
                                                    <td>{category.name}</td>
                                                    <td className={styles.actionsCell}>
                                                        <button title="Editar Categoria" className={`${styles.tableButton} ${styles.editButton}`} onClick={() => this.handleOpenEditCategoryModal(category)}><FiEdit /></button>
                                                        <button title="Excluir Categoria" className={`${styles.tableButton} ${styles.deleteButton}`} onClick={() => this.handleDeleteCategory(category.id)}><FiTrash2 /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className={styles.emptyText}>Nenhuma categoria encontrada.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className={styles.tableSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.headerTitleAndFilter}>
                                    <h2>Produtos</h2>
                                    <div className={styles.filterInputContainer}>
                                        <FiSearch className={styles.filterInputIcon} />
                                        <input
                                            type="text"
                                            name="productSearchTerm"
                                            placeholder="Buscar por nome ou categoria..."
                                            className={styles.filterInput}
                                            value={productSearchTerm}
                                            onChange={this.handleSearchChange}
                                        />
                                    </div>
                                </div>
                                <button className={styles.button} onClick={this.handleOpenProductModal} disabled={loading}>
                                    <FiPlus /> Novo Produto
                                </button>
                            </div>
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nome do Produto</th>
                                            <th>Categoria</th>
                                            <th>Preço</th>
                                            <th>Qtd.</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <TableSkeleton rows={5} columns={[{ width: '10%' }, { width: '30%' }, { width: '20%' }, { width: '15%' }, { width: '15%' }, { width: '10%' }]} />
                                        ) : filteredProducts.length > 0 ? ( // 6. Use a lista filtrada
                                            filteredProducts.map(product => (
                                                <tr key={product.id}>
                                                    <td>{product.id}</td>
                                                    <td>{product.name}</td>
                                                    <td>{categoriesMap[product.categoryId] || 'N/A'}</td>
                                                    <td>{Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                    <td>{product.quantity}</td>
                                                    <td className={styles.actionsCell}>
                                                        <button title="Editar Produto" className={`${styles.tableButton} ${styles.editButton}`} onClick={() => this.handleOpenEditProductModal(product)}><FiEdit /></button>
                                                        <button title="Excluir Produto" className={`${styles.tableButton} ${styles.deleteButton}`} onClick={() => this.handleDeleteProduct(product.id)}><FiTrash2 /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className={styles.emptyText}>Nenhum produto encontrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
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