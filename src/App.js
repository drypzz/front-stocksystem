import React, { Component } from "react";

import RouterComponent from "./router";

import ToastContainer from "./components/Toast";

import api from "./services/api";

import { isAuthenticated } from "./services/auth";

class App extends Component {

    componentDidMount() {
        this.validateTokenOnLoad();
    };

    validateTokenOnLoad = async () => {
        if (isAuthenticated()) {
            try {
                await api.get("/auth/validate");
            } catch (error) {
                console.error("Falha na validação inicial do token (deve ser tratado pelo interceptor):", error);
            };
        };
    };

    render() {
        return (
            <>
                <RouterComponent />
                <ToastContainer />
            </>
        );
    };
};

export default App;