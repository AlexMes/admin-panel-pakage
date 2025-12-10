<script setup>
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
</script>

<template>
    <div>
        <div>
            <InputText id="email" v-model="email" type="email" placeholder="email" class="m-3"/>
        </div>
        <div>
            <InputText @keydown.enter="login" id="password" v-model="password" type="password" placeholder="password" class="m-3"/>
        </div>
        <div>
            <Button @click.prevent="login" type="submit" severity="secondary" label="Login" class="m-3"/>
        </div>
    </div>

</template>

<script>
import axios from "axios";

export default {
    name: "Login",

    data() {
        return {
            email: null,
            password: null
        }
    },

    methods: {
        login(){
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post('/api/auth/spa/login', {email: this.email, password: this.password})
            .then(r => {
                    localStorage.setItem('token', r.data['token'])
                    window.axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token')
                    this.$emit('login')
                    this.$store.commit('updateMenu')
                    this.$router.push({name: 'user.personal'})
                }).catch(function (error) {
                    });
            });
        }
    }
}
</script>

<style scoped>

</style>
