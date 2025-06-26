import React, { Component } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { FiClock, FiCheckCircle, FiXCircle, FiArrowLeft, FiCopy } from "react-icons/fi";

import { PaymentSkeleton } from "../../containers/Skeletons";

import ToastService from "../../services/toastservice";

import Countdown from "../../components/Countdown";

import api from "../../services/api";

import styles from "./style.module.css";

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentInfo: null,
      status: "loading",
      error: "",
    };
    this.intervalID = null;
    this.apiRequestInitiated = false;
  }

  componentDidMount() {
    if (this.apiRequestInitiated) {
      return;
    }
    this.apiRequestInitiated = true;
    this.checkOrderStatusAndProceed();
  }

  componentWillUnmount() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
  }

  checkOrderStatusAndProceed = async () => {
    const { publicId, navigate } = this.props;
    this.setState({ status: "checking" });

    try {
      const response = await api.get(`/order/${publicId}`);
      const currentStatus = response.data.paymentStatus;

      switch (currentStatus) {
        case "pending":
          this.fetchPaymentDetails();
          break;
        case "approved":
          navigate("/orders");
          break;
        case "cancelled":
        case "expired":
        case "failed":
          ToastService.show({
            type: "error",
            message: `Este pedido foi ${currentStatus}.`,
          });
          navigate("/orders");
          break;
        default:
          throw new Error("Status do pedido desconhecido.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Pedido não encontrado ou você não tem permissão.";
      this.setState({ error: errorMessage, status: "failed" });
      setTimeout(() => navigate("/orders"), 3000);
    }
  };

  fetchPaymentDetails = async () => {
    const { publicId } = this.props;
    try {
      const response = await api.post(`/order/${publicId}/pay`);
      this.setState(
        {
          paymentInfo: response.data,
          status: "awaiting",
        },
        () => {
          this.startStatusPolling();
        }
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Não foi possível gerar o pagamento.";
      this.setState({ error: errorMessage, status: "failed" });
    }
  };

  startStatusPolling = () => {
    this.intervalID = setInterval(async () => {
      try {
        const { publicId } = this.props;
        const response = await api.get(
          `/order/${publicId}?_t=${new Date().getTime()}`
        );
        const currentStatus = response.data.paymentStatus;

        if (currentStatus === "approved") {
          this.setState({ status: "approved" });
          clearInterval(this.intervalID);
        } else if (["cancelled", "failed", "expired"].includes(currentStatus)) {
          this.setState({
            status: "failed",
            error: "O pagamento foi cancelado ou expirou.",
          });
          clearInterval(this.intervalID);
        }
      } catch (err) {
        clearInterval(this.intervalID);
      }
    }, 5000);
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        ToastService.show({ type: "success", message: "Código PIX copiado!" });
      },
      () => {
        ToastService.show({
          type: "error",
          message: "Falha ao copiar o código.",
        });
      }
    );
  };

  handleExpire = () => {
    this.setState({
      status: "failed",
      error: "O tempo para pagamento expirou.",
    });
    if (this.intervalID) clearInterval(this.intervalID);
  };

  renderContent = () => {
    const { status, paymentInfo, error } = this.state;

    if (status === "loading" || status === "checking") {
      return <PaymentSkeleton />;
    }

    let icon, title, content;

    switch (status) {
      case "awaiting":
        icon = <FiClock className={`${styles.statusIcon} ${styles.iconPending}`} />;
        title = "Aguardando Pagamento";
        content = (
          <>
            <p className={styles.totalAmount}>
              {paymentInfo.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            {paymentInfo.expiresAt && (
              <Countdown
                expirationTime={paymentInfo.expiresAt}
                onExpire={this.handleExpire}
              />
            )}
            <p className={styles.statusSubtitle}>
              Escaneie o código abaixo para pagar via PIX.
            </p>
            <div className={styles.qrCodeWrapper}>
              <img
                draggable="false"
                src={paymentInfo.qrCodeBase64}
                alt="PIX QR Code"
                className={styles.qrCode}
              />
            </div>
            <div className={styles.pixCopyContainer}>
              <input
                type="text"
                readOnly
                value={paymentInfo.qrCode}
                className={styles.pixCopyPaste}
              />
              <button
                onClick={() => this.copyToClipboard(paymentInfo.qrCode)}
                className={styles.copyButton}
                aria-label="Copiar código PIX"
              >
                <FiCopy />
              </button>
            </div>
            <small className={styles.copyHelpText}>
              Ou clique para copiar o código PIX.
            </small>
          </>
        );
        break;

      case "approved":
        icon = <FiCheckCircle className={`${styles.statusIcon} ${styles.iconApproved}`} />;
        title = "Pagamento Aprovado!";
        content = (
          <>
            <p className={styles.statusSubtitle}>
              Seu pedido foi confirmado e logo será preparado para envio.
            </p>
            <Link to="/orders" className={`${styles.actionButton} ${styles.primaryButton}`}>
              Ver Meus Pedidos
            </Link>
          </>
        );
        break;

      case "failed":
        icon = <FiXCircle className={`${styles.statusIcon} ${styles.iconFailed}`} />;
        title = "Falha no Pagamento";
        content = (
          <>
            <p className={styles.statusSubtitle}>{error}</p>
            <Link to="/orders" className={`${styles.actionButton} ${styles.secondaryButton}`}>
              Voltar ao Histórico
            </Link>
          </>
        );
        break;

      default:
        return null;
    }

    return (
      <div className={styles.statusContentWrapper}>
        {icon}
        <h2 className={styles.statusTitle}>{title}</h2>
        {content}
      </div>
    );
  };

  render() {
    return (
      <main className={styles.container}>
        <div className={styles.paymentBox}>
          <Link to="/orders" className={styles.backLink}>
            <FiArrowLeft /> Voltar
          </Link>
          {this.renderContent()}
        </div>
      </main>
    );
  }
}

const PaymentWrapper = (props) => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  return <Payment {...props} publicId={publicId} navigate={navigate} />;
};

export default PaymentWrapper;
