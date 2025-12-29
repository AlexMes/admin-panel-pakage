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
import Checkbox from 'primevue/checkbox';

const checked = ref(true);
const dnChecked = ref(false);

import { ref } from 'vue';
import FloatLabel from "primevue/floatlabel";
import column from "./Column.vue";

</script>

<template>
    <div class="row card bg-white p-3 p-6 m-6">
        <div class="col-11">
        <div class="row">
            <div class="col-11">
                <h2 v-if="$route.params.id">Edit Table</h2>
                <h2 v-else>New Table</h2>
                <label>Input base table information.</label>
            </div>
            <div class="col-1 ">
                <Button @click="codeGen()" style="margin-left: 5px;"><i class="pi pi-cog px-1"></i>GENERATE</Button>
            </div>
        </div>
        </div>
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
                            <div v-if="!$route.params.id" class="row p-4">

                                <div v-for="column of columns" :key="column.key" class="col-md-2" style="white-space: nowrap;">
                                        <Checkbox v-model="selectedColumns" :inputId="column.key" name="column" :value="column.name" style="margin-right: 5px" />
                                        <label :for="column.key" class="">{{ column.name }}</label>
                                </div>
                                <Message v-if="errors.columns" severity="error" variant="simple" size="small">{{ errors.columns[0] }}</Message>
                                <div class="col-md-6"></div>
                            </div>
                            <div class="flex justify-left mt-4 p-4">
                                <FloatLabel class="">
                                    <InputText id="name" v-model="name" :disabled="$route.params.id" aria-describedby="name-help" class="w-75"/>
                                    <label for="name">Name</label>
                                </FloatLabel>
                                <Message v-if="errors.name" severity="error" variant="simple" size="small">{{ errors.name[0] }}</Message>
                                <label v-else >Name for DB migration</label>
                            </div>
                            <div class="flex justify-left mt-4 p-4">
                                <FloatLabel class="">
                                    <Textarea  id="description" v-model="description" rows="5" cols="30" class="w-75"/>
                                    <label for="name">description</label>
                                </FloatLabel>
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
                <Column-list />
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
            local_hostname: window.location.protocol+'//'+window.location.hostname,

            selectedColumns: ['ID', 'Timestamps'],
            columns: [
                { name: "ID", key: "id_increment" },
                { name: "Soft delete", key: "soft_del" },
                { name: "Timestamps", key: "timestamps" },
            ],
            table_id: null
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
                axios.get('/api/dbd/v1/table/' + this.$route.params.id)
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
                url = '/api/dbd/v1/table/'+this.$route.params.id
            }else{//Новый проэкт
                method = 'post'
                url = '/api/dbd/v1/table/'+this.$route.params.project_id
            }
            axios({
                method: method,
                url: url,
                data: {
                    name: this.name,
                    description: this.description,
                    columns: this.selectedColumns,
                },
            })
                .then(res => {
                    if (res.response && res.response.status === 422) {// Обработка ошибки 422 (валидации)
                        this.errors = res.response.data.errors
                    }else{
                        this.$store.commit('updateMenu')
                        this.table_id = res.data
                        //Запрос на генерацию
                        this.codeGen()
                        this.$router.push({path: '/adminpanel/table/'+res.data})
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
                    axios.delete('/api/dbd/v1/table/' + this.$route.params.id)
                        .then(response => {
                            this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Table deleted', life: 3000 });
                            this.$store.commit('updateMenu')
                            //Запрос на генерацию
                            this.codeGen()
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
        codeGen(){
            axios({
                method: 'get',
                url: this.local_hostname+'/codegen/'+this.table_id,
                data: {
                    columns: this.selectedColumns
                },
            }).then(response => {
                    console.log("CodeGen OK!!!!!!!!");
                })
                .catch(error => {
                    console.log("CodeGen Error!!!!");
                })

        }
    }

}
</script>
