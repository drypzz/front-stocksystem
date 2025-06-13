class ToastService {
    constructor() {
        this.listener = null;
    };


    register(listener) {
        this.listener = listener;
    };

    unregister() {
        this.listener = null;
    };

    show(options) {
        if (this.listener) {
            this.listener("show", options);
        };
    };

    confirm(options) {
        if (this.listener) {
            this.listener("confirm", options);
        };
    };
};

export default new ToastService();