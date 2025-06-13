import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FiArchive, FiInfo, FiCalendar, FiHash, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../../services/api';

import styles from './style.module.css';

const OrderCardSkeleton = () => (
  <div className={`${styles.orderCard} ${styles.skeleton}`} />
);

export default class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      error: null,
      openOrderId: null, 
    };
  }

  componentDidMount() {
    this.loadOrders();
  }

  loadOrders = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await api.get('/order/user');
      this.setState({
        orders: response.data.order || [],
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: err.response?.data?.message || 'Erro ao carregar o histórico de pedidos.',
        loading: false,
      });
    }
  };

  calculateOrderTotal = (products) => {
    return products.reduce((total, product) => {
      const quantityInOrder = product.order_products.quantity;
      return total + (product.price * quantityInOrder);
    }, 0);
  };

  handleToggleOrder = (orderId) => {
    this.setState(prevState => ({
      openOrderId: prevState.openOrderId === orderId ? null : orderId,
    }));
  };

  render() {
    const { orders, loading, error, openOrderId } = this.state;

    if (loading) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <header className={styles.pageHeader}>
              <h1 className={styles.title}><FiArchive /> Histórico de Pedidos</h1>
            </header>
            <div className={styles.orderList}>
              {Array.from({ length: 3 }).map((_, index) => <OrderCardSkeleton key={index} />)}
            </div>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.emptyState}>
              <p>{error}</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.pageHeader}>
            <h1 className={styles.title}><FiArchive /> Histórico de Pedidos</h1>
          </header>

          {orders.length > 0 ? (
            <section className={styles.orderList}>
              {orders.map(order => {
                const isOpen = openOrderId === order.id;

                return (
                  <div key={order.id} className={`${styles.orderCard} ${isOpen ? styles.active : ''}`}>
                    <header className={styles.orderHeader} onClick={() => this.handleToggleOrder(order.id)}>
                      <div className={styles.orderInfo}>
                        <FiHash /> Pedido #{order.id}
                      </div>
                      <div className={styles.orderInfo}>
                        <FiCalendar /> 
                        {new Date(order.createdAt).toLocaleString('pt-BR')}
                      </div>
                      <span className={styles.toggleIcon}>
                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    </header>
                    <div className={`${styles.collapsibleContent} ${isOpen ? styles.contentOpen : ''}`}>
                      <div className={styles.productList}>
                        {order.products.map(product => (
                          <div key={`${order.id}-${product.id}`} className={styles.productItem}>
                            <span className={styles.productName}>
                              {product.order_products.quantity}x {product.name}
                            </span>
                            <span className={styles.productPrice}>
                              {Number(product.price * product.order_products.quantity)
                                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        ))}
                      </div>
                      <footer className={styles.orderFooter}>
                        <span>Total do Pedido</span>
                        <span className={styles.orderTotal}>
                          {this.calculateOrderTotal(order.products)
                            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </footer>
                    </div>
                  </div>
                )
              })}
            </section>
          ) : (
            <div className={styles.emptyState}>
              <FiInfo size={48} className={styles.emptyIcon} />
              <h3>Você ainda não fez nenhum pedido.</h3>
              <p>Explore nossa <Link to="/shop">loja</Link> e encontre algo que goste!</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}