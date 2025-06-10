import React, { Component } from 'react';

import Modal from '../../components/Modal';

import CategoryForm from '../../containers/CategoryForm';
import ProductForm from '../../containers/ProductForm';

import styles from './style.module.css';

const mockProducts = [
  { id: 1, name: 'Notebook Gamer Pro', description: 'Notebook de alta performance...', price: 7499.90, quantity: 15, categoryName: 'Eletrônicos' },
  { id: 2, name: 'Cadeira Ergonômica', description: 'Conforto e ajuste postural...', price: 899.99, quantity: 32, categoryName: 'Móveis' },
  { id: 3, name: 'Monitor Ultrawide 29"', description: 'Monitor com resolução QHD...', price: 1850.00, quantity: 25, categoryName: 'Periféricos' },
];

export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isCategoryModalOpen: false,
      isProductModalOpen: false,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.setState({ products: mockProducts, loading: false });
  }

  handleOpenCategoryModal = () => this.setState({ isCategoryModalOpen: true });
  handleCloseCategoryModal = () => this.setState({ isCategoryModalOpen: false });

  handleOpenProductModal = () => this.setState({ isProductModalOpen: true });
  handleCloseProductModal = () => this.setState({ isProductModalOpen: false });

  handleSuccessfullRegistration = () => {
    this.handleCloseCategoryModal();
    this.handleCloseProductModal();
    alert("Cadastro realizado com sucesso! A lista será atualizada.");
  }

  render() {
    const { products, loading, isCategoryModalOpen, isProductModalOpen } = this.state;

    return (
      <>
        <div className={styles.container}>
          <div className={styles.dashboardContent}>
            <header className={styles.dashboardHeader}>
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
              {loading ? (
                <p>Carregando produtos...</p>
              ) : (
                <div className={styles.productList}>
                  {products.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productCardHeader}>
                        <h3>{product.name}</h3>
                        <span className={styles.productCategory}>{product.categoryName}</span>
                      </div>
                      <p className={styles.productDescription}>{product.description}</p>
                      <div className={styles.productCardFooter}>
                        <span className={styles.productPrice}>
                          {`R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        </span>
                        <span className={styles.productQuantity}>
                          {`${product.quantity} unidades`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* --- MODAIS --- */}
        <Modal show={isCategoryModalOpen} onClose={this.handleCloseCategoryModal}>
          <CategoryForm 
            show={isCategoryModalOpen}
            onSuccess={this.handleSuccessfullRegistration} 
          />
        </Modal>

        <Modal show={isProductModalOpen} onClose={this.handleCloseProductModal}>
          <ProductForm 
            show={isProductModalOpen}
            onSuccess={this.handleSuccessfullRegistration}
          />
        </Modal>
      </>
    );
  }
}