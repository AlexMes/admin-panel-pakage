<script setup>

</script>

<template>
    <h1>HOME</h1>
    <div>Описание сайта!!!</div>
</template>

<script>
export default {
    name: "Home",
    mounted() {
        this.$store.commit('updateMenu')
    }
}
</script>

<style scoped>

</style>
