import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js"


// 宣告 Modal 變數(因為要讓 methods 吃到)
let productModal = "";
let delProductModal = "";
let logoutModal = "";

const app = createApp({
    data() {
        return {
            baseUrl: "https://vue3-course-api.hexschool.io/v2",
            apiPath: "gillchin",
            products: [],
            isNew: true, // 判斷新增(true) modal or 編輯(false) modal
            tempProduct: {
                imagesUrl: []
            },
            remindMessage: "",
        }
    },
    methods: {
        // 判斷是否登入
        checkAdmin() {
            const url = `${this.baseUrl}/api/user/check`;
            axios.post(url)
                .then((res) => {
                    console.log(res);

                    // 執行 取得產品資料
                    this.getData();
                })
                .catch((err) => {
                    console.log(err);
                    alert(err.response.data.message);

                    // 頁面跳轉
                    window.location = "login.html";
                })
        },
        // 取得產品資料
        getData() {
            const url = `${this.baseUrl}/api/${this.apiPath}/admin/products`;
            axios.get(url)
                .then((res) => {
                    console.log(res);

                    // 將取道的資料賦予到 this.products
                    this.products = res.data.products;
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 開啟產品 modal (新增 & 編輯公用)
        openProductModal(modalStatus, item) {
            // 驗證表單用 - 每開一次新增編輯的 modal 就清空 remindMessage
            this.remindMessage = "";

            // 判斷開啟的 modal 是新增還是編輯
            if (modalStatus === 'new') {
                // 新增 - 清空 tempProduct 物件
                this.tempProduct = {
                    imagesUrl: []
                }

                // 新增頁面將 isNew 改成 true
                this.isNew = true;

                // 開啟 modal
                productModal.show();
            } else if (modalStatus === 'edit') {
                // 編輯 - 將原有的產品資料展開
                this.tempProduct = { ...item };

                // 新增頁面將 isNew 改成 false
                this.isNew = false;

                // 開啟 modal
                productModal.show();
            } else if (modalStatus === 'delete') {
                // 刪除 - 將原有的產品資料展開
                this.tempProduct = { ...item };

                // 開啟 modal
                delProductModal.show();
            } else if (modalStatus === 'logout') {
                // 開啟 modal
                logoutModal.show();
            }
        },
        // 新增 & 編輯產品 (新增 & 編輯共用同個方法)
        updateProduct(id) {
            let url = `${this.baseUrl}/api/${this.apiPath}/admin/product`;
            let httpMethod = "post";

            // 若是編輯就修改 url & httpMethod
            if (!this.isNew) {
                url = `${this.baseUrl}/api/${this.apiPath}/admin/product/${id}`;
                httpMethod = "put";
            }

            // if (!this.tempProduct.title) {
            //     console.log(1);
            //     // this.validation();

            // } else {
            axios[httpMethod](url, { data: this.tempProduct })
                .then((res) => {
                    console.log(res);

                    // 關閉 modal
                    productModal.hide();

                    // 執行 取得產品資料
                    this.getData();
                })
                .catch((err) => {
                    console.dir(err);
                })
            // }

        },
        // 驗證表單
        validation(id) {
            if (!this.tempProduct.title || !this.tempProduct.category || !this.tempProduct.unit || !this.tempProduct.origin_price || !this.tempProduct.price) {
                this.remindMessage = "必填項目！"
            } else {
                this.remindMessage = "";
                this.updateProduct(id);
            }
        },
        // 刪除產品
        deleteProduct(id) {
            const url = `${this.baseUrl}/api/${this.apiPath}/admin/product/${id}`;
            axios.delete(url)
                .then((res) => {
                    console.log(res);

                    // 關閉 modal
                    delProductModal.hide();

                    // 執行 取得產品資料
                    this.getData();
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 登出
        logout() {
            const url = `${this.baseUrl}/logout`;
            axios.post(url)
            .then((res) => {
                console.log(res);

                // 關閉 modal
                logoutModal.hide();

                // 頁面跳轉
                window.location = "./login.html";
            })
            .catch((err) => {
                console.log(err);
            })
        }
    },
    mounted() {
        // 取 token
        const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)gillToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = myToken;

        // 執行 判斷是否登入
        this.checkAdmin();

        // 使用 new 建立 bootstrap modal，拿到實體 DOM 並賦予到變數上
        // 新增 & 編輯的 modal
        productModal = new bootstrap.Modal(document.querySelector("#productModal"), { keyboard: false });
        // 刪除的 modal
        delProductModal = new bootstrap.Modal(document.querySelector("#delProductModal"), { keyboard: false });
        // 登出的 modal
        logoutModal = new bootstrap.Modal(document.querySelector("#logoutModal"), { keyboard: false });
    },
})

app.mount("#app");