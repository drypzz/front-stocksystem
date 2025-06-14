import React, { Component } from "react";
import { FiSave, FiLoader } from "react-icons/fi";
import api from "../../services/api";
import ToastService from "../../services/toastservice";
import styles from "./style.module.css";

export default class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: { 
                ...props.userToEdit,
                password: "",
                confirmPassword: "",
            },
            isLoading: false,
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            user: { ...prevState.user, [name]: value },
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ isLoading: true });
        const { user } = this.state;

        if (!user.name || !user.email) {
            ToastService.show({ type: "error", message: "Nome e E-mail são obrigatórios." });
            this.setState({ isLoading: false });
            return;
        }

        const payload = {
            name: user.name,
            email: user.email,
        };
        
        let passwordWasUpdated = false;

        if (user.password) {
            if (user.password !== user.confirmPassword) {
                ToastService.show({ type: "error", message: "As senhas não coincidem." });
                this.setState({ isLoading: false });
                return;
            }
            if (user.password.length < 6) {
                ToastService.show({ type: "error", message: "A nova senha deve ter no mínimo 6 caracteres." });
                this.setState({ isLoading: false });
                return;
            }
            payload.password = user.password;
            passwordWasUpdated = true;
        }
        
        if (user.password) {
            payload.password = user.password;
        }


        try {
            await api.put(`/user/${user.id}`, payload);
            
            const message = passwordWasUpdated 
                ? "Perfil e senha atualizados com sucesso!"
                : "Perfil atualizado com sucesso!";
            ToastService.show({ type: "success", message });
            
            this.setState({ isLoading: false });

            if (this.props.onSuccess) {
                this.props.onSuccess(passwordWasUpdated);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Falha ao atualizar o perfil.";
            ToastService.show({ type: "error", message: errorMessage });
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { user, isLoading } = this.state;

        return (
            <form className={styles.form} onSubmit={this.handleSubmit}>
                <h2 className={styles.title}>Editar Perfil</h2>

                <div className={styles.inputGroup}>
                    <label htmlFor="name">Nome Completo *</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        autoComplete="off" 
                        value={user.name || ""} 
                        onChange={this.handleChange} 
                        disabled={isLoading} 
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">E-mail *</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        autoComplete="off" 
                        value={user.email || ""} 
                        onChange={this.handleChange} 
                        disabled={isLoading} 
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">Nova Senha</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        autoComplete="new-password"
                        value={user.password || ""} 
                        onChange={this.handleChange} 
                        placeholder="Deixe em branco para não alterar"
                        disabled={isLoading} 
                    />
                </div>

                {user.password && (
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">Confirmar Nova Senha *</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password" value={user.confirmPassword || ""} onChange={this.handleChange} disabled={isLoading} />
                    </div>
                )}

                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? (
                        <><FiLoader className={styles.spinner} /> Salvando...</>
                    ) : (
                        <><FiSave /> Salvar Alterações</>
                    )}
                </button>
            </form>
        );
    }
}