import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import { FiFilter, FiInfo, FiShoppingCart } from 'react-icons/fi';
import ProductCardSkeleton from '../../containers/ProductCardSkeleton';
import Dropdown from '../../components/Dropdown';
import api from '../../services/api';
import { CartContext } from '../../contexts/CartContext';
import { AiOutlineProduct } from "react-icons/ai";
import styles from './style.module.css';

export default class Shop extends Component {
  static contextType = CartContext;

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
      const categoriesMap = {
        'all': 'Todas as Categorias',
        ...categoriesList.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.name }), {})
      };
      
      const productsList = (productsResponse.data?.products || []).map(p => ({...p, originalQuantity: p.quantity}));

      this.setState({
        allProducts: productsList,
        categoriesMap,
        categoriesList,
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: err.response?.data?.message || 'Erro ao carregar os dados. Tente novamente mais tarde.',
        loading: false,
      });
    }
  };

  handleCategoryChange = (categoryId) => {
    this.setState({ selectedCategory: categoryId.toString() });
  };

  renderProducts = () => {
    const { addToCart } = this.context;
    const { allProducts, selectedCategory, categoriesMap } = this.state;
    const filteredProducts = selectedCategory === 'all'
      ? allProducts
      : allProducts.filter(product => product.categoryId.toString() === selectedCategory);

    if (filteredProducts.length > 0) {
      return filteredProducts.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <div className={styles.productCardHeader}>
            <h3>{product.name}</h3>
            <span className={styles.productCategory}>{categoriesMap[product.categoryId] || 'Sem Categoria'}</span>
          </div>
          <p className={styles.productDescription}>{product.description}</p>
          <div className={styles.productCardFooter}>
            <span className={styles.productPrice}>{Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span className={styles.productQuantity}>{`${product.quantity} unidades`}</span>
          </div>
          <div className={styles.productActions}>
            <button
              className={`
                ${styles.actionButton}
                ${product.quantity > 0 ? styles.buyButton : styles.outOfStockButton}
              `}
              onClick={() => addToCart(product)}
              disabled={product.quantity === 0} 
            >
              <FiShoppingCart size={18} /> {product.quantity > 0 ? 'Adicionar ao Carrinho' : 'Sem Estoque'}
            </button>
          </div>
        </div>
      ));
    }

    return (
      <div className={styles.emptyState}>
        <FiInfo className={styles.emptyIcon} size={48} />
        <h3>Nenhum produto encontrado</h3>
        <p className={styles.subtext}>{selectedCategory === 'all' ? 'Parece que não há produtos cadastrados ainda.' : 'Tente selecionar outra categoria.'}</p>
      </div>
    );
  };

  render() {
    const { loading, error, categoriesList, selectedCategory } = this.state;
    const { cartItems } = this.context; 
    const categoryOptions = [{ id: 'all', name: 'Todas as Categorias' }, ...categoriesList];
    const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
      <div className={styles.container}>
        <div className={styles.shopContent}>
          <header className={styles.shopHeader}>
            <h1 className={styles.title}><AiOutlineProduct /> Produtos</h1>
            <div className={styles.headerActions}>
                <Dropdown
                    icon={FiFilter}
                    placeholder="Filtrar por Categoria"
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={this.handleCategoryChange}
                    disabled={loading}
                />
                <Link to="/cart" className={styles.cartLink}>
                    <FiShoppingCart size={20} />
                    <span>Carrinho</span>
                    {totalItemsInCart > 0 && <span className={styles.cartCount}>{totalItemsInCart}</span>}
                </Link>
            </div>
          </header>

          <section className={styles.productListSection}>
            {loading && <div className={styles.productList}>
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>}
            {error && <div className={styles.emptyState}><p>{error}</p></div>}
            
            {!loading && !error && (
              <div
                key={selectedCategory}
                className={styles.productList}
              >
                {this.renderProducts()}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }
}