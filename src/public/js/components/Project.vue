<script setup>
import Button from 'primevue/button';
import { Form } from '@primevue/forms';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

import ConfirmDialog from 'primevue/confirmdialog';
import {useConfirm} from "primevue/useconfirm";
import Toast from 'primevue/toast';
import {useToast} from "primevue/usetoast";
</script>

<template>

    <div class="card bg-white p-3">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight" v-if="$route.params.id">Edit Project</h2>
        <h2 class="font-semibold text-xl text-gray-800 leading-tight" v-else>New Project</h2>
        <label>Input base project information.</label>
    </div>

    <form @submit.prevent="saveProject">
        <div class="card mt-4">
            <div class="bg-white">
                <div class="flex p-4">
                        <InputText id="name" v-model="name" aria-describedby="name-help" placeholder="Project Name" class="w-75"/>
                        <Message v-if="errors.name" severity="error" variant="simple" size="small">{{errors.name[0]}}</Message>
                </div>
                <div class="flex p-4">
                        <Textarea  id="description" v-model="description" rows="5" cols="30" placeholder="Description" class="w-75"/>
                        <Message v-if="errors.description" severity="error" variant="simple" size="small">{{errors.description[0]}}</Message>
                </div>
                <div v-if="$route.params.id" class="flex p-4">
                    <ConfirmDialog></ConfirmDialog>
                    <Toast />
                    <Button @click="confirmForRemove()" label="Delete Project" severity="danger" outlined></Button>
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

export default {
    name: "Project",
    data() {
        return{
            name: null,
            description: null,
            details: null,
            errors: {
                name: null,
                description: null
            },
            confirm: useConfirm(),
            toast: useToast()
        }
    },
    mounted() {
        //this.getProject()
    },
    watch: {
        '$route.path': {
            handler: 'getProject',
            immediate: true // Запустить getProject при зменении id project
        }
    },
    methods:{
        getProject(){
            if(this.$route.params.id){
                axios.get('/api/project/' + this.$route.params.id)
                    .then(response => {
                        this.name = response.data.project.name
                        this.description = response.data.project.description
                        this.details = response.data.details
                    })
                    .catch(error => {
                        this.$emit('login')
                    })
            }else{
                this.name = null
                this.description = null
            }
        },
        saveProject(){
            this.errors = {}; // Очистка ошибок
            let method;
            let url;
            if(this.$route.params.id) {//Редактировать проэкт
                method = 'put'
                url = '/api/project/'+this.$route.params.id
            }else{//Новый проэкт
                method = 'post'
                url = '/api/project'
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
                if (res.response && res.response.status === 422) {// Обработка ошибки 422 (валидации)
                    this.errors = res.response.data.errors
                }else{

                    this.$router.push({path: res.data})
                }

            });
        },
        confirmForRemove(){
            this.confirm.require({
                message: 'Do you want to delete this Project?',
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
                    axios.delete('/api/project/' + this.$route.params.id)
                        .then(response => {
                            this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Project deleted', life: 3000 });
                            this.$store.commit('updateMenu')
                        })
                        .catch(error => {
                            this.toast.add({ severity: 'error', summary: 'Rejected', detail: 'ERROR!!! Project not deleted', life: 3000 });
                        })
                },
                reject: () => {
                    this.toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        }
    }

}
</script>

