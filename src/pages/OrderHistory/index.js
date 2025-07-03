import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FiArchive, FiCalendar, FiHash, FiChevronDown, FiChevronUp, FiXCircle, FiCreditCard, FiCheckCircle, FiAlertTriangle, FiInfo, FiEye, FiLoader } from "react-icons/fi";

import { OrderCardSkeleton } from "../../containers/Skeletons";

import ToastService from "../../services/toastservice";

import api from "../../services/api";

import styles from "./style.module.css";

class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      error: null,
      openOrderId: null,
      processingOrderId: null,
    };
    this.apiRequestInitiated = false;
  }

  componentDidMount() {
    if (this.apiRequestInitiated) {
      return;
    }
    this.apiRequestInitiated = true;
    this.loadOrders();
  }

  loadOrders = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await api.get("/order/user");
      this.setState({ orders: response.data.order || [], loading: false });
    } catch (err) {
      this.setState({
        error:
          err.response?.data?.message ||
          "Erro ao carregar o histórico de pedidos.",
        loading: false,
      });
    }
  };

  isOrderValid = (order) => {
    return order.isDataIntact;
  };

  calculateOrderTotal = (products) => {
    if (!Array.isArray(products)) return 0;
    return products.reduce((total, product) => {
      if (!product || !product.order_products) return total;
      const quantityInOrder = product.order_products.quantity;
      return total + product.price * quantityInOrder;
    }, 0);
  };

  renderStatusBadge = (status) => {
    const statusMap = {
      pending: { text: "Pendente", icon: <FiAlertTriangle />, className: styles.statusPending, },
      approved: { text: "Aprovado", icon: <FiCheckCircle />, className: styles.statusApproved, },
      cancelled: { text: "Cancelado", icon: <FiXCircle />, className: styles.statusCancelled, },
      expired: { text: "Expirado", icon: <FiXCircle />, className: styles.statusCancelled, },
    };
    const { text, icon, className } = statusMap[status] || { text: status, icon: <FiInfo />, className: "" };
    return (<span className={`${styles.statusBadge} ${className}`}>{icon}{text}</span>);
  };

  handleToggleOrder = (orderId) => {
    if (this.state.processingOrderId) return;
    this.setState((prevState) => ({
      openOrderId: prevState.openOrderId === orderId ? null : orderId,
    }));
  };

  handleCancelOrder = (order, event) => {
    event.stopPropagation();
    ToastService.confirm({
      key: `confirm-cancel-order-${order.id}`,
      message: `Tem certeza que deseja cancelar o pedido #${order.id}?`,
      onConfirm: () => this.performCancelOrder(order.publicId),
    });
  };

  handleGoToPayment = (publicId, event) => {
    event.stopPropagation();
    this.props.navigate(`/payment/${publicId}`);
  };

  performCancelOrder = async (publicId) => {
    this.setState({ processingOrderId: publicId });
    try {
      await api.delete(`/order/${publicId}`);
      ToastService.show({
        type: "success",
        message: "Pedido cancelado com sucesso!",
      });
      this.setState((prevState) => ({
        orders: prevState.orders.filter((o) => o.publicId !== publicId),
        openOrderId: null,
      }));
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao cancelar o pedido.";
      ToastService.show({
        key: `cancel-order-error-${publicId}`,
        type: "error",
        message,
      });
    } finally {
      this.setState({ processingOrderId: null });
    }
  };

  renderActionButtons = (order, isProcessing, isAnyProcessing) => {
    if (isProcessing) {
      return (
        <div className={styles.processingIndicator}>
          <FiLoader className={styles.spinner} />
          <span>Cancelando...</span>
        </div>
      );
    }
    if (!this.isOrderValid(order)) {
      return <div className={styles.noActions}>Dados do pedido inconsistentes</div>;
    }
    if (order.paymentStatus === "pending") {
      return (
        <>
          <button
            className={`${styles.actionButton} ${styles.payButton}`}
            onClick={(e) => this.handleGoToPayment(order.publicId, e)}
            disabled={isAnyProcessing}
          >
            <FiCreditCard /> Pagar Agora
          </button>
          <button
            className={`${styles.actionButton} ${styles.cancelButton}`}
            onClick={(e) => this.handleCancelOrder(order, e)}
            disabled={isAnyProcessing}
          >
            <FiXCircle /> Cancelar
          </button>
        </>
      );
    }
    if (order.paymentStatus === "approved") {
      return (
        <Link
          to={`/order/${order.publicId}`}
          className={`${styles.actionButton} ${styles.detailsButton}`}
          style={isAnyProcessing ? { pointerEvents: "none", opacity: 0.5 } : {}}
        >
          <FiEye /> Ver Detalhes
        </Link>
      );
    }
    return <div className={styles.noActions}>Sem ações disponíveis</div>;
  };

  render() {
    const { orders, loading, error, openOrderId, processingOrderId } = this.state;

    const renderOrderCards = () => (
      <section className={styles.orderList}>
        {orders.map((order) => {
          const isOpen = openOrderId === order.id;
          const isValid = this.isOrderValid(order);
          const isProcessing = processingOrderId === order.publicId;
          const isAnyProcessing = processingOrderId !== null;

          return (
            <article
              key={order.id}
              className={`${styles.orderCard} ${isOpen ? styles.active : ""} ${isProcessing ? styles.processing : ""}`}
            >
              <header
                className={styles.orderHeader}
                onClick={isAnyProcessing ? undefined : () => this.handleToggleOrder(order.id)}
                style={{ cursor: isAnyProcessing ? "not-allowed" : "pointer" }}
              >
                <div className={styles.orderInfo}>
                  <FiHash />
                  <strong>Pedido #{order.id}</strong>
                </div>
                <div className={styles.orderInfo}>
                  <FiCalendar />
                  <span>
                    {new Date(order.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className={styles.orderStatusWrapper}>
                  {this.renderStatusBadge(order.paymentStatus)}
                </div>
                <span className={styles.toggleIcon}>
                  {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </span>
              </header>
              <div
                className={`${styles.collapsibleContent} ${isOpen ? styles.contentOpen : ""
                  }`}
              >
                {isValid ? (
                  <>
                    <div className={styles.productList}>
                      {order.products.map(
                        (product, index) =>
                          product && (
                            <div
                              key={`${order.id}-${product.id || index}`}
                              className={styles.productItem}
                            >
                              <span className={styles.productName}>
                                {product.order_products.quantity}x{" "}
                                {product.name}
                              </span>
                              <span className={styles.productPrice}>
                                {Number(
                                  product.price *
                                  product.order_products.quantity
                                ).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                    <footer className={styles.orderFooter}>
                      <div className={styles.totalContainer}>
                        <span>Total do Pedido</span>
                        <span className={styles.orderTotal}>
                          {this.calculateOrderTotal(
                            order.products
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                      <div className={styles.buttonGroup}>
                        {this.renderActionButtons(order, isProcessing, isAnyProcessing)}
                      </div>
                    </footer>
                  </>
                ) : (
                  <div className={styles.invalidOrderContent}>
                    <FiAlertTriangle />
                    <span>
                      Este pedido contém produtos que não estão mais
                      disponíveis.
                    </span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    );

    const renderContent = () => {
      if (loading) {
        return (
          <div className={styles.orderList}>
            {Array.from({ length: 3 }).map((_, index) => (
              <OrderCardSkeleton key={index} />
            ))}
          </div>
        );
      }
      if (error) {
        return (
          <div className={styles.feedbackState}>
            <FiAlertTriangle size={32} />
            <h3>Ocorreu um Erro</h3>
            <p>{error}</p>
            <button
              className={`${styles.actionButton} ${styles.detailsButton}`}
              onClick={this.loadOrders}
            >
              Tentar Novamente
            </button>
          </div>
        );
      }
      if (orders.length === 0) {
        return (
          <div className={styles.feedbackState}>
            <FiInfo size={48} />
            <h3>Nenhum Pedido Encontrado</h3>
            <p>
              Parece que você ainda não fez nenhuma compra. Que tal começar
              agora?
            </p>
            <Link
              to="/shop"
              className={`${styles.actionButton} ${styles.detailsButton}`}
            >
              Ir para a Loja
            </Link>
          </div>
        );
      }
      return renderOrderCards();
    };

    return (
      <div className={styles.container}>
        <main className={styles.content}>
          <header className={styles.pageHeader}>
            <h1 className={styles.title}>
              <FiArchive /> Meus Pedidos
            </h1>
          </header>
          {renderContent()}
        </main>
      </div>
    );
  }
}

const OrderHistoryWrapper = (props) => {
  const navigate = useNavigate();
  return <OrderHistory {...props} navigate={navigate} />;
};

export default OrderHistoryWrapper;
