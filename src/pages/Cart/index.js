import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { CartContext } from '../../contexts/CartContext';
import ToastService from '../../services/toastservice';
import api from '../../services/api'; 

import styles from './style.module.css';

export default class Cart extends Component {
  static contextType = CartContext;

  handleCheckout = async () => {
    const { cartItems, clearCart } = this.context;

    if (cartItems.length === 0) {
      return;
    }

    const orderPayload = {
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await api.post('/order', orderPayload);

      ToastService.show({
        type: 'success',
        message: 'Pedido finalizado com sucesso!',
      });
      
      clearCart();

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao processar o pedido. Tente novamente.';
      ToastService.show({
        type: 'error',
        message: errorMessage,
      });
      console.error("Erro ao finalizar o pedido:", err);
    }
  };

  render() {
    const { cartItems, updateQuantity, removeFromCart } = this.context;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
      <div className={styles.container}>
        <div className={styles.cartContent}>
          <header className={styles.cartHeader}>
            <h1 className={styles.title}><FiShoppingCart /> Seu Carrinho</h1>
            <Link to="/shop" className={styles.continueShopping}>
              <FiArrowLeft /> Continuar Comprando
            </Link>
          </header>

          {cartItems.length > 0 ? (
            <div className={styles.cartGrid}>
              <section className={styles.cartItemsList}>
                {cartItems.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemPrice}>{Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><FiMinus /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><FiPlus /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </section>

              <aside className={styles.cartSummary}>
                <h2 className={styles.summaryTitle}>Resumo do Pedido</h2>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <button className={styles.checkoutButton} onClick={this.handleCheckout}>
                  <FiCheckCircle /> Finalizar Compra
                </button>
              </aside>
            </div>
          ) : (
            <div className={styles.emptyCart}>
                <FiInfo size={48} className={styles.emptyIcon} />
                <h3>Seu carrinho está vazio.</h3>
                <p>Adicione produtos da loja para vê-los aqui.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}