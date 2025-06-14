import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FiArchive, FiInfo, FiCalendar, FiHash, FiChevronDown, FiChevronUp, FiXCircle, FiAlertTriangle, FiFileText } from "react-icons/fi";

import { OrderCardSkeleton } from "../../containers/Skeletons"; 

import ToastService from "../../services/toastservice";

import api from "../../services/api";

import styles from "./style.module.css";


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

  componentDidMount() { this.loadOrders(); }
  loadOrders = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await api.get("/order/user");
      this.setState({ orders: response.data.order || [], loading: false });
    } catch (err) {
      this.setState({ error: err.response?.data?.message || "Erro ao carregar o histórico de pedidos.", loading: false });
    }
  };

  isOrderValid = (order) => {
    if (!order || !Array.isArray(order.products) || order.products.length === 0) {
      return false;
    }
    return order.products.every(p => p && p.order_products);
  };

  calculateOrderTotal = (products) => {
    if (!Array.isArray(products)) return 0;
    return products.reduce((total, product) => {
      if (!product || !product.order_products) return total;
      const quantityInOrder = product.order_products.quantity;
      return total + (product.price * quantityInOrder);
    }, 0);
  };

  handleToggleOrder = (orderId) => { this.setState(prevState => ({ openOrderId: prevState.openOrderId === orderId ? null : orderId, })); };

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
      ToastService.show({ key: `cancel-order-success-${orderId}`, type: "success", message: "Pedido cancelado com sucesso!" });
      this.setState(prevState => ({ orders: prevState.orders.filter(o => o.id !== orderId) }));
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao cancelar o pedido.";
      ToastService.show({ key: `cancel-order-error-${orderId}`, type: "error", message });
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
              <h3>Ocorreu um Erro ao Carregar os Dados</h3>
              <p>{error}</p>
              <button className={styles.retryButton} onClick={this.loadOrders}>Tentar Novamente</button>
            </div>
          )}

          {!loading && !error && (
            <>
              {orders.length > 0 ? (
                <section className={styles.orderList}>
                  {orders.map(order => {
                    const isOpen = openOrderId === order.id;
                    const isValid = this.isOrderValid(order);

                    return (
                      <div key={order.id} className={`${styles.orderCard} ${isOpen ? styles.active : ""}`}>
                        <header className={styles.orderHeader} onClick={() => this.handleToggleOrder(order.id)}>
                          <div className={styles.orderInfo}><FiHash /> Pedido #{order.id}</div>
                          <div className={styles.orderInfo}><FiCalendar />{new Date(order.createdAt).toLocaleString("pt-BR")}</div>
                          <span className={styles.toggleIcon}>{isOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
                        </header>
                        <div className={`${styles.collapsibleContent} ${isOpen ? styles.contentOpen : ""}`}>
                          {!isValid ? (
                            <div className={styles.orderErrorState}>
                              <FiAlertTriangle className={styles.orderErrorIcon} />
                              <h4>Problema ao Exibir Pedido</h4>
                              <p>Este pedido contém produtos que não estão mais disponíveis ou os dados estão inconsistentes.</p>
                            </div>
                          ) : (
                            <div className={styles.productList}>
                              {order.products.map(product => (
                                <div key={`${order.id}-${product.id}`} className={styles.productItem}>
                                  <span className={styles.productName}>{product.order_products.quantity}x {product.name}</span>
                                  <span className={styles.productPrice}>
                                    {Number(product.price * product.order_products.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          <footer className={styles.orderFooter}>
                            <div className={styles.totalContainer}>
                              {isValid ? (
                                <>
                                  <span>Total do Pedido</span>
                                  <span className={styles.orderTotal}>
                                    {this.calculateOrderTotal(order.products).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                  </span>
                                </>
                              ) : (
                                <span className={styles.unavailableTotal}>Total Indisponível</span>
                              )}
                            </div>
                            <div className={styles.buttonGroup}>
                              {isValid && (
                                <Link to={`/order/${order.id}`} className={styles.detailsButton}>
                                  <FiFileText /> Detalhes
                                </Link>
                              )}
                              <button className={styles.cancelButton} onClick={(e) => this.handleCancelOrder(order, e)}>
                                <FiXCircle /> {isValid ? "Cancelar" : "Deletar"}
                              </button>
                            </div>
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