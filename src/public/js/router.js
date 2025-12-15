import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/adminpanel', // This is the prefix
        //component: () => import('./components/index.vue'), // A layout component for admin routes
        name: 'adminpanel', // A layout component for admin routes
        children: [
            {path: 'home', component: () => import('./components/Home.vue'), name: 'home'},
            {path: 'get', component: () => import('./components/Get.vue'), name: 'get'},
            {
                path: 'registration',
                component: () => import('./components/Registration.vue'),
                name: 'user.registration'
            },
            {path: 'profile', component: () => import('./components/Profile.vue'), name: 'user.profile'},
            {path: 'users', component: () => import('./components/Users.vue'), name: 'users'},

            {path: 'create/project', component: () => import('./components/Project.vue'), name: 'project.create'},
            {path: 'project/:id', component: () => import('./components/Project.vue'), name: 'project.edit'},

            {path: 'table/:id', component: () => import('./components/Table.vue'), name: 'table'},
            {
                path: 'project/:project_id/create/table',
                component: () => import('./components/Table.vue'),
                name: 'table.create'
            },
            {path: 'create/field/:table_id', component: () => import('./components/Column.vue'), name: 'field.create'},
            {path: 'field/:id', component: () => import('./components/Column.vue'), name: 'field'},

            {
                path: 'components',
                component: () => import('./components/Component/Component-list.vue'),
                name: 'components'
            },
            {
                path: 'create/component',
                component: () => import('./components/Component/Component.vue'),
                name: 'component.create'
            },
            {
                path: 'component/:id',
                component: () => import('./components/Component/Component.vue'),
                name: 'component'
            },
        ]
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});



router.beforeEach((to, from, next) => {

    const token = localStorage.getItem('token')

    if (!token){
        if (to.name !== 'home') {
            return next({name: 'home'});
        }
    }
    /*if (!token){
        if(to.name === 'user.login' || to.name === 'user.registration'){
            return next();
        }else{
            return next({name: 'home'});
        }
    }

    if (to.name === 'user.login' || to.name === 'user.registration' && token){
        return next({name: 'home'});
    }*/

    next()
})

export default router;

