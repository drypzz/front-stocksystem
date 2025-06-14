import React, { Component } from "react";

import { FiTrash2, FiEdit, FiAlertTriangle, FiUser, FiShield, FiLogOut } from "react-icons/fi";

import Modal from "../../components/Modal";

import UserForm from "../../containers/UserForm";
import { ProfileSkeleton } from "../../containers/Skeletons";

import { getUser, logout, login } from "../../services/auth";

import ToastService from "../../services/toastservice";

import api from "../../services/api";

import styles from "./style.module.css";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loading: true,
            error: null,
            isUserModalOpen: false,
        };
    }

    componentDidMount() {
        this.loadUserData();
    }

    loadUserData = () => {
        this.setState({ loading: true, error: null });
        const currentUser = getUser();
        if (currentUser) {
            setTimeout(() => {
                this.setState({ user: currentUser, loading: false });
            }, 500);
        } else {
            this.setState({
                error: "Não foi possível carregar os dados. Por favor, faça o login novamente.",
                loading: false,
            });
        }
    };

    handleOpenEditUserModal = () => this.setState({ isUserModalOpen: true });
    handleCloseUserModal = () => this.setState({ isUserModalOpen: false });

    handleSuccessfulUpdate = async () => {
        this.handleCloseUserModal();

        this.setState({ loading: true });

        try {
            const token = localStorage.getItem("authToken");

            const response = await api.get(`/user/${this.state.user.id}`);
            const updatedUser = response.data.user || response.data;

            login(token, updatedUser);

            this.setState({ user: updatedUser, loading: false });
        } catch (error) {
            ToastService.show({ type: "error", message: "Não foi possível sincronizar os dados." });
            this.setState({ loading: false });
        }
    };

    handleDeleteAccount = () => {
        const { user } = this.state;
        if (!user) return;
        ToastService.confirm({
            key: `confirm-delete-user-${user.id}`,
            message: `Tem certeza que deseja excluir sua conta? Esta ação é irreversível.`,
            onConfirm: () => this.performDeleteAccount(user.id),
        });
    };

    performDeleteAccount = async (userId) => {
        try {
            await api.delete(`/user/${userId}`);
            ToastService.show({ key: "delete-user-success", type: "success", message: "Sua conta foi excluída com sucesso." });

            setTimeout(() => {
                logout();
                window.location.href = "/login";
            }, 1500);

        } catch (err) {
            ToastService.show({ key: "delete-user-error", type: "error", message: err.response?.data?.message || "Erro ao excluir a conta." });
        }
    };

    handleLogout = () => {
        logout();
        window.location.href = "/login";
    }

    render() {
        const { user, loading, error, isUserModalOpen } = this.state;
        const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

        return (
            <>
                <div className={styles.container}>
                    {loading ? (
                        <ProfileSkeleton />
                    ) : error ? (
                        <div className={styles.errorState}>
                            <FiAlertTriangle size={32} />
                            <h3>Ocorreu um Erro</h3>
                            <p>{error}</p>
                        </div>
                    ) : (
                        user && (
                            <>
                                <header className={styles.pageHeader}>
                                    <h1 className={styles.title}>Configurações do Perfil</h1>
                                </header>
                                <div className={styles.profileLayout}>
                                    <aside className={styles.profileSidebar}>
                                        <div className={styles.avatar}>
                                            <span>{getInitial(user.name)}</span>
                                        </div>
                                        <div className={styles.userInfo}>
                                            <h2>{user.name}</h2>
                                            <p>{user.email}</p>
                                        </div>
                                        <button className={styles.logoutButton} onClick={this.handleLogout}>
                                            <FiLogOut /> Sair da Conta
                                        </button>
                                    </aside>

                                    <main className={styles.profileMain}>
                                        <div className={styles.sectionCard}>
                                            <div className={styles.sectionHeader}>
                                                <FiUser />
                                                <h3>Informações da Conta</h3>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Nome Completo</span>
                                                    <span className={styles.infoValue}>{user.name}</span>
                                                </div>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Endereço de Email</span>
                                                    <span className={styles.infoValue}>{user.email}</span>
                                                </div>
                                            </div>
                                            <div className={styles.sectionFooter}>
                                                <button className={styles.editButton} onClick={this.handleOpenEditUserModal}>
                                                    <FiEdit /> Editar Informações
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.sectionCard}>
                                            <div className={styles.sectionHeader}>
                                                <FiShield />
                                                <h3>Segurança</h3>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Senha</span>
                                                    <span className={styles.infoValue}>••••••••</span>
                                                </div>
                                            </div>
                                            <div className={styles.sectionFooter}>
                                                <button className={styles.editButton} disabled>Alterar Senha</button>
                                            </div>
                                        </div>

                                        <div className={`${styles.sectionCard} ${styles.dangerZone}`}>
                                            <div className={styles.sectionHeader}>
                                                <FiAlertTriangle />
                                                <h3>Zona de Perigo</h3>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                <p>A exclusão da sua conta é uma ação permanente e removerá todos os seus dados do sistema. Uma vez excluída, não será possível recuperar a conta.</p>
                                                <button className={styles.deleteButton} onClick={this.handleDeleteAccount}>
                                                    <FiTrash2 /> Excluir esta conta
                                                </button>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                            </>
                        )
                    )}
                </div>

                <Modal show={isUserModalOpen} onClose={this.handleCloseUserModal}>
                    <UserForm show={isUserModalOpen} userToEdit={user} onSuccess={this.handleSuccessfulUpdate} />
                </Modal>
            </>
        );
    }
}