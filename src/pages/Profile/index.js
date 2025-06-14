import React, { Component } from "react";
import { FiTrash2, FiEdit, FiAlertTriangle } from "react-icons/fi";
import api from "../../services/api";
import ToastService from "../../services/toastservice";
import styles from "./style.module.css";
import { getUser, logout, login } from "../../services/auth";

import Modal from "../../components/Modal";
import UserForm from "../../containers/UserForm";

import { ProfileSkeleton } from "../../containers/Skeletons";

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
        setTimeout(() => {
            this.loadUserData();
        }, 500);
    }

    loadUserData = () => {
        this.setState({ loading: true, error: null });
        const currentUser = getUser();
        if (currentUser) {
            this.setState({ user: currentUser, loading: false });
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
        
        try {
            const response = await api.get(`/user/${this.state.user.id}`);
            const updatedUser = response.data.user || response.data;
            
            login(localStorage.getItem("authToken"), updatedUser);
            this.loadUserData();

        } catch (error) {
            ToastService.show({ type: "error", message: "Não foi possível sincronizar os dados." });
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
            ToastService.show({ key: "delete-user-success", type: "success", message: "Sua conta foi excluída." });
            logout();
            window.location.href = "/login";
        } catch (err) {
            ToastService.show({ key: "delete-user-error", type: "error", message: err.response?.data?.message || "Erro ao excluir a conta." });
        }
    };

    render() {
        const { user, loading, error, isUserModalOpen } = this.state;
        const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

        return (
            <>
                <div className={styles.pageContainer}>
                    <div className={styles.profileLayout}>
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
                                    <aside className={styles.profileSidebar}>
                                        <div className={styles.avatar}>
                                            <span>{getInitial(user.name)}</span>
                                        </div>
                                        <div className={styles.userInfo}>
                                            <h1>{user.name}</h1>
                                            <p>{user.email}</p>
                                        </div>
                                        <button className={styles.editButton} onClick={this.handleOpenEditUserModal}>
                                            <FiEdit /> Editar Perfil
                                        </button>
                                    </aside>

                                    <main className={styles.profileMain}>
                                        <div className={`${styles.sectionCard} ${styles.dangerZone}`}>
                                            <div className={styles.sectionHeader}>
                                                <h2>Zona de Perigo</h2>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                <p>A exclusão da sua conta é uma ação permanente e removerá todos os seus dados do sistema. Uma vez excluída, não será possível recuperar a conta.</p>
                                                <button className={styles.deleteButton} onClick={this.handleDeleteAccount}>
                                                    <FiTrash2 /> Excluir esta conta
                                                </button>
                                            </div>
                                        </div>
                                    </main>
                                </>
                            )
                        )}
                    </div>
                </div>


                <Modal show={isUserModalOpen} onClose={this.handleCloseUserModal}>
                    <UserForm show={isUserModalOpen} userToEdit={user} onSuccess={this.handleSuccessfulUpdate} />
                </Modal>
            </>
        );
    }
}