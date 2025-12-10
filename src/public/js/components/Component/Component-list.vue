<script setup>

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import 'primeicons/primeicons.css'
import Button from 'primevue/button';

</script>

<template>
    <div class="card bg-white p-3 p-6 m-6">
        <h2>Components</h2>
        <label>Components list.</label>
    </div>
    <div class="card bg-white p-3 mt-4">

        <DataTable :value="fieldList" tableStyle="min-width: 50rem">
            <template #header>
                <div class="text-left">
                    <Button class="pe-3" @click="$router.push({name: 'component.create'})"><i class="pi pi-plus px-1"></i>NEW</Button>
                </div>
            </template>
            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }} *****************************
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>
            </Column>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable"></Column>
            <Column class="w-24 !text-end">
                <template #body="{ data }">
                    <Button icon="pi pi-search" @click="selectRow(data)" severity="secondary" rounded></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
export default {
    name: "FieldList",
    data(){
        return{
            fieldList: null,
            columns: null,
        }
    },
    mounted() {
        this.getFields()
    },
    watch: {
    },
    methods: {
        getFields() {
            this.columns = [
                { field: 'name', header: 'Name', sortable: true },
                { field: 'description', header: 'Description' },
            ];
            axios.get('/api/components')
                .then(response => {
                    this.fieldList = response.data.components
                    console.log(response)
                })
        },
        selectRow(data){
            this.$router.push({path: '/component/'+data.id})
        }
    }
}
</script>

<style scoped>

</style>

