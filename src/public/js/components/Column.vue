<script setup>

import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import Message from "primevue/message";
import {Form} from "@primevue/forms";
import Textarea from "primevue/textarea";
import Select from 'primevue/select';
import Toast from "primevue/toast";
import { useToast } from 'primevue/usetoast';
import InputText from "primevue/inputtext";
import Tabs from "primevue/tabs";
</script>

<template>
    <div class="card bg-white p-3 p-6 m-6">
    <h2 v-if="$route.params.id">Edit Field</h2>
    <h2 v-else>New Field</h2>
    <label>Input base information.</label>
    </div>
    <Toast />
    <form @submit.prevent="saveField" class="mt-4">
        <div class="card">
            <div class="bg-white flex justify-center">

                <div class="flex justify-left mt-4 p-4">
                    <FloatLabel class="">
                        <InputText id="name" v-model="name" :disabled="$route.params.id" aria-describedby="name-help" class="w-75"/>
                        <label for="name">Name</label>
                    </FloatLabel>
                    <Message v-if="errors.name" severity="error" variant="simple" size="small">{{ errors.name[0] }}</Message>
                    <label v-else >Name for DB migration</label>
                </div>
                <div class="flex justify-left p-4">
                    <FloatLabel>
                        <div class="card flex justify-center w-75">
                            <Select @change="columnTypeCheck()"
                                    filter v-model="type_id" :options="types" :disabled="$route.params.id"
                                    optionLabel="name" optionValue="id"
                                    optionGroupLabel="label" optionGroupChildren="items"
                                    class="md:w-56" />
                        </div>
                        <label for="type">Type</label>
                    </FloatLabel>
                    <Message v-if="errors.type_id" severity="error" variant="simple" size="small">{{ errors.type_id[0] }}</Message>
                    <label v-else >{{ type_description }}</label>
                </div>
                <div  v-if="foreign_key" class="flex justify-left p-4">
                    <FloatLabel>
                        <div class="card flex justify-center w-75">
                            <Select @change="setName()" v-model="foreign_key_table_id" :options="data_tables" :disabled="$route.params.id" optionLabel="name" optionValue="id" class="md:w-56" />
                        </div>
                        <label for="type">Select a table</label>
                    </FloatLabel>
                    <Message v-if="errors.foreign_key_table_id" severity="error" variant="simple" size="small">{{ errors.foreign_key_table_id[0] }}</Message>
                </div>
                <div  v-if="param_1_show" class="flex justify-left p-4">
                    <div class="row  w-75">
                        <div class="col-6">
                            <FloatLabel>
                                <div class="card flex justify-center w-75">
                                    <InputText id="param_1" v-model="param_1" aria-describedby="name-help" class="75"/>
                                </div>
                                <label for="param_1">{{ param_1_name }}</label>
                            </FloatLabel>
                            <Message v-if="errors.param_1" severity="error" variant="simple" size="small">{{ errors.param_1[0] }}</Message>
                            <label v-else>{{ param_1_description }}</label>
                        </div>
                        <div v-if="param_2_show" class="col-6">
                            <FloatLabel>
                                <div class="card flex justify-center w-75">
                                    <InputText id="param_2" v-model="param_2" aria-describedby="name-help" class="75"/>
                                </div>
                                <label for="param_2">{{ param_2_name }}</label>
                            </FloatLabel>
                            <Message v-if="errors.param_2" severity="error" variant="simple" size="small">{{ errors.param_2[0] }}</Message>
                            <label v-else>{{ param_2_description }}</label>
                        </div>
                    </div>

                </div>
                <div class="flex justify-left p-4">
                    <FloatLabel class="">
                        <InputText id="validation" v-model="validation" aria-describedby="name-help" class="w-75"/>
                        <label for="validation">Validation</label>
                    </FloatLabel>
                    <Message v-if="errors.validation" severity="error" variant="simple" size="small">{{ errors.validation[0] }}</Message>
                    <label v-else >'required', 'string', 'min:3'...</label>
                </div>
                <div class="flex justify-left p-4">
                    <FloatLabel>
                        <div class="card flex justify-center w-75">
                            <Select id="cmnt" v-model="component_id" :options="components" optionLabel="name" optionValue="id" class="md:w-56" />
                        </div>
                        <label for="cmnt">Component</label>
                    </FloatLabel>
                    <Message v-if="errors.component_id" severity="error" variant="simple" size="small">{{ errors.component_id[0] }}</Message>
                </div>
                <div class="flex justify-left pb-5 p-4">
                    <FloatLabel>
                        <Textarea  id="description" v-model="description" rows="5" cols="30" class="w-75"/>
                        <label for="description">Description</label>
                    </FloatLabel>
                    <Message v-if="errors.description" severity="error" variant="simple" size="small">{{errors.description[0]}}</Message>
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
import toast from "bootstrap/js/src/toast.js";

export default {
    name: "Component-code",
    data(){
        return{
            table_id: null,
            name: null,
            description: null,
            status: null,
            types: [],
            type_id: null,
            type_description: null,
            validation: null,
            components: [],
            component_id: null,

            errors: {
                name: null,
                type_id: null,
            },
            toast: useToast(),
            local_hostname: window.location.protocol+'//'+window.location.hostname,

            foreign_key: null,
            foreign_key_table_id: null,
            param_1_show: null,
            param_1_name: null,
            param_1_description: null,
            param_1: null,
            param_2_show: null,
            param_2_name: null,
            param_2_description: null,
            param_2: null,
            enum_show: null,
            enum: null,
            data_tables: [],

            column_type: null,

        }
    },
    mounted() {
        this.getTypes()
        this.getComponents()
        this.getColumn()
        this.getDtaTables()
    },
    methods:{
        getTypes(){
            axios.get('/api/dbd/v1/types')
                .then(response => {
                    console.log(response)
                    this.types = response.data;
                })
        },
        getType(id){
            var group_len = this.types.length;
            for (var g = 0; g < group_len; g++) {
                console.log(this.types[g]['items'])
                var len = this.types[g]['items'].length;
                for (var i = 0; i < len; i++) {
                    if (this.types[g]['items'][i].id == id) {
                        this.types[g]['items'][i].param_1 = JSON.parse(this.types[g]['items'][i].param_1)
                        this.types[g]['items'][i].param_2 = JSON.parse(this.types[g]['items'][i].param_2)
                        return this.types[g]['items'][i];
                    }
                }
            }
        },

        getComponents(){
            axios.get('/api/dbd/v1/components')
                .then(response => {
                    this.components = response.data.components;
                })
        },

        getColumn(){
            if(this.$route.params.id){
                axios.get('/api/dbd/v1/column/'+this.$route.params.id)
                    .then(response => {
                        this.table_id = response.data.field.table_id;
                        this.name = response.data.field.name;
                        this.type_id = response.data.field.type_id;
                        this.validation = response.data.field.validation;
                        this.component_id = response.data.field.component_id;
                        this.description = response.data.field.description;
                        this.status = response.data.field.status;
                    })
            }else{
                this.table_id = this.$route.params.table_id;
                this.name = null;
                this.type_id = null;
                this.component_id = null;
                this.description = null;
            }
        },

        saveField(){
            this.errors = {}; // Очистка ошибок
            let method;
            let url;
            if(this.$route.params.id) {//Редактировать
                method = 'put'
                url = '/api/dbd/v1/column/'+this.$route.params.id
            }else{//Новый
                method = 'post'
                url = '/api/dbd/v1/column/'+this.$route.params.table_id
            }
            axios({
                method: method,
                url: url,
                data: {
                    name: this.name,
                    description: this.description,
                    table_id: this.$route.params.table_id,
                    type_id: this.type_id,
                    param_1: this.param_1,
                    param_2: this.param_2,
                    foreign_key_table_id: this.foreign_key_table_id,
                    foreign_key_table_name: this.getName(this.foreign_key_table_id),
                    validation: this.validation,
                    component_id: this.component_id,
                },
            })
            .then(res => {
                if (res.response && res.response.status === 422) {// Обработка ошибки 422 (валидации)
                    this.errors = res.response.data.errors
                }else{
                    this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Field updated', life: 2000 });
                    //Запрос на генерацию
                    this.codeGen(this.table_id)
                    this.$router.push({path: '/adminpanel/table/'+this.table_id})
                }

            });
        },
        codeGen(id){
            axios.get(this.local_hostname+'/codegen/'+id)
                .then(response => {
                    console.log("CodeGen OK!");
                })
                .catch(error => {
                    console.log("CodeGen Error!");
                })

        },

        getDtaTables(){
            axios.get('/api/dbd/v1/tables/data-tables-list/23')
                .then(r => {
                    if(r.data){
                        this.data_tables = r.data.tables
                        console.log(this.data_tables);
                    }
                })
        },
        columnTypeCheck(){
            this.column_type = this.getType(this.type_id);

            console.log("-------------------")
            console.log(this.column_type)
            console.log(this.column_type.param_1)
            console.log(this.column_type.param_2)
            console.log("-------------------")

            this.param_1_show = false;
            this.param_2_show = false;
            this.foreign_key = false;//Show select table

            this.type_description = this.column_type.description;

            if(this.column_type.param_1 !== null){
                this.param_1_show = true;
                this.param_1 = this.column_type.param_1.value;
                this.param_1_name = this.column_type.param_1.name;
                this.param_1_description = this.column_type.param_1.description;
            }
            if(this.column_type.param_2 !== null){
                this.param_2_show = true;
                this.param_2 = this.column_type.param_2.value;
                this.param_2_name = this.column_type.param_2.name;
                this.param_2_description = this.column_type.param_2.description;
            }


            switch (this.type_id) {//Show select table
                case "foreignKey":
                case "foreignId":
                case "foreignUlid":
                case "foreignUuid":
                case "foreignIdFor":
                case "morphs":
                case "nullableMorphs":
                    this.foreign_key = true;
                    break;
            }
        },
        setName(){
            let foreign_key_table_name = this.getName(this.foreign_key_table_id)
            this.name = foreign_key_table_name+'_id';
        },
        getName(id){
            var len = this.data_tables.length;
            for (var i = 0; i < len; i++) {
                if(this.data_tables[i].id == id){
                    return this.data_tables[i].name;
                }

            }
        }

    }
}
</script>

<style scoped>

</style>
