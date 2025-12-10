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


import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import { ref } from 'vue';

</script>

<template>
    <div class="card bg-white p-3 p-6 m-6">
        <h2 v-if="$route.params.id">Edit Table</h2>
        <h2 v-else>New Table</h2>
        <label>Input base table information.</label>
    </div>

    <Tabs v-model:value="activePanel" class="mt-4">
        <TabList>
            <Tab value="Details">Details</Tab>
            <Tab v-if="$route.params.id" value="Fields">Fields</Tab>
        </TabList>
        <TabPanels>
            <TabPanel value="Details">
                <form @submit.prevent="saveTable">
                    <div class="card mt-4">
                        <div class="bg-white flex justify-center">
                            <div class="flex p-4">
                                <InputText id="name" v-model="name" aria-describedby="name-help" placeholder="Table Name" class="w-75"/>
                                <Message v-if="errors.name" severity="error" variant="simple" size="small">{{errors.name[0]}}</Message>
                            </div>
                            <div class="flex justify-left p-4">
                                <Textarea  id="description" v-model="description" rows="5" cols="30" placeholder="Description" class="w-75"/>
                                <Message v-if="errors.description" severity="error" variant="simple" size="small">{{errors.description[0]}}</Message>
                            </div>
                            <div v-if="$route.params.id" class="flex p-4">
                                <ConfirmDialog></ConfirmDialog>
                                <Toast />
                                <Button @click="confirmForRemove()" label="Delete Table" severity="danger" outlined></Button>
                            </div>
                        </div>
                        <div class="bg-zinc-200">
                            <div class="p-4 text-right">
                                <Button type="submit" >Save</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </TabPanel>
            <TabPanel value="Fields">
                <Field-list />
            </TabPanel>

        </TabPanels>
    </Tabs>


</template>

<script>
import {ref} from "vue";

export default {
    name: "Table",
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
            toast: useToast(),

            activePanel: ref('Fields'), //id open AccordionPanel

        }
    },
    mounted() {

    },
    watch: {
        '$route.path': {
            handler: 'getTable',
            immediate: true // Запустить getTable при зменении id pTable
        }
    },
    methods:{
        getTable(){
            if(this.$route.params.id){
                axios.get('/api/table/' + this.$route.params.id)
                    .then(response => {
                        this.name = response.data.table.name
                        this.description = response.data.table.description
                        this.details = response.data.table.details
                    })
                    .catch(error => {
                        this.$emit('login')
                    })
                this.activePanel = 'Fields'
            }else{
                this.name = null
                this.description = null
                this.activePanel = 'Details'
            }
        },
        saveTable(){
            this.errors = {}; // Очистка ошибок
            let method;
            let url;
            if(this.$route.params.id) {//Редактировать проэкт
                method = 'put'
                url = '/api/table/'+this.$route.params.id
            }else{//Новый проэкт
                method = 'post'
                url = '/api/table/'+this.$route.params.project_id
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
                        this.$store.commit('updateMenu')
                        this.$router.push({path: res.data})
                    }

                });
        },
        confirmForRemove(){
            this.confirm.require({
                message: 'Do you want to delete this Table?',
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
                    axios.delete('/api/table/' + this.$route.params.id)
                        .then(response => {
                            this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Table deleted', life: 3000 });
                            this.$store.commit('updateMenu')
                        })
                        .catch(error => {
                            this.toast.add({ severity: 'error', summary: 'Rejected', detail: 'ERROR!!! Table not deleted', life: 3000 });
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
