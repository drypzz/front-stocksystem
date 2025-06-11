import React, { Component } from 'react';
import api from '../../services/api';

import Modal from '../../components/Modal';
import CategoryForm from '../../containers/CategoryForm';
import ProductForm from '../../containers/ProductForm';
import ProductCardSkeleton from '../../containers/ProductCardSkeleton';

import styles from './style.module.css';

export default class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categoriesMap: {},
      categoriesList: [],
      isCategoryModalOpen: false,
      isProductModalOpen: false,
      productToEdit: null,
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

      const categoriesList = categoriesResponse.data?.categories || categoriesResponse.data;
      const categoriesMap = {};
      if (Array.isArray(categoriesList)) {
        categoriesList.forEach(category => {
          categoriesMap[category.id] = category.name;
        });
      }

      const productsList = productsResponse.data?.products;
      if (Array.isArray(productsList)) {
        this.setState({
          products: productsList,
          categoriesMap: categoriesMap,
          categoriesList: categoriesList,
          loading: false,
        });
      } else {
        throw new Error('O formato da lista de produtos está incorreto.');
      }
    } catch (err) {
      this.setState({
        products: [],
        error: 'Não foi possível carregar os dados. Tente novamente mais tarde.',
        loading: false,
      });
      console.error("Erro ao buscar dados:", err);
    }
  };

  handleOpenEditModal = (product) => {
    const sanitizedProduct = {
      ...product,
      categoryId: product.categoryId?.toString() || '',
    };
    this.setState({ productToEdit: sanitizedProduct, isProductModalOpen: true });
  };

  handleDeleteProduct = async (productId) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

    try {
      await api.delete(`/product/${productId}`);
      alert("Produto excluído com sucesso!");
      this.setState(prevState => ({
        products: prevState.products.filter(p => p.id !== productId)
      }));
    } catch (err) {
      alert("Erro ao excluir o produto.");
      console.error("Erro ao excluir produto:", err);
    }
  };

  handleOpenCategoryModal = () => this.setState({ isCategoryModalOpen: true });
  handleCloseCategoryModal = () => this.setState({ isCategoryModalOpen: false });

  handleOpenProductModal = () => {
    const hasCategories = Object.keys(this.state.categoriesMap).length > 0;

    if (!hasCategories) {
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

  renderProducts = () => {
    const { products, categoriesMap } = this.state;

    if (products.length > 0) {
      return products.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <div className={styles.productCardHeader}>
            <h3>{product.name}</h3>
            <span className={styles.productCategory}>
              {categoriesMap[product.categoryId] || 'Sem Categoria'}
            </span>
          </div>
          <p className={styles.productDescription}>{product.description}</p>
          <div className={styles.productCardFooter}>
            <span className={styles.productPrice}>
              {`R$ ${Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </span>
            <span className={styles.productQuantity}>
              {`${product.quantity} unidades`}
            </span>
          </div>

          <div className={styles.productActions}>
            <button
              className={`${styles.actionButton} ${styles.editButton}`}
              onClick={() => this.handleOpenEditModal(product)}
            >
              Editar
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => this.handleDeleteProduct(product.id)}
            >
              Excluir
            </button>
          </div>
        </div>
      ));
    }

    return (
      <div className={styles.emptyState}>
        <p>Nenhum produto cadastrado ainda!</p>
      </div>
    );
  };

  render() {
    const { loading, error, isCategoryModalOpen, isProductModalOpen, productToEdit } = this.state;

    return (
      <>
        <div className={styles.container}>
          <div className={styles.shopContent}>
            <header className={styles.shopHeader}>
              <h1 className={styles.title}>Produtos</h1>
              <div className={styles.actions}>
                <button className={`${styles.button} ${styles.actionButton}`} onClick={this.handleOpenCategoryModal}>
                  + Nova Categoria
                </button>
                <button className={`${styles.button} ${styles.actionButton}`} onClick={this.handleOpenProductModal}>
                  + Novo Produto
                </button>
              </div>
            </header>
            <section className={styles.productListSection}>
              {loading && (
                <div className={styles.productList}>
                  {[...Array(6)].map((_, index) => <ProductCardSkeleton key={index} />)}
                </div>
              )}
              {error && <p className={styles.error}>{error}</p>}
              {!loading && !error && (
                <div className={styles.productList}>
                  {this.renderProducts()}
                </div>
              )}
            </section>
          </div>
        </div>

        <Modal show={isCategoryModalOpen} onClose={this.handleCloseCategoryModal}>
          <CategoryForm show={isCategoryModalOpen} onSuccess={this.handleSuccessfulRegistration} />
        </Modal>

        <Modal show={isProductModalOpen} onClose={this.handleCloseProductModal}>
          <ProductForm
            show={isProductModalOpen}
            onSuccess={this.handleSuccessfulRegistration}
            productToEdit={this.state.productToEdit}
            categories={this.state.categoriesList}
          />
        </Modal>
      </>
    );
  }
}