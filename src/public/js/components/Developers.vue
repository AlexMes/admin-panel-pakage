<script setup>
import Button from "primevue/button";
import Fieldset from 'primevue/fieldset';
import Toast from "primevue/toast";
</script>

<template>
    <div class="card bg-white p-3 p-6 m-6">
        <h2>Users</h2>
        <label>List of users.</label>
    </div>
    <Toast />
    <div class="card mt-4">
        <div class="bg-white flex justify-center">
            <div class="row pt-4 ms-2 me-2">
                <div class="col-6 p-3">
                    <Fieldset legend="ABC Bashboard"  :toggleable="true" class="mb-3">

                    </Fieldset>
                    <Fieldset legend="ABC Bashboard"  :toggleable="true" class="mb-3">

                    </Fieldset>
                </div>
                <div class="col-6 p-3">
                    <Fieldset legend="ABC Bashboard"  :toggleable="true" class="mb-3">

                    </Fieldset>
                    <Fieldset legend="ABC Bashboard"  :toggleable="true" class="mb-3">

                    </Fieldset>
                </div>
            </div>
        </div>
        <div class="bg-zinc-200">
            <div class="p-3 text-right">
                <Button type="button" @click="save" id="save" class="ms-3">Save</Button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Developers",
    data(){
        return{
            name: null
        }
    },
    mounted() {

    },
    watch: {

    },
    methods:{
        save(e){

        }
    }
}
</script>

<style scoped>

</style>
