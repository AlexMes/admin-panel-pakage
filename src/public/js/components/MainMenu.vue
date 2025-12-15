<script setup>
import 'primeicons/primeicons.css'
import { watch } from 'vue';
</script>


<template>
    <div v-if="!token" class="w-100">
        <Login @login="getToken"></Login>
    </div>
    <div v-if="token" class="w-full">
        <!--    ******************-->
        <small class="ps-2">Tables</small>
        <!--    ******************-->
        <div class="ps-4">
            <router-link active-class="active-link" class="main-menu-link"
                         :to="{ path: '/adminpanel/project/'+project.id+'/create/table/' }">
                <i class="pi pi-plus px-1"></i>
                New Table
            </router-link>
            <router-link active-class="active-link" v-for="table in project.tables" class="main-menu-link"
                         :to="{ path: '/adminpanel/table/' + table.id }">
                {{ table.name }}
            </router-link>
        </div>

        <!--    ******************-->
        <small class="ps-2">Settings</small>
        <!--    ******************-->
        <router-link active-class="active-link" v-if="token" class="main-menu-link" :to="{ name: 'users' }">
            <i class="pi pi-minus px-1"></i>
            <i class="pi pi-users px-1"></i>
            Developers
        </router-link>
        <router-link active-class="active-link" v-if="token" class="main-menu-link" :to="{ name: 'user.profile' }">
            <i class="pi pi-minus px-1"></i>
            <i class="pi pi-user px-1"></i>
            Profile
        </router-link>
        <a @click.prevent="logout" href="#" class="main-menu-link">
            <i class="pi pi-sign-out px-1"></i>
            Log Out
        </a>
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
        this.getMenu()
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
            this.getToken()
            axios.post('/api/dbd/v1/menu',
                {
                    project_id: 23
                }
            )
                .then(response => {
                    if(response.data){
                        this.projects = response.data[0];
                        this.project = response.data[0];
                        console.log(this.project.tables);
                        this.showingTablesNavigationDropdown = response.data[1];
                    }
                })
        },
        showTables(project_id){//Показывать или нет таблицы проэкта в меню
            this.getToken()
            if(this.showingTablesNavigationDropdown['project_'+project_id]){
                this.showingTablesNavigationDropdown['project_'+project_id] = false;
            }else{
                this.showingTablesNavigationDropdown['project_'+project_id] = true;
            }
        }
    }
}
</script>

<style>
.active-link{
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
