import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/Layout/ParentView'

export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path(.*)',
            component: () => import('@/views/redirect/index')
        }]
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401'),
        hidden: true
    },
    {
        path: '/login',
        component: () => import('@/views/login'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: "/index",
        meta: {
            breadcrumb: false
        },
        children: [{
                path: 'index',
                name: "index",
                component: () => import('@/views/index'),
                meta: {
                    title: '首页',
                    icon: 'el-icon-s-home',
                    affix: true
                }
            },
            { 
                path: "associated",
                hidden: true,
                component: (resolve) => require(["@/views/lot/device/associated/index"], resolve),
                name: "associated",
                meta: {
                    title: "关联设备"
                }
            },
            {
                path: "merchantManagement",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/chinaMerchants/merchantManagement/index"], resolve),
                name: "merchantManagement",
                meta: {
                    title: "商户管理"
                }
            },
            { //招商管理-商户管理-租赁管理
                path: "leaseManage",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/chinaMerchants/leaseManage/index"], resolve),
                name: "leaseManage",
                meta: {
                    title: "租赁管理"
                }
            },
            { //招商管理-商户管理-租赁管理-新建
                path: "leaseManageAdd",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/chinaMerchants/leaseManage/add"], resolve),
                name: "leaseManageAdd",
                meta: {
                    title: "新建"
                }
            },
            { //招商管理-商户管理-租赁管理-查看
                path: "leaseManageView/:type",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/chinaMerchants/leaseManage/view"], resolve),
                name: "leaseManageView",
                beforeEnter: (to, from, next) => {
                    switch (to.query.type) {
                        case 'view':
                            to.meta.title = '查看'
                            break;
                        case 'contract':
                            to.meta.title = '签约'
                            break;
                        case 'enterView':
                            to.meta.title = '查看'
                            break;
                        case 'enterUpload':
                            to.meta.title = '查看'
                            break;
                    }
                    next()
                },
            },
            { //招商管理-商户管理-租赁记录-查看
                path: "recordList",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/enter/list"], resolve),
                name: "recordList",
                meta: {
                    title: "查看"
                }
            },
            { //物联网-水力管理-用水记录-查看
                path: "waterPage/:type",
                hidden: true,
                component: (resolve) => require(["@/views/lot/waterpower/waterRecords/operation"], resolve),
                name: "waterPage",
                meta: {
                    title: "查看"
                }
            },
            { 
                path: 'payment',
                component: () => import('@/views/payment'),
                name: "payment",
                meta: {
                    title: "支付"
                }
            },
            /* { //市场管理-商户管理-商户广告-新建
                path: "merchantAdvertising",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/index/advertising"], resolve),
                name: "merchantAdvertising",
                meta: {
                    title: "新建"
                }
            },
            { //市场管理-商户管理-商户公告-查看预览
                path: "preview/:type",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/index/preview"], resolve),
                name: "preview",
                beforeEnter: (to, from, next) => {
                    to.meta.title = to.query.type == 'view' ? '查看' : '预览';
                    next()
                },
            }, */

        ]
    },

    {
        path: '/areaMgmt',
        component: Layout,
        redirect: "/market/areaMgmt",
        hidden: true,
        meta: {
            title: '区域管理'
        },
        children: [{
            path: 'building',
            name: "building",
            hidden: true,
            component: () => import('@/views/market/area/building'),
            meta: {
                activeMenu: "/market/areaMgmt",
                title: '建筑管理'
            },
        }, {
            path: 'building-main',
            name: "building-main",
            hidden: true,
            component: ParentView,
            redirect: "/areaMgmt/building",
            meta: {
                title: '建筑管理'
            },
            children: [{
                path: 'floor',
                name: "floor",
                hidden: true,
                component: () => import('@/views/market/area/floor'),
                meta: {
                    activeMenu: "/market/areaMgmt",
                    title: '楼层管理'
                }
            }]
        }]
    }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}


export default router