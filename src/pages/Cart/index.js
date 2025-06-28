import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiInfo, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

import { CartContext } from "../../contexts/CartContext";

import { CartSkeleton } from "../../containers/Skeletons";

import ToastService from "../../services/toastservice";

import api from "../../services/api";

import styles from "./style.module.css";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            isProcessing: false,
            inputQuantities: {},
        };
        this.loadingTimer = null;
    }

    componentDidMount() {
        this.loadingTimer = setTimeout(() => {
            this.setState({ loading: false });
        }, 700);
    }

    componentWillUnmount() {
        if (this.loadingTimer) {
            clearTimeout(this.loadingTimer);
        }
    }

    syncInputQuantities = () => {
        const { cartItems } = this.props.cart;
        const newInputQuantities = {};
        cartItems.forEach(item => {
            if (this.state.inputQuantities[item.id] === undefined || 
                String(this.state.inputQuantities[item.id]) === String(item.quantity)) {
                newInputQuantities[item.id] = String(item.quantity);
            } else {
                newInputQuantities[item.id] = this.state.inputQuantities[item.id];
            }
        });
        this.setState({ inputQuantities: newInputQuantities });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.cart.cartItems !== this.props.cart.cartItems) {
            this.syncInputQuantities();
        }
    }

    handleCheckout = async () => {
        const { cartItems, clearCart } = this.props.cart;
        const { navigate } = this.props;

        if (cartItems.length === 0) return;

        this.setState({ isProcessing: true });

        const orderPayload = {
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
        };

        try {
            const response = await api.post("/order", orderPayload);
            const publicId = response.data.order.publicId;

            ToastService.show({ type: "success", message: "Pedido criado! Redirecionando para pagamento..." });
            clearCart();

            setTimeout(() => {
                navigate(`/payment/${publicId}`);
            }, 1500);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Falha ao processar o pedido. Tente novamente.";
            ToastService.show({ type: "error", message: errorMessage });
            this.setState({ isProcessing: false });
        }
    };

    handleQuantityChange = (event, item) => {
        const value = event.target.value;
        const { updateQuantity } = this.props.cart;

        this.setState(prevState => ({
            inputQuantities: {
                ...prevState.inputQuantities,
                [item.id]: value,
            },
        }));

        const parsedValue = parseInt(value, 10);

        if (!isNaN(parsedValue)) {
            if (item.stock && parsedValue > item.stock) {
                ToastService.show({ type: "error", message: `Estoque máximo para ${item.name}: ${item.stock}` });
                this.setState(prevState => ({
                    inputQuantities: {
                        ...prevState.inputQuantities,
                        [item.id]: String(item.stock),
                    },
                }));
                updateQuantity(item.id, item.stock);
            } else if (parsedValue < 1 && value !== '') {
                ToastService.show({ type: "error", message: "A quantidade mínima é 1." });
                this.setState(prevState => ({
                    inputQuantities: {
                        ...prevState.inputQuantities,
                        [item.id]: '1',
                    },
                }));
                updateQuantity(item.id, 1);
            } else if (parsedValue >= 1 && parsedValue !== item.quantity) {
                updateQuantity(item.id, parsedValue);
            }
        }
    };

    handleQuantityBlur = (item) => {
        const { updateQuantity } = this.props.cart;
        const localValue = this.state.inputQuantities[item.id];

        let finalQuantity;
        const parsedLocalValue = parseInt(localValue, 10);

        if (localValue === '' || isNaN(parsedLocalValue) || parsedLocalValue < 1) {
            finalQuantity = 1;
        } else {
            finalQuantity = parsedLocalValue;
        }

        if (item.stock && finalQuantity > item.stock) {
            finalQuantity = item.stock;
            ToastService.show({ type: "error", message: `Quantidade ajustada para o estoque máximo de ${item.name}: ${item.stock}` });
        }

        if (finalQuantity !== item.quantity) {
            updateQuantity(item.id, finalQuantity);
        }

        this.setState(prevState => {
            const updatedInputQuantities = { ...prevState.inputQuantities };
            delete updatedInputQuantities[item.id];
            return { inputQuantities: updatedInputQuantities };
        });
    };

    handleIncrement = (item) => {
        const { updateQuantity } = this.props.cart;
        if (item.stock && item.quantity >= item.stock) {
            ToastService.show({ type: "info", message: "Você atingiu o estoque máximo." });
            return;
        }
        updateQuantity(item.id, item.quantity + 1);
    };

    handleDecrement = (item) => {
        const { updateQuantity } = this.props.cart;
        if (item.quantity <= 1) {
            ToastService.show({ type: "info", message: "A quantidade mínima é 1." });
            return;
        }
        updateQuantity(item.id, item.quantity - 1);
    };

    render() {
        const { loading, isProcessing, inputQuantities } = this.state;
        const { cartItems, removeFromCart } = this.props.cart;

        if (loading) {
            return (
                <div className={styles.container}>
                    <div className={styles.cartContent}>
                        <CartSkeleton />
                    </div>
                </div>
            );
        }

        const isCartValid = cartItems.every(item => !item.stock || item.quantity <= item.stock);
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        return (
            <div className={styles.container}>
                <div className={styles.cartContent}>
                    <header className={styles.cartHeader}>
                        <h1 className={styles.title}><FiShoppingCart /> Seu Carrinho</h1>
                        <Link to="/" className={styles.continueShopping}>
                            <FiArrowLeft /> Continuar Comprando
                        </Link>
                    </header>

                    {cartItems.length > 0 ? (
                        <div className={styles.cartGrid}>
                            <section className={styles.cartItemsList}>
                                {cartItems.map(item => {
                                    const hasStockError = item.stock && item.quantity > item.stock;

                                    const displayQuantity = inputQuantities[item.id] !== undefined 
                                                            ? inputQuantities[item.id] 
                                                            : String(item.quantity);

                                    return (
                                        <div key={item.id} className={`${styles.cartItem} ${hasStockError ? styles.itemError : ""}`}>
                                            <div className={styles.itemDetails}>
                                                <h3 className={styles.itemName}>{item.name}</h3>
                                                <p className={styles.itemPrice}>{Number(item.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                                            </div>
                                            <div className={styles.itemActions}>
                                                <div className={styles.quantityControl}>
                                                    <button onClick={() => this.handleDecrement(item)} aria-label="Diminuir quantidade"><FiMinus /></button>
                                                    <input
                                                        type="text"
                                                        className={styles.quantityInput}
                                                        value={displayQuantity} 
                                                        onChange={(e) => this.handleQuantityChange(e, item)}
                                                        onBlur={() => this.handleQuantityBlur(item)}
                                                    />
                                                    <button onClick={() => this.handleIncrement(item)} aria-label="Aumentar quantidade"><FiPlus /></button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className={styles.removeButton} aria-label="Remover item"><FiTrash2 /></button>
                                            </div>
                                            {hasStockError && (
                                                <div className={styles.stockErrorMessage}>
                                                    <FiAlertCircle />
                                                    <span>Quantidade selecionada indisponível. Máximo: {item.stock}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </section>

                            <aside className={styles.cartSummary}>
                                <h2 className={styles.summaryTitle}>Resumo do Pedido</h2>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Frete</span>
                                    <span>Grátis</span>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                    <span>Total</span>
                                    <span>{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                                <button
                                    className={styles.checkoutButton}
                                    onClick={this.handleCheckout}
                                    disabled={isProcessing || !isCartValid}
                                >
                                    {isProcessing ? "Processando..." : <><FiCheckCircle /> Finalizar Compra</>}
                                </button>
                                {!isCartValid && (
                                    <p className={styles.cartInvalidMessage}>
                                        Ajuste os itens com estoque insuficiente para continuar.
                                    </p>
                                )}
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

const CartWrapper = (props) => {
    const navigate = useNavigate();
    const cartContext = React.useContext(CartContext);

    return <Cart {...props} navigate={navigate} cart={cartContext} />;
};

export default CartWrapper;