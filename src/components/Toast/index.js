import React, { Component } from "react";

import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

import ToastService from "../../services/toastservice";

import styles from "./style.module.css";

class Toast extends Component {
    state = { exiting: false };

    componentDidMount() {
        const { type, duration } = this.props;
        if (type === "confirm") {
            const cancelDuration = duration || 7000;
            this.timeout = setTimeout(this.handleCancel, cancelDuration);
        } else {
            const closeDuration = duration || 3000;
            this.timeout = setTimeout(this.startExiting, closeDuration);
        }
    }
    
    componentWillUnmount() { clearTimeout(this.timeout); }

    startExiting = () => {
        if (this.state.exiting) return;
        this.setState({ exiting: true });
        setTimeout(() => this.props.onClose(), 500);
    };

    handleConfirm = () => {
        if (this.props.onConfirm) this.props.onConfirm();
        this.startExiting();
    };

    handleCancel = () => {
        if (this.props.onCancel) this.props.onCancel();
        this.startExiting();
    };

    render() {
        const { type = "info", message } = this.props;
        const { exiting } = this.state;
        const icons = { success: <FiCheckCircle />, error: <FiXCircle />, info: <FiInfo />, confirm: <FiAlertTriangle /> };
        
        return (
            <div className={`${styles.toast} ${styles[type]} ${exiting ? styles.exiting : ""}`}>
                <div className={styles.toastIcon}>{icons[type]}</div>
                <div className={styles.toastContent}>
                    <p>{message}</p>
                    {type === "confirm" && (
                        <>
                            <p className={styles.confirmText}>Esta ação requer confirmação.</p>
                            <div className={styles.confirmActions}>
                                <button className={`${styles.confirmButton} ${styles.secondary}`} onClick={this.handleCancel}>Cancelar</button>
                                <button className={`${styles.confirmButton} ${styles.primary}`} onClick={this.handleConfirm}>Confirmar</button>
                            </div>
                        </>
                    )}
                </div>
                {type !== "confirm" && <button className={styles.closeButton} onClick={this.startExiting}><FiX /></button>}
            </div>
        );
    };
};

export default class ToastContainer extends Component {
    state = { toasts: [], };

    componentDidMount() { ToastService.register(this.handleToastRequest); }

    componentWillUnmount() { ToastService.unregister(); }

    handleToastRequest = (action, options) => {
        const newToast = { ...options, id: Date.now() + Math.random(), type: action === "confirm" ? "confirm" : options.type || "info", };
        if (newToast.key && this.state.toasts.some(toast => toast.key === newToast.key)) { return; }
        this.addToast(newToast);
    };

    addToast = (toast) => { this.setState(prevState => ({ toasts: [...prevState.toasts, toast], })); };
    
    removeToast = (id) => { this.setState(prevState => ({ toasts: prevState.toasts.filter(toast => toast.id !== id), })); };

    render() {
        return (
            <div className={styles.toastContainer}>
                {this.state.toasts.map(toast => {
                    const { key, ...toastProps } = toast;
                    return (
                        <Toast
                            key={toast.id}
                            {...toastProps}
                            onClose={() => this.removeToast(toast.id)}
                        />
                    );
                })}
            </div>
        );
    }
}