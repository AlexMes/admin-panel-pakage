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
import Checkbox from 'primevue/checkbox';
import Fieldset from 'primevue/fieldset';
</script>

<template>
    <div class="card bg-white p-3 p-6 m-6">
    <h2 v-if="$route.params.id">Edit Field</h2>
    <h2 v-else>New Field</h2>
    <label>Input base information.</label>
    </div>
    <Toast />
    <form class="mt-4">
        <div class="card">
            <div class="bg-white flex justify-center">
<!--                <div class="row pt-4 ms-2 me-2">-->
                <div class="row pt-4 ms-2 me-2">
<!--                    <div class="col-6">-->
                    <div class="col-md-6">
                        <Fieldset legend="Migration"  :toggleable="true" class="mb-3">
                            <div class="p-3">
                                <FloatLabel>
                                    <div class="card flex justify-center">
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
                            </div><!--Type-->
                            <div class="row">
                                <div class="col-6">
                                    <div  v-if="foreign_key" class="p-3">
                                        <FloatLabel>
                                            <div class="card flex justify-center">
                                                <Select @change="getColumnList(this.foreign_key_table_id)" v-model="foreign_key_table_id" :options="table_list" :disabled="$route.params.id" optionLabel="name" optionValue="id" class="md:w-56" />
                                            </div>
                                            <label for="type">Select a table</label>
                                        </FloatLabel>
                                        <Message v-if="errors.foreign_key_table_id" severity="error" variant="simple" size="small">{{ errors.foreign_key_table_id[0] }}</Message>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div  v-if="foreign_key" class="p-3">
                                        <FloatLabel>
                                            <div class="card flex justify-center">
                                                <Select @change="setForeignKeyValues()" v-model="foreign_key_column_id" :options="column_list" :disabled="$route.params.id" optionLabel="name" optionValue="id" class="md:w-56" />
                                            </div>
                                            <label for="type">Select a column</label>
                                        </FloatLabel>
                                        <Message v-if="errors.foreign_key_column_id" severity="error" variant="simple" size="small">{{ errors.foreign_key_column_id[0] }}</Message>
                                    </div>
                                </div><!--Select a column-->
                            </div>
                            <div class="p-3">
                                <FloatLabel >
                                    <InputText @change="setValues()" id="name" v-model="name" :disabled="$route.params.id" aria-describedby="name-help" class="w-100"/>
                                    <label for="name">Name</label>
                                </FloatLabel>
                                <Message v-if="errors.name" severity="error" variant="simple" size="small">{{ errors.name[0] }}</Message>
                            </div><!--Name-->
                            <div class="p-3">
                                <FloatLabel >
                                    <InputText id="default" v-model="default_val" class="w-100"/>
                                    <label for="default">Default value</label>
                                </FloatLabel>
                                <Message v-if="errors.default" severity="error" variant="simple" size="small">{{ errors.default[0] }}</Message>
                            </div><!--Default value-->
                            <div  v-if="param_1_show" class="p-3">
                                <div class="row">
                                    <div class="col-6">
                                        <FloatLabel>
                                            <div class="card flex justify-center">
                                                <InputText id="param_1" v-model="param_1" aria-describedby="name-help" class="w-100"/>
                                            </div>
                                            <label for="param_1">{{ param_1_name }}</label>
                                        </FloatLabel>
                                        <Message v-if="errors.param_1" severity="error" variant="simple" size="small">{{ errors.param_1[0] }}</Message>
                                        <label v-else>{{ param_1_description }}</label>
                                    </div>
                                    <div v-if="param_2_show" class="col-6">
                                        <FloatLabel>
                                            <div class="card flex justify-center">
                                                <InputText id="param_2" v-model="param_2" aria-describedby="name-help" class="w-100"/>
                                            </div>
                                            <label for="param_2">{{ param_2_name }}</label>
                                        </FloatLabel>
                                        <Message v-if="errors.param_2" severity="error" variant="simple" size="small">{{ errors.param_2[0] }}</Message>
                                        <label v-else>{{ param_2_description }}</label>
                                    </div>
                                </div>
                            </div>
                            <div class="flex p-3 row">
                                <div class="col-5">
                                    <div class="mb-3">
                                        <Checkbox  v-model="modifier" inputId="nullable" name="nullable" value="nullable" />
                                        <label for="nullable" class="ms-2"> nullable </label>
                                    </div>
                                    <div class="mb-3">
                                        <Checkbox  v-model="modifier" inputId="unique" name="unique" value="unique" />
                                        <label for="unique" class="ms-2"> unique </label>
                                    </div>
                                    <div class="mb-3">
                                        <Checkbox  v-model="modifier" inputId="unsigned" name="unsigned" value="unsigned" />
                                        <label for="unsigned" class="ms-2"> unsigned </label>
                                    </div>
                                </div>
                                <div class="col-7">
                                    <div class="mb-3">
                                        <Checkbox  v-model="modifier" inputId="useCurrent" name="useCurrent" value="useCurrent" />
                                        <label for="useCurrent" class="ms-2"> useCurrent </label>
                                    </div>
                                    <div class="mb-3">
                                        <Checkbox  v-model="modifier" inputId="useCurrentOnUpdate" name="useCurrentOnUpdate" value="useCurrentOnUpdate" />
                                        <label for="useCurrentOnUpdate" class="ms-2"> useCurrentOnUpdate </label>
                                    </div>
                                </div>
                            </div>
                        </Fieldset>
                        <Fieldset legend="Frontend"  :toggleable="true" class="mb-3">
                            <div class="p-3">
                                <FloatLabel >
                                    <InputText id="label" v-model="label" class="w-100"/>
                                    <label for="label">Label</label>
                                </FloatLabel>
                                <Message v-if="errors.label" severity="error" variant="simple" size="small">{{ errors.label[0] }}</Message>
                            </div>
                            <div class="p-3">
                                <FloatLabel>
                                    <Textarea id="description" v-model="description" rows="2" class="w-100"/>
                                    <label for="description">Description</label>
                                </FloatLabel>
                                <Message v-if="errors.description" severity="error" variant="simple" size="small">{{errors.description[0]}}</Message>
                            </div>
                            <div class="p-3">
                                <FloatLabel>
                                    <Select id="cmnt" v-model="component_id" :options="components" optionLabel="name" optionValue="id" class="w-100" />
                                    <label for="cmnt">Component</label>
                                </FloatLabel>
                                <Message v-if="errors.component_id" severity="error" variant="simple" size="small">{{ errors.component_id[0] }}</Message>
                            </div>
                        </Fieldset>
                    </div>
<!--                    <div class="col-6">-->
                    <div class="col-md-6">
                        <Fieldset legend="Model"  :toggleable="true" class="mb-3">
                            <div class="mb-3 ps-3">
                                <Checkbox  v-model="fillable" inputId="fillable" name="fillable" value="fillable" :binary="true"/>
                                <label for="fillable" class="ms-2"> $fillable - The attributes that are mass assignable.</label>
                            </div>
                            <div class="mb-3 ps-3">
                                <Checkbox  v-model="hidden" inputId="hidden" name="hidden" value="hidden" :binary="true"/>
                                <label for="hidden" class="ms-2"> $hidden - The attributes that should be hidden for serialization.</label>
                            </div>
                            <div class="p-3">
                                <FloatLabel >
                                    <InputText id="casts" v-model="casts" class="w-100"/>
                                    <label for="casts">casts():</label>
                                </FloatLabel>
                                <Message v-if="errors.casts" severity="error" variant="simple" size="small">{{ errors.casts[0] }}</Message>
                                <label v-else >'array';'datetime';'hashed'...</label>
                            </div>

                            <div  v-if="foreign_key">
                                <div class="p-3">
                                    <FloatLabel >
                                        <InputText id="hasOneName" v-model="hasOneName" class="w-100"/>
                                        <label for="hasOneName">hasOne function name</label>
                                    </FloatLabel>
                                    <Message v-if="errors.hasOneName" severity="error" variant="simple" size="small">{{ errors.hasOneName[0] }}</Message>
                                    <label v-else >public function {{ hasOneName }}(): hasOne</label>
                                </div>
                                <div class="p-3">
                                    <FloatLabel >
                                        <InputText id="hasManyName" v-model="hasManyName" class="w-100"/>
                                        <label for="hasManyName">hasMany function name</label>
                                    </FloatLabel>
                                    <Message v-if="errors.hasManyName" severity="error" variant="simple" size="small">{{ errors.hasManyName[0] }}</Message>
                                    <label v-else >public function {{ hasManyName }}(): hasMany</label>
                                </div>
                            </div>


                        </Fieldset>
                        <Fieldset legend="Other"  :toggleable="true" class="mb-3">
                            <div class="p-3">
                                <FloatLabel >
                                    <InputText id="validation" v-model="validation" aria-describedby="name-help" class="w-100"/>
                                    <label for="validation">Validation</label>
                                </FloatLabel>
                                <Message v-if="errors.validation" severity="error" variant="simple" size="small">{{ errors.validation[0] }}</Message>
                                <label v-else >'required', 'string', 'min:3'...</label>
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </div>
            <div class="bg-zinc-200">
                <div class="p-3 text-right">
                    <Button type="button" @click="save" id="saveAndGenerate" class="ms-3">Save & Generate</Button>
                    <Button type="button" @click="save" id="save" class="ms-3">Save</Button>
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
            table_name: null,
            name: null,
            label: null,
            modifier: null,
            default_val: null,
            fillable: true,
            hidden: false,
            casts: null,
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
            hasOneName: null,
            hasManyName: null,

            foreign_key_table_id: null,
            foreign_key_column_id: null,
            param_1_show: null,
            param_1_name: null,
            param_1_description: null,
            param_1: null,
            param_2_show: null,
            param_2_name: null,
            param_2_description: null,
            param_2: null,
            /*enum_show: null,
            enum: null,*/
            table_list: [],
            column_list: [],

            column_type: null,

        }
    },
    mounted() {
        this.getTypes()
        this.getComponents()
        this.getColumn()
        this.getTableList()
    },
    watch: {

    },
    methods:{
        getTypes(){
            axios.get('/api/dbd/v1/types')
                .then(response => {
                    this.types = response.data;
                })
        },
        getType(id){
            var group_len = this.types.length;
            for (var g = 0; g < group_len; g++) {
                var len = this.types[g]['items'].length;
                for (var i = 0; i < len; i++) {
                    if (this.types[g]['items'][i].id == id) {
                       if (typeof(this.types[g]['items'][i].param_1) !== 'object' && this.types[g]['items'][i].param_1 !== null) {
                            this.types[g]['items'][i].param_1 = JSON.parse(this.types[g]['items'][i].param_1)
                        }
                        if (typeof(this.types[g]['items'][i].param_2) !== 'object' && this.types[g]['items'][i].param_2 !== null) {
                            this.types[g]['items'][i].param_2 = JSON.parse(this.types[g]['items'][i].param_2)
                        }
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

        //edit column
        getColumn(){
            if(this.$route.params.id){
                axios.get('/api/dbd/v1/column/'+this.$route.params.id)
                    .then(response => {
                        this.table_id = response.data.field.table_id;
                        this.name = response.data.field.name;
                        this.type_id = response.data.field.type_id;
                        this.modifier = response.data.field.details.modifier;
                        this.default_val = response.data.field.details.default_val;
                        this.validation = response.data.field.validation;
                        this.component_id = response.data.field.component_id;
                        this.label = response.data.field.label;
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

        save(e){
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
                    label: this.label,
                    description: this.description,
                    table_id: this.$route.params.table_id,
                    type_id: this.type_id,
                    param_1: this.param_1,
                    param_2: this.param_2,
                    foreign_key_table_id: this.foreign_key_table_id,
                    foreign_key_table_name: this.getTableName(this.foreign_key_table_id),
                    local_key: this.foreign_key_column_id,
                    local_key_name: this.getColunmName(this.foreign_key_column_id),
                    hasOneName: this.hasOneName,
                    hasManyName: this.hasManyName,

                    validation: this.validation,
                    component_id: this.component_id,

                    modifier: this.modifier,
                    default_val: this.default_val,
                    fillable: this.fillable,
                    hidden: this.hidden,
                    casts: this.casts,
                },
            })
            .then(res => {
                this.$store.commit('updateMenu')
                if (res.response && res.response.status === 422) {// Обработка ошибки 422 (валидации)
                    this.errors = res.response.data.errors
                }else{
                    this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Field updated', life: 2000 });
                    //Запрос на генерацию
                    if(e.target.id == 'saveAndGenerate'){
                        this.codeGen(this.table_id)
                    }
                    this.$router.push({path: '/adminpanel/table/'+this.table_id})
                }

            });
        },
        codeGen(id){
            axios.get(this.local_hostname+'/codegen/'+id)
                .then(response => {
                    //console.log("CodeGen OK!");
                })
                .catch(error => {
                    //console.log("CodeGen Error!");
                })

        },

        columnTypeCheck(){
            this.column_type = this.getType(this.type_id);
            this.param_1_show = false;
            this.param_2_show = false;
            this.foreign_key_table_id = null;
            this.foreign_key_column_id = null;
            this.hasOneName = null;
            this.hasManyName = null;
            this.validation = null;
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
                    this.casts = null;
                    this.name = null;
                    this.validation = null;
                    this.setForeignKeyValues();
                    break;
                case "enum":
                case "set":
                    this.setEnumValues()
                    break;
            }
        },

        getTableList(){
            axios.get('/api/dbd/v1/tables/table-list/'+localStorage.getItem('project'))
                .then(r => {
                    if(r.data){
                        this.table_list = r.data.tables
                        var len = this.table_list.length;
                        for (var i = 0; i < len; i++) {
                            if(this.table_list[i].id == this.$route.params.table_id){
                                this.table_name = this.table_list[i++]["name"];
                                //this.table_list.splice(i, 1)
                            }
                        }
                    }
                })
        },
        getColumnList(ForeignKeyTableId){
            axios.get('/api/dbd/v1/tables/column-list/'+ForeignKeyTableId)
                .then(r => {
                    if(r.data){
                        this.column_list = r.data
                        var len = this.column_list.length;
                        for (var i = 0; i < len; i++) {
                            if(this.column_list[i]["name"] == "id"){
                                this.foreign_key_column_id = this.column_list[i]["id"];
                                this.setForeignKeyValues()
                            }
                        }
                    }
                })
        },

        setValues(){
            switch (this.type_id) {
                case "foreignKey":
                case "foreignId":
                case "foreignUlid":
                case "foreignUuid":
                case "foreignIdFor":
                case "morphs":
                case "nullableMorphs":
                    this.setForeignKeyFunctionName();
                    break;
                case "enum":
                case "set":
                    this.setEnumValues()
                    break;
            }
        },
        setEnumValues() {
            this.casts = this.ucFirst(this.table_name)+this.ucFirst(this.name)+"Enum::class";
            this.validation = "'required', 'string', Rule::in(array_column(\\App\\Enums\\"+this.ucFirst(this.table_name)+this.ucFirst(this.name)+"Enum"+"::cases(), 'value'))";
        },
        setForeignKeyValues() {
            this.setForeignKeyName()
            this.setForeignKeyValidation()
            //this.setForeignKeyFunctionName()
        },
        setForeignKeyValidation(){
            this.validation = "'required', 'exists:"+this.getTableName(this.foreign_key_table_id)+","+this.getColunmName(this.foreign_key_column_id)+"'";
        },
        setForeignKeyName(){
            let foreign_key_table_name = this.getTableName(this.foreign_key_table_id)
            let foreign_key_column_id = this.getColunmName(this.foreign_key_column_id)
            if (foreign_key_table_name != undefined){
                if (foreign_key_table_name.endsWith('s')) {
                    foreign_key_table_name = foreign_key_table_name.slice(0, -1)
                }
            }
            this.name = foreign_key_table_name+"_"+foreign_key_column_id
            this.hasOneName= foreign_key_table_name
            this.hasManyName= this.table_name
            this.setForeignKeyFunctionName()
            /*this.getTableList(this.foreign_key_table_id)
            this.getColumnList(this.foreign_key_table_id);*/
        },
        setForeignKeyFunctionName(){
            if (this.name != null){
                this.hasOneName= this.name
                this.hasManyName= this.name
                    if (this.name.endsWith('_id')) {
                        this.hasOneName= this.name.slice(0, -3)
                        this.hasManyName= this.name.slice(0, -3)
                    }
                if(this.hasManyName != null){
                    this.hasManyName= this.hasManyName+'s'
                }
            }
        },



        getTableName(id){
            var len = this.table_list.length;
            for (var i = 0; i < len; i++) {
                if(this.table_list[i].id == id){
                    return this.table_list[i].name;
                }

            }
        },
        getColunmName(id){
            var len = this.column_list.length;
            for (var i = 0; i < len; i++) {
                if(this.column_list[i].id == id){
                    return this.column_list[i].name;
                }

            }
        },
        ucFirst(str) {
            if (!str) return str; // Проверка на пустую строку или null
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

    }
}
</script>

<style scoped>

</style>
