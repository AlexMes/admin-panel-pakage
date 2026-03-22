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
import Select from 'primevue/select';

const checked = ref(true);
const dnChecked = ref(false);

import { ref } from 'vue';
import FloatLabel from "primevue/floatlabel";
import column from "./Column.vue";

</script>

<template>
    <div class="card bg-white p-3 p-6 m-6">
        <div class="row">
            <div class="col-7">
                <h2 v-if="$route.params.id">Edit Table</h2>
                <h2 v-else>New Table</h2>
                <label>Input base table information.</label>
            </div>
            <div v-if="$route.params.id" class="col-5 d-flex justify-content-end">
                <Button @click="codeGen($route.params.id)" style="margin-left: 5px;"><i class="pi pi-cog px-1"></i>GENERATE</Button>
            </div>
        </div>
    </div>

    <Toast />
    <div class="card mt-4">
        <Tabs v-model:value="activePanel" >
            <TabList>
                <Tab value="Details">Details</Tab>
                <Tab v-if="$route.params.id" value="Fields">Fields</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="Details">
                    <div class="card bg-white mt-4">
                        <div class="bg-white flex justify-center p-4">
                            <div v-if="!$route.params.id" class="row pb-5">
                                <div v-for="column of columns" :key="column.key" class="col-md-2" style="white-space: nowrap;">
                                    <Checkbox
                                        v-model="selectedColumns"
                                        @change="columnCheck($event.target.id, $event.target.checked)"
                                        :inputId="column.key" name="column"
                                        :value="column.name"
                                        :disabled="column.disabled"
                                        style="margin-right: 5px"
                                    />
                                    <label :for="column.key" >{{ column.name }}</label>
                                </div>
                                <Message v-if="errors.columns" severity="error" variant="simple" size="small">{{ errors.columns[0] }}</Message>
                                <div class="col-md-4"></div>
                            </div>
                            <div v-if="many_to_many" class="row w-75 pb-3">
                                <div class="col-md-6  pb-3">
                                    <div>
                                        <Select v-model="table_1"
                                                @change="setManyToManyTableNameByConvention()"
                                                name="table_1" :options="table_list" optionLabel="name" optionValue="id"
                                                placeholder="Select a table" fluid/>
                                        <Message v-if="errors.table_1" severity="error" variant="simple" size="small">
                                            {{ errors.table_1[0] }}
                                        </Message>
                                    </div>
                                </div>
                                <div class="col-md-6 pb-3">
                                    <div>
                                        <Select v-model="table_2"
                                                @change="setManyToManyTableNameByConvention()"
                                                name="table_2" :options="table_list" optionLabel="name" optionValue="id"
                                                placeholder="Select a table" fluid/>
                                        <Message v-if="errors.table_2" severity="error" variant="simple" size="small">
                                            {{ errors.table_2[0] }}
                                        </Message>
                                    </div>
                                </div>
                            </div> <!--Tables-->
                            <div v-if="many_to_many" class="row w-75 pb-3">
                                <div class="col-md-6 p-3">
                                    <FloatLabel >
                                        <InputText id="belongsToMany_1" v-model="belongsToMany_1" class="w-100"/>
                                        <label for="belongsToMany_1">belongsToMany function name</label>
                                    </FloatLabel>
                                    <Message v-if="errors.belongsToMany_1" severity="error" variant="simple" size="small">{{ errors.belongsToMany_1[0] }}</Message>
                                    <label v-else >public function BelongsToMany</label>
                                </div>
                                <div class="col-md-6 p-3">
                                    <FloatLabel >
                                        <InputText id="belongsToMany_2" v-model="belongsToMany_2" class="w-100"/>
                                        <label for="belongsToMany_2">belongsToMany function name</label>
                                    </FloatLabel>
                                    <Message v-if="errors.belongsToMany_2" severity="error" variant="simple" size="small">{{ errors.belongsToMany_2[0] }}</Message>
                                    <label v-else >public function BelongsToMany</label>
                                </div>
                            </div> <!--Functions-->
                            <div class="flex justify-left pb-3">
                                <FloatLabel >
                                    <InputText id="name" v-model="name" :disabled="$route.params.id" class="w-75"/>
                                    <label for="name">Name</label>
                                </FloatLabel>
                                <Message v-if="errors.name" severity="error" variant="simple" size="small">{{ errors.name[0] }}</Message>
                                <label v-else >Table name</label>
                            </div><!--Name-->
                            <div class="flex justify-left pb-3">
                                <FloatLabel>
                                    <InputText id="label" v-model="label" :disabled="$route.params.id"  class="w-75"/>
                                    <label>Label</label>
                                </FloatLabel>
                                <Message v-if="errors.label" severity="error" variant="simple" size="small">{{ errors.label[0] }}</Message>
                                <label v-else >Label for main menu</label>
                            </div> <!--Label-->
                            <div class="flex justify-left pb-3">
                                <FloatLabel >
                                    <Textarea  id="description" v-model="description" rows="5" cols="30" class="w-75"/>
                                    <label>description</label>
                                </FloatLabel>
                                <Message v-if="errors.description" severity="error" variant="simple" size="small">{{errors.description[0]}}</Message>
                            </div> <!-- Description -->
                            <div v-if="$route.params.id" class="flex p-4">
                                <ConfirmDialog></ConfirmDialog>
                                <Toast />
                                <Button @click="confirmForRemove()" label="Delete Table" severity="danger" outlined></Button>
                            </div>  <!-- Remove -->
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="Fields">
                    <Column-list />
                </TabPanel>
            </TabPanels>
        </Tabs>

        <div class="bg-zinc-200">
            <div class="p-3 text-right">
                <Button type="button" @click="save" id="saveAndGenerate" class="ms-3">Save & Generate</Button>
                <Button type="button" @click="save" id="save" class="ms-3">Save</Button>
            </div>
        </div>
    </div>




</template>

<script>
import {ref} from "vue";
import {data} from "autoprefixer";

export default {
    name: "Table",
    data() {
        return{
            name: null,
            label: null,
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
                { name: "ID", key: "id_increment", disabled: false},
                { name: "Soft delete", key: "soft_del", disabled: false},
                { name: "Timestamps", key: "timestamps", disabled: false},
                { name: "Many to many", key: "many_to_many", disabled: false},
            ],
            many_to_many: false,
            table_id: null,

            table_list: null,
            table_1: null,
            table_2: null,
            column_list_1: null,
            column_list_2: null,
            belongsToMany_1: null,
            belongsToMany_2: null,
        }
    },
    mounted() {
        this.getTablesList()
    },
    watch: {
        '$route.path': {
            handler: 'getTable',
            immediate: true // Запустить getTable при изменении id pTable
        },
        table_1(newValue, oldValue) {
            this.belongsToMany_2 = this.getTableNameById(newValue)
        },
         table_2(newValue, oldValue) {
            this.belongsToMany_1 = this.getTableNameById(newValue)
        },

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
        getTablesList(){
            axios.get('/api/dbd/v1/tables/table-list/'+localStorage.getItem('project'))
                .then(r => {
                    if(r.data){
                        this.table_list = r.data.tables
                    }
                })
        },
        getColumnList(column_list, table_var, column_var){
            axios.get('/api/dbd/v1/tables/column-list/'+this[table_var])
                .then(r => {
                    if(r.data){
                        console.log("--------------------------------")//column_list_1
                        console.log(column_list)//column_list_1
                        this[column_list] = r.data
                        var len = this[column_list].length;
                        for (var i = 0; i < len; i++) {
                            if(this[column_list][i]["name"] == "id"){
                                this[column_var] = this[column_list][i]["id"];
                            }
                        }
                    }
                })
        },
        save(e){
            let method;
            let url;
            if(this.$route.params.id) {//Редактировать таблицу
                method = 'put'
                url = '/api/dbd/v1/table/'+this.$route.params.id
            }else{//Новый таблица
                method = 'post'
                url = '/api/dbd/v1/table/'+this.$route.params.project_id
            }

            if(!this.many_to_many){
                axios.post('/api/dbd/v1/getTableNameByConvention',
                    {
                        name: this.name,
                    })
                    .then(response => {
                        this.name = response.data;
                        /*-----------------------------------------------*/
                        this.saveAxios(method, url, e.target.id)
                        /*-----------------------------------------------*/
                    })
                    .catch(error => {
                    })
            }else{
                this.saveAxios(method, url)
            }
        },
        saveAxios(method, url, eTargetId){
            axios({
                method: method,
                url: url,
                data: {
                    name: this.name,
                    label: this.label,
                    description: this.description,
                    columns: this.selectedColumns,
                    table_1: this.table_1,
                    table_2: this.table_2,
                    /*column_1: this.column_1,
                    column_2: this.column_2,*/
                    belongsToMany_1: this.belongsToMany_1,
                    belongsToMany_2: this.belongsToMany_2,
                },
            })
                .then(res => {
                    if (res.response && res.response.status === 422) {// Обработка ошибки 422 (валидации)
                        this.errors = res.response.data.errors
                    }else{
                        this.$store.commit('updateMenu')
                        this.table_id = res.data
                        //Запрос на генерацию
                        if(eTargetId == 'saveAndGenerate'){
                            this.codeGen(this.table_id)
                        }

                        this.$router.push({path: '/adminpanel/table/'+res.data})
                        this.errors = {}; // Очистка ошибок
                        this.name = "";
                        this.label = "";
                        this.description = "";
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
        codeGen(id){
            axios({
                method: 'get',
                url: this.local_hostname+'/codegen/'+id,
                data: {
                    columns: this.selectedColumns
                },
            }).then(response => {
                    console.log("CodeGen OK!!!");
                })
                .catch(error => {
                    console.log("CodeGen Error!!!");
                })

        },
        //реакція на вібір 'Many to many'
        columnCheck(id, checked){
            this.errors = {};
            this.name = "";
            this.label = "";
            this.description = "";
            this.table_1 = null;
            this.table_2 = null;

            if(id == 'many_to_many' & checked == true){
                this.selectedColumns = ['Many to many'];
                this.many_to_many = true
                this.getTablesList()
            }else{
                const indexOf = this.selectedColumns.indexOf('Many to many')
                if(indexOf != -1){
                    delete this.selectedColumns[indexOf]
                    this.many_to_many = false
                }

            }
        },
        //генерація ім"я таблиці 'Many to many'
        setManyToManyTableNameByConvention(){
            axios.post('/api/dbd/v1/getManyToManyTableNameByConvention',
                {
                    table_1: this.getTableNameById(this.table_1),
                    table_2: this.getTableNameById(this.table_2),
                })
                .then(response => {
                    this.name = response.data;
                })
                .catch(error => {

                })
            this.label = "many_to_many";
        },
        getTableNameById(id){
            var len = this.table_list.length;
            for (var i = 0; i < len; i++) {
                if(this.table_list[i].id == id){
                    return this.table_list[i].name;
                }

            }
        },
        setTableNameByConvention(){
            axios.post('/api/dbd/v1/getTableNameByConvention',
                {
                    name: this.name,
                })
                .then(response => {
                    this.name = response.data;
                })
                .catch(error => {

                })
        }

    }

}
</script>
