<script setup>
import 'primeicons/primeicons.css'
</script>

<template>
    <div class="row w-100 min-vh-100" style="min-width: 576px">
        <div id="menu" class="col-lg-2 bg-menu">
            <header>
                <div class="d-lg-none text-white p-4">
                    <i @click="NavigationDropdown" class="pi pi-align-justify" style="font-size: 2.5rem"></i>
                </div>
                <div class="row d-none d-lg-block ps-4">
                    <router-link :to="{ name: 'home'}" style="text-decoration: none;">
                        <table>
                            <tbody>
                            <tr>
                                <td><ApplicationLogo/></td>
<!--                                <td><ApplicationLogo></ApplicationLogo></td>-->
                                <td class=" ps-4 text-white"><h4 style="line-height:40px">Admin Panel</h4></td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="col-md-3">

                        </div>
                        <div>

                        </div>
                    </router-link>
                </div>
                <div class="d-none d-lg-block text-white px-4">
                    <div class="text-lg-end"><small>{{ name }}</small></div>
                    <div class="text-lg-end"><small>{{ email }}</small></div>
                </div>
            </header>
            <div id="MainMenu" class="d-lg-block" :class="{ 'd-block': showingNavigationDropdown, 'd-none': !showingNavigationDropdown }">
                <MainMenu></MainMenu>
            </div>
        </div>
        <div class="col-lg-10 bg-content p-4">
            <transition><!--Анимация переходов-->
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: "Index",
    data() {
        return {
            name: null,
            email: null,
            showingNavigationDropdown: false
        }
    },
    mounted() {
        this.getUser()
    },
    methods:{
        getUser(){
            axios.get('/api/user', {email: this.email, password: this.password})
                .then(response => {
                    this.name = response.data.name
                    this.email = response.data.email
                })
        },
        NavigationDropdown(){
            if(this.showingNavigationDropdown){
                this.showingNavigationDropdown = false;
            }else{
                this.showingNavigationDropdown = true;
            }
        }
    }
}
</script>

<style scoped>

</style>
