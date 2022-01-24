import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js"

// 宣告 Modal 變數(因為要讓 methods 吃到)
let addProductModal = "";

const app = createApp({
    data() {
        return {
            baseUrl: "https://vue3-course-api.hexschool.io/v2",
            apiPath: "gillchin",
            products: [],
            newProduct: {},
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

                    // window.location = "login.html";
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
        // 開啟新增產品 modal
        openAddProductModal() {
            addProductModal.show();

            // 打開新增產品的 modal 時間建立多圖的陣列
            this.newProduct.imageUrl = [];
        },
        // 新增產品
        addProduct() {
            // 組成 API 要的資料格式
            const addNewProduct = {data: {...this.newProduct}};
            console.log(addNewProduct);
        },
        // 刪除產品
        deleteProduct(id) {
            const url = `${this.baseUrl}/api/${this.apiPath}/admin/product/${id}`;
            axios.delete(url)
            .then((res) => {
                console.log(res);
                alert(res.data.message);
                
                // 執行 取得產品資料
                this.getData();
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

        // 在生命週期時指向 DOM 元素
        const productModal = document.querySelector("#productModal");
        addProductModal = new bootstrap.Modal(productModal);
    },
})

app.mount("#app");