import React, { Component } from 'react';
import api from '../../services/api';

import ProductCardSkeleton from '../../containers/ProductCardSkeleton';

import styles from './style.module.css';

const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;


export default class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      categoriesList: [],
      categoriesMap: {},
      selectedCategory: 'all',
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
        allProducts: productsList,
        categoriesMap,
        categoriesList,
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: 'Não foi possível carregar os produtos. Tente novamente mais tarde.',
        loading: false,
      });
      console.error("Erro ao buscar dados:", err);
    }
  };

  handleCategoryChange = (event) => {
    this.setState({ selectedCategory: event.target.value });
  };

  renderProducts = () => {
    const { allProducts, selectedCategory, categoriesMap } = this.state;

    const filteredProducts = selectedCategory === 'all'
      ? allProducts
      : allProducts.filter(product => product.categoryId?.toString() === selectedCategory);

    if (filteredProducts.length > 0) {
      return filteredProducts.map((product) => (
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
              {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className={styles.productQuantity}>
              {`${product.quantity} unidades`}
            </span>
          </div>
          <div className={styles.productActions}>
            <button className={`${styles.actionButton} ${styles.buyButton}`}>
              Adicionar ao Carrinho
            </button> 
          </div>
        </div>
      ));
    }

    return (
      <div className={styles.emptyState}>
        <h3>Nenhum produto encontrado</h3>
        <p className={styles.subtext}>
            {selectedCategory === 'all' 
                ? 'Parece que não há produtos cadastrados ainda.' 
                : 'Tente selecionar outra categoria.'}
        </p>
      </div>
    );
  };

  render() {
    const { loading, error, categoriesList, selectedCategory } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.shopContent}>
          <header className={styles.shopHeader}>
            <h1 className={styles.title}>Nossa Vitrine</h1>
            <div className={styles.filterContainer}>
              <FilterIcon />
              <select 
                className={styles.categoryFilter} 
                onChange={this.handleCategoryChange}
                value={selectedCategory}
                disabled={loading}
              >
                <option value="all">Todas as Categorias</option>
                {categoriesList.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </header>
          <section className={styles.productListSection}>
            {loading && (
              <div className={styles.productList}>
                {[...Array(6)].map((_, index) => <ProductCardSkeleton key={index} />)}
              </div>
            )}
            {error && <div className={styles.emptyState}><p>{error}</p></div>}
            {!loading && !error && (
              <div className={styles.productList}>
                {this.renderProducts()}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }
}