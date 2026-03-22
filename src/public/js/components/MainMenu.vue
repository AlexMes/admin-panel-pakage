<script setup>
import 'primeicons/primeicons.css'
import { watch } from 'vue';
</script>


<template>
    <div v-if="!token" class="w-100">
        <Login @login="getToken"></Login>
    </div>
    <div v-if="token" class="w-full">

        <nav>
            <!--    ******************-->
            <small class="ps-2">Tables</small>
            <!--    ******************-->
        <div class="ps-2">

            <router-link active-class="router-link-active" class="main-menu-link"
                         :to="{ path: '/adminpanel/project/'+project.id+'/create/table/' }">
                <i class="pi pi-plus px-1"></i>
                New Table
            </router-link>
<!--            ********************* - org #menu-tab-178 > a -->
            <div v-for="table in project.tables" class="main-menu-link-div" :id="'menu-tab-' + table.id" @click="setActiveItem('menu-tab-' + table.id)">
                    <router-link class="main-menu-link"
                                 :to="{ path: '/adminpanel/table/' + table.id }"
                                 :key="$route.fullPath"
                    >
                        <i v-if="table.status !== 'done'" class="pi pi-circle px-1" style="color: red"></i>
                        <i v-if="table.status === 'done'" class="pi pi-check-circle px-1" style="color: green"></i>
                        {{ table.name }}
                    </router-link>
            </div>
<!--    ******************-->
        <small class="ps-2">Settings</small>
        <!--    ******************-->
        <router-link active-class="router-link-active" v-if="token" class="main-menu-link" :to="{ name: 'users' }">
            <i class="pi pi-minus px-1"></i>
            <i class="pi pi-check px-1" style="color: red"></i>
            Generate
        </router-link>
        <router-link active-class="router-link-active" v-if="token" class="main-menu-link" :to="{ name: 'users' }">
            <i class="pi pi-minus px-1"></i>
            <i class="pi pi-users px-1"></i>
            Developers
        </router-link>
        <router-link active-class="router-link-active" v-if="token" class="main-menu-link" :to="{ name: 'user.profile' }">
            <i class="pi pi-minus px-1"></i>
            <i class="pi pi-user px-1"></i>
            Profile
        </router-link>
        <a @click.prevent="logout" href="#" class="main-menu-link">
            <i class="pi pi-sign-out px-1"></i>
            Log Out
        </a>

        </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: "IndMainMenu",
    data() {
        return {
            token: null,
            projects: {},
            project: {},
            showingTablesNavigationDropdown: {}
        }
    },
    mounted() {
        this.getToken()
        if(this.token){
            this.getMenu()
        }

    },
    watch: {
        '$store.state.getMenu': {
            handler: 'getMenu',
            immediate: true // Запустить getMenu
        }
    },
    methods:{
        getToken(){
            this.token = localStorage.getItem("token")
        },
        logout(){
            localStorage.removeItem('token')
            this.getToken()
            this.$router.push({name: 'home'})
            /*axios.post('/logout')
                .then(response => {
                    localStorage.removeItem('token')
                    this.getToken()
                    this.$router.push({name: 'home'})
                })*/
        },
        getMenu(){
            const token = localStorage.getItem("token")
            if(token) {
                axios.post('/api/dbd/v1/menu',
                    {
                        project_id: localStorage.getItem('project')
                    }
                )
                    .then(response => {
                        if (response.data) {
                            this.projects = response.data[0];
                            this.project = response.data[0];
                            this.showingTablesNavigationDropdown = response.data[1];
                        }
                    })
            }
        },
        showTables(project_id){//Показывать или нет таблицы проэкта в меню
            this.getToken()
            if(this.showingTablesNavigationDropdown['project_'+project_id]){
                this.showingTablesNavigationDropdown['project_'+project_id] = false;
            }else{
                this.showingTablesNavigationDropdown['project_'+project_id] = true;
            }
        },
        setActiveItem(id){
            const element = document.querySelector('.main-menu-link');
            if (element) {
                element.classList.remove('router-link-active');
            }
            element = document.getElementById(id);
            if (element) {
                element.classList.add("router-link-active");
            }
        }
    }
}
</script>

<style>

.router-link-active{
    background-color: var(--p-button-primary-hover-background);
    color: #ff0000;
}

.main-menu-link:hover {
    /*background-color: #000000;
    color: #ff121a;*/
    background-color: var(--p-button-primary-hover-background);
}



small{
    color: #B0B0B3;
}

.bg-menu{
    background-color: #1C1B22;
}
</style>
