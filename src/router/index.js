import { createRouter, createWebHistory } from 'vue-router';
import registerComponent from '../components/registerComponent.vue';
import loginComponent from '../components/loginComponent.vue';
import categoryList from '../pages/category/categoryList.vue';
import productCategoryList from "../pages/productCategory/productCategoryList.vue";
import productSubCategoryList from "../pages/productSubCategory/productSubCategoryList.vue";
import productList from "../pages/product/productList.vue";
import saleList from "../pages/sales/saleList.vue";

import returnList from "../pages/returns/returnList.vue";
import transactionHistoryList from '../pages/transaction/transactionHistoryList.vue';
import editUser from '../pages/users/editUser.vue';
import userList from '../pages/users/userList.vue';
import salesReport from '../pages/sales/features/salesReport.vue';
import reportsDashboard from '../pages/reports/reportsDashboard.vue';
import displayProduct from '../pages/product/displayProduct.vue';
import salesAndProfit from '../pages/sales/features/salesAndProfit.vue';
import reservationList from '../pages/reservation/reservationList.vue';
import pageNotFound from '../components/pageNotFound.vue';
import forgotPassword from '../components/forgotPassword.vue';
import resetPassword from '../components/resetPassword.vue';
import productData from '../pages/product/productData.vue';

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
        path: '/login',
        name: 'login',
        component: loginComponent,
        meta: { requiresAuth: false },
    },
    {
        path: '/categoryList',
        name: 'categoryList',
        component: categoryList,
        meta: { requiresAuth: true },
    },

    {
        path: '/productCategoryList',
        name: 'productCategoryList',
        component: productCategoryList,
        meta: { requiresAuth: true },
    },


    {
        path: '/productSubCategoryList',
        name: 'productSubCategoryList',
        component: productSubCategoryList,
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
        path: '/saleList',
        name: 'saleList',
        component: saleList,
        meta: { requiresAuth: true },
    },
    {
        path: '/returnList',
        name: 'returnList',
        component: returnList,
        meta: { requiresAuth: true },
    },



    {
        path: '/transactionHistoryList',
        name: 'transactionHistoryList',
        component: transactionHistoryList,
        meta: { requiresAuth: true },
    }, {
        path: '/reservationList',
        name: 'reservationList',
        component: reservationList,
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
        path: '/reports',
        name: 'reports',
        component: reportsDashboard,
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
