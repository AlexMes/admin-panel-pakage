<script setup>

</script>

<template>
    <div>Get!!!</div>
</template>

<script>
export default {
    name: "Get",

    mounted() {
        this.getData();
    },

    methods: {
        getData(){
            axios.get('/api/get')
                .then(response => {
                    console.log(response)
                    this.$cookies.set('__Secure', this.$cookies.get('XSRF-TOKEN'))
                })
                .catch(function (error) {console.log(error.response);});
        }
    }
}
</script>

<style scoped>

</style>
