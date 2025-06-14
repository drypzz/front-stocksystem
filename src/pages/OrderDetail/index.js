import React, { Component, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { FiFileText, FiCalendar, FiHash, FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

import { OrderDetailSkeleton } from '../../containers/Skeletons';

import ToastService from "../../services/toastservice";

import api from "../../services/api";

import styles from "./style.module.css";


class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null,
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.loadOrderDetail();
    }

    loadOrderDetail = async () => {
        const { orderId } = this.props;
        this.setState({ loading: true, error: null });

        try {
            const response = await api.get(`/order/${orderId}`);
            this.setState({ order: response.data, loading: false });
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message || "Ocorreu um erro.";
            if (status === 404 || status === 401 || status === 403) {
                ToastService.show({
                    type: "error",
                    message: status === 404 ? "Pedido não encontrado." : "Você não tem permissão para ver este pedido."
                });
                window.location.href = "/orders";
            } else {
                this.setState({ error: message, loading: false });
            }
        }
    };

    calculateOrderTotal = (products = []) => {
        return products.reduce((total, product) => {
            if (!product || !product.order_products) return total;
            return total + (product.price * product.order_products.quantity);
        }, 0);
    };

    render() {
        const { order, loading, error } = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    {loading && <OrderDetailSkeleton />}

                    {error && (
                        <div className={styles.errorState}>
                            <FiAlertTriangle size={40} />
                            <h3>Ocorreu um Erro</h3>
                            <p>{error}</p>
                            <button onClick={this.loadOrderDetail} className={styles.retryButton}>Tentar Novamente</button>
                        </div>
                    )}

                    {!loading && !error && order && (
                        <>
                            <header className={styles.pageHeader}>
                                <Link to="/orders" className={styles.backButton}><FiArrowLeft /> Voltar para o Histórico</Link>
                                <h1 className={styles.title}><FiFileText /> Detalhes do Pedido</h1>
                            </header>

                            <div className={styles.detailCard}>
                                <section className={styles.orderSummary}>
                                    <div className={styles.summaryItem}>
                                        <FiHash />
                                        <span>Pedido <strong>#{order.id}</strong></span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <FiCalendar />
                                        <span>Data: <strong>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</strong></span>
                                    </div>
                                    {order.status && (
                                        <div className={`${styles.summaryItem} ${styles.status}`}>
                                            <span>Status: <strong>{order.status}</strong></span>
                                        </div>
                                    )}
                                </section>
                                <section className={styles.productList}>
                                    <h3 className={styles.sectionTitle}>Produtos</h3>
                                    {order.products.map(product => (
                                        <div key={product.id} className={styles.productItem}>
                                            <div className={styles.productInfo}>
                                                <span className={styles.productQuantity}>{product.order_products.quantity}x</span>
                                                <span className={styles.productName}>{product.name}</span>
                                            </div>
                                            <span className={styles.productPrice}>
                                                {Number(product.price * product.order_products.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                            </span>
                                        </div>
                                    ))}
                                </section>
                                <footer className={styles.orderTotal}>
                                    <span>Total do Pedido</span>
                                    <strong>{this.calculateOrderTotal(order.products).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                                </footer>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

const OrderDetailWrapper = () => {
    const { id } = useParams();

    useEffect(() => {
        const isNumericId = /^\d+$/.test(id);
        if (!isNumericId) {
            window.location.href = "/orders";
        }
    }, [id]);

    return <OrderDetail orderId={id} />;
};

export default OrderDetailWrapper;