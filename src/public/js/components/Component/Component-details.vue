<script setup>

import Button from "primevue/button";
import ConfirmDialog from "primevue/confirmdialog";
import Message from "primevue/message";
import InputText from "primevue/inputtext";
import {Form} from "@primevue/forms";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import FloatLabel from "primevue/floatlabel";

</script>

<template>
    <Toast />
    <form @submit.prevent="saveComponentDetails">
        <div class="card">
            <div class="bg-white flex justify-center">
                <div class="flex pt-5 p-4">
                    <FloatLabel>
                        <InputText id="name" v-model="name" aria-describedby="name-help" class="w-75"/>
                        <label for="name">Component Name</label>
                    </FloatLabel>
                    <Message v-if="errors.name" severity="error" variant="simple" size="small">{{errors.name[0]}}</Message>
                </div>
                <div class="flex justify-left p-4">
                    <FloatLabel>
                        <Textarea  id="description" v-model="description" rows="5" cols="30" class="w-75"/>
                        <label for="description">Description</label>
                    </FloatLabel>
                    <Message v-if="errors.description" severity="error" variant="simple" size="small">{{errors.description[0]}}</Message>
                </div>
                <div v-if="$route.params.id" class="flex p-4">
                    <ConfirmDialog></ConfirmDialog>
                    <Button @click="confirmForRemove()" label="Delete Component" severity="danger" outlined></Button>
                </div>
            </div>
            <div class="bg-zinc-200">
                <div class="p-4 text-right">
                    <Button type="submit" >Save</Button>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import {ref} from "vue";

export default {
    name: "Component",
    data() {
        return{
            name: null,
            code: null,
            description: null,
            details: null,
            errors: {
                name: null,
                description: null
            },
            confirm: useConfirm(),
            toast: useToast(),
        }
    },
    mounted() {

    },
    watch: {
        '$route.path': {
            handler: 'getComponent',
            immediate: true // Run on path change
        }
    },
    methods:{
        getComponent(){
            if(this.$route.params.id){
                axios.get('/api/component/' + this.$route.params.id)
                    .then(response => {
                        this.name = response.data.component.name
                        this.description = response.data.component.description
                    })
                    .catch(error => {
                        this.$emit('login')
                    })
            }else{
                this.name = null
                this.description = null
            }
        },
        saveComponentCode(){

        },
        saveComponentDetails(){
            this.errors = {}; // cleaning errors
            let method;
            let url;
            if(this.$route.params.id) {//Edit
                method = 'put'
                url = '/api/component/detail/'+this.$route.params.id
            }else{//New
                method = 'post'
                url = '/api/component'
            }
            axios({
                method: method,
                url: url,
                data: {
                    name: this.name,
                    description: this.description,
                },
            })
                .then(res => {
                    if (res.response && res.response.status === 422) {// Handling Error 422 (Validation)
                        this.errors = res.response.data.errors
                    }else{
                        this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Component updated', life: 2000 });
                        this.$router.push({path: '/component/'+res.data.component.id})
                    }
                });
        },
        confirmForRemove(){
            this.confirm.require({
                message: 'Do you want to delete this Component?',
                header: 'Danger Zone',
                icon: 'pi pi-info-circle',
                rejectProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true
                },
                acceptProps: {
                    label: 'Delete',
                    severity: 'danger'
                },
                accept: () => {
                    axios.delete('/api/component/' + this.$route.params.id)
                        .then(response => {
                            this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Component deleted', life: 3000 });
                            this.$router.push({name:  'components'});
                        })
                        .catch(error => {
                            this.toast.add({ severity: 'error', summary: 'Rejected', detail: 'ERROR!!! Component not deleted', life: 3000 });
                        })
                },
                reject: () => {
                    this.toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        },
    }

}
</script>

<style scoped>

</style>
