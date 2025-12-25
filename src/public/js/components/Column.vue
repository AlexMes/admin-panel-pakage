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
                            <Select id="type" v-model="type_id" :options="types" :disabled="$route.params.id" optionLabel="name" optionValue="id" class="md:w-56" />
                        </div>
                        <label for="type">Type</label>
                    </FloatLabel>
                    <Message v-if="errors.type_id" severity="error" variant="simple" size="small">{{ errors.type_id[0] }}</Message>
                </div>
                <div class="flex justify-left mt-4 p-4">
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
            name: null,
            description: null,
            status: null,
            types: [],
            type_id: null,
            validation: null,
            components: [],
            component_id: null,

            errors: {
                name: null,
                type_id: null,
            },
            toast: useToast(),
        }
    },
    mounted() {
        this.getTypes()
        this.getComponent()
        this.getField()
    },
    methods:{
        getTypes(){
            axios.get('/api/dbd/v1/types')
                .then(response => {
                    this.types = response.data;
                })
        },
        /*getTypeByID(id){
            let param = null
            this.types.forEach(type => {
                if(type.id === id){
                    param = JSON.parse(type.details).parameters
                }
            })
            return param
        },
        selectTypeChange() {
            this.parameters = this.getTypeByID(this.selectedType);

            console.log(JSON.stringify(this.parameters) , " - this.parameters.length - Change")
            if(JSON.stringify(this.parameters) !== undefined && JSON.stringify(this.parameters) !== null){
                if(this.parameters[0] && this.parameters[0].type === 'number') {this.parameters_0 = this.parameters[0]; this.parameters_val_0=this.parameters[0].default} else {this.parameters_val_0 = null; this.parameters_0 = null}
                if(this.parameters[1] && this.parameters[1].type === 'number') {this.parameters_1 = this.parameters[1]; this.parameters_val_1=this.parameters[1].default} else {this.parameters_val_1 = null; this.parameters_1 = null}
                if(this.parameters[2] && this.parameters[2].type === 'array')  {this.parameters_2 = this.parameters[2]; }                                                 else {this.parameters_val_2 = null; this.parameters_2 = null}
            }else{
                this.parameters_val_0 = null; this.parameters_0 = null
                this.parameters_val_1 = null; this.parameters_1 = null
                this.parameters_val_2 = null; this.parameters_2 = null
            }

        },*/
        getComponent(){
            axios.get('/api/dbd/v1/components')
                .then(response => {
                    this.components = response.data.components;
                })
        },

        getField(){
            if(this.$route.params.id){
                axios.get('/api/dbd/v1/column/'+this.$route.params.id)
                    .then(response => {
                        this.name = response.data.field.name;
                        this.type_id = response.data.field.type_id;
                        this.validation = response.data.field.validation;
                        this.component_id = response.data.field.component_id;
                        this.description = response.data.field.description;
                        this.status = response.data.field.status;
                    })
            }else{
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
            if(this.$route.params.id) {//Редактировать проэкт
                method = 'put'
                url = '/api/dbd/v1/column/'+this.$route.params.id
            }else{//Новый проэкт
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
                    validation: this.validation,
                    component_id: this.component_id,
                },
            })
            .then(res => {
                if (res.response && res.response.status === 422) {// Обработка ошибки 422 (валидации)
                    this.errors = res.response.data.errors
                }else{
                    this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Field updated', life: 2000 });
                    if(method === 'post'){
                        this.$router.push({path: '/adminpanel/field/'+res.data})
                    }


                }

            });
        },

    }
}
</script>

<style scoped>

</style>
