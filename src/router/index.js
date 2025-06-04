import { createRouter, createWebHistory } from 'vue-router';
import registerComponent from '../components/registerComponent.vue';
import loginComponent from '../components/loginComponent.vue';
import categoryForm from '../pages/category/CategoryForm.vue';
import categoryList from '../pages/category/categoryList.vue';
import productCategoryList from "../pages/productCategory/productCategoryList.vue";
import productCategory from "../pages/productCategory/ProductCategoryForm.vue";
import productSubCategoryList from "../pages/productSubCategory/productSubCategoryList.vue";
import ProductSubCategory from "../pages/productSubCategory/ProductSubCategory.vue";
import ProductForm from '../pages/product/ProductForm.vue';
import productList from "../pages/product/productList.vue";
import SaleForm from '../pages/sales/SaleForm.vue';
import saleList from "../pages/sales/saleList.vue";
import ReturnForm from '../pages/returns/ReturnForm.vue';
import returnList from "../pages/returns/returnList.vue";
import transactionHistoryList from '../pages/transaction/transactionHistoryList.vue';
import editUser from '../pages/users/editUser.vue';
import userList from '../pages/users/userList.vue';
import salesReport from '../pages/sales/features/salesReport.vue';
import displayProduct from '../pages/product/displayProduct.vue';
import salesAndProfit from '../pages/sales/features/salesAndProfit.vue';
import pageNotFound from '../components/pageNotFound.vue';
import forgotPassword from '../components/forgotPassword.vue';
import resetPassword from '../components/resetPassword.vue';
import productData from '../pages/product/productData.vue';
import CreateSale from '../pages/sales/CreateSale.vue';
const routes = [
    {
        path: '/',
        name: 'root',
        component: loginComponent,
        meta: { requiresAuth: false},
    },
    {
        path: '/register',
        name: 'register',
        component: registerComponent,
        meta: { requiresAuth: false },
    },

    {
        path: '/editCategory/:id',
        name: 'editCategory',
        component: categoryForm,
        props:{ isEditing: true },
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'login',
        component: loginComponent,
        meta: { requiresAuth: false },
    },
    ,
    {
        path: '/category',
        name: 'createCategory',
        component: CreateSale,
        meta: { requiresAuth: true },
    }
    ,
    {
        path: '/categoryList',
        name: 'categoryList',
        component: categoryList,
        meta: { requiresAuth: true },
    },
    {
        path: '/productCategory',
        name: 'createProductCategory',
        component: productCategory,
        props:{ isEditing : false },
        meta: { requiresAuth: true },
    },
    {
        path: '/productCategoryList',
        name: 'productCategoryList',
        component: productCategoryList,
        meta: { requiresAuth: true },
    },
    {
        path: '/editProductCategory/:id',
        name: 'editProductCategory',
        component: productCategory,
        props:{ isEditing : true },
        meta: { requiresAuth: true },
    },
    {
        path: '/productSubCategory',
        name: 'createProductSubCategory',
        component: ProductSubCategory,
        props:{ isEditing: false }, 
        meta: { requiresAuth: true },
    },
    {
        path: '/productSubCategoryList',
        name: 'productSubCategoryList',
        component: productSubCategoryList,
        meta: { requiresAuth: true },
    },
    {
        path: '/editProductSubCategory/:id',
        name: 'editProductSubCategory',
        component: ProductSubCategory,
        props:{ isEditing: true },
        meta: { requiresAuth: true },
    },
    {
        path: '/product',
        name: 'createProduct',
        component: ProductForm,
        props:{ isEditing: false },
        meta: { requiresAuth: true },
    },
    {
        path: '/productData',
        name: 'ProductData',
        component: productData,
        meta: { requiresAuth: true },
    },
    {
        path: '/productList',
        name: 'productList',
        component: productList,
        meta: { requiresAuth: true },
    },
    {
        path: '/editProduct/:id',
        name: 'editProduct',
        component: ProductForm,
        props:{ isEditing: true },
        meta: { requiresAuth: true },
    },
    {
        path: '/sale',
        name: 'createSale',
        component: CreateSale,
        meta: { requiresAuth: true },
    },
    {
        path: '/saleList',
        name: 'saleList',
        component: saleList,
        meta: { requiresAuth: true },
    },
    {
        path: '/editSale/:id',
        name: 'editSale',
        component: SaleForm,
        props:{ 

            isEditing: true

        },
        meta: { requiresAuth: true },
    },
    {
        path: '/return',
        name: 'createReturn',
        component: ReturnForm,
        props:{
            isEditing : false,
        },
        meta: { requiresAuth: true },
    },
    {
        path: '/returnList',
        name: 'returnList',
        component: returnList,
        meta: { requiresAuth: true },
    },
    {
        path: '/editreturn/:id',
        name: 'returnSale',
        component: ReturnForm,
        props:{isEditing: true},
        meta: { requiresAuth: true },
    },
    {
        path: '/transactionHistoryList',
        name: 'transactionHistoryList',
        component: transactionHistoryList,
        meta: { requiresAuth: true },
    }, {
        path: '/editUser/:id',
        name: 'editUser',
        component: editUser,
        meta: { requiresAuth: true },
    },
    {
        path: '/userList',
        name: 'userList',
        component: userList,
        meta: { requiresAuth: true },
    },
    {
        path: '/salesReport',
        name: 'report',
        component: salesReport,
        meta: { requiresAuth: true },
    },
    {
        path: '/productList/:id',
        name: 'displayProduct',
        component: displayProduct,
        meta: { requiresAuth: true },
    },
    {
        path: '/salesAndProfit',
        name: 'salesProfit',
        component: salesAndProfit,
        meta: { requiresAuth: true },
    },
    {
        path: '/forgotPassword',
        name: 'forgotPassword',
        component: forgotPassword,
        meta: { requiresAuth: false }
    },
    {
        path: '/resetPassword/:resetToken',
        name: 'resetPassword',
        component: resetPassword,
        meta: { requiresAuth: false }
    },
    {
        path: '/:pathMatch(.*)*',
        component: pageNotFound, 
        name: "NotFound"
    }

];

const router = createRouter({
    history: createWebHistory('/inventory/'),
    routes,
});
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !localStorage.getItem('auth_token')) {
        next('/login');
    } else {
        next();
    }
});

export default router;
