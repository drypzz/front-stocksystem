import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FiArchive, FiInfo, FiCalendar, FiHash, FiChevronDown, FiChevronUp, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import api from '../../services/api';
import ToastService from '../../services/toastservice';

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

  handleCancelOrder = (order, event) => {
    event.stopPropagation();
    ToastService.confirm({
      key: `confirm-cancel-order-${order.id}`,
      message: `Cancelar o pedido #${order.id}?`,
      onConfirm: () => this.performCancelOrder(order.id),
    });
  };

  performCancelOrder = async (orderId) => {
    try {
      await api.delete(`/order/${orderId}`);
      ToastService.show({
        key: `cancel-order-success-${orderId}`,
        type: 'success',
        message: 'Pedido cancelado com sucesso!'
      });
      this.setState(prevState => ({
        orders: prevState.orders.filter(o => o.id !== orderId)
      }));
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao cancelar o pedido.';
      ToastService.show({
        key: `cancel-order-error-${orderId}`,
        type: 'error',
        message
      });
    }
  };

  render() {
    const { orders, loading, error, openOrderId } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.pageHeader}>
            <h1 className={styles.title}><FiArchive /> Histórico de Pedidos</h1>
          </header>

          {loading && (
            <div className={styles.orderList}>
              {Array.from({ length: 3 }).map((_, index) => <OrderCardSkeleton key={index} />)}
            </div>
          )}

          {error && (
            <div className={styles.errorState}>
              <FiAlertTriangle className={styles.errorIcon} size={32} />
              <div>
                <h3>Ocorreu um Erro ao Carregar os Dados</h3>
                <p>{error}</p>
              </div>
              <button className={styles.retryButton} onClick={this.loadOrders}>
                Tentar Novamente
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
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
                            <div className={styles.totalContainer}>
                              <span>Total do Pedido</span>
                              <span className={styles.orderTotal}>
                                {this.calculateOrderTotal(order.products)
                                  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                            <button
                              className={styles.cancelButton}
                              onClick={(e) => this.handleCancelOrder(order, e)}
                            >
                              <FiXCircle />
                              Cancelar Pedido
                            </button>
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
            </>
          )}
        </div>
      </div>
    );
  }
}