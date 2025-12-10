<script setup>

</script>

<template>
    <div class="w-25 p-5">
        <input v-model="name" type="name" placeholder="name" class="form-control mb-3">
        <input v-model="email" type="email" placeholder="email" class="form-control mb-3">
        <input v-model="password" type="password" placeholder="password" class="form-control mb-3">
        <input v-model="password_confirmation" type="password" placeholder="password confirmation" class="form-control mb-3">
        <input @click.prevent="register" type="submit" value="registration" class="btn btn-primary mb-3">
    </div>
</template>

<script>
export default {
    name: "Register",
    data(){
        return {
            name: null,
            email: null,
            password: null,
            password_confirmation: null
        }
    },
    methods: {
        register(){
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post("/register",{
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        password_confirmation: this.password_confirmation
                    })
                    .then(r => {
                        localStorage.setItem('token', this.$cookies.get('XSRF-TOKEN'))
                        this.$router.push({name: 'user.personal'})
                    })

            })
        }
    }
}
</script>

<style scoped>

</style>
