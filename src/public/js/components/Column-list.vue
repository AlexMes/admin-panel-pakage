<script setup>

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Checkbox from 'primevue/checkbox';
import CheckboxGroup from 'primevue/checkboxgroup';
import {ref} from "vue";
const checked = ref(true);
const dnChecked = ref(false);
</script>

<template>

    <div class="card bg-white p-3 mt-4">
        <DataTable :value="fieldList" tableStyle="min-width: 50rem">
            <template #header>
                <div class="text-left">
                    <Button @click="$router.push({path: '/adminpanel/create/field/' + $route.params.id})"><i class="pi pi-plus px-1"></i>NEW</Button>
                </div>
            </template>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable"></Column>
            <Column class="w-24 !text-end">
                <template #body="{ data }">
                    <Button icon="pi pi-search" @click="$router.push({path: '/adminpanel/field/'+data.id})" severity="secondary" rounded></Button>
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
            columns: null
        }
    },
    mounted() {
        this.getColumns()
    },
    watch: {
        '$route.path': {
            handler: 'getColumns',
            immediate: true // Запустить getTable при зменении id pTable
        }
    },
    methods: {
        getColumns() {
            this.columns = [
                { field: 'name', header: 'Name' },
                { field: 'type_name', header: 'Type' },
                { field: 'validation', header: 'Validation' },
                { field: 'component_name', header: 'Component' },
                { field: 'description', header: 'Description' },
                { field: 'status', header: 'Status' },
            ];

            if(this.$route.params.id){
                axios.get('/api/dbd/v1/columns/' + this.$route.params.id)
                    .then(response => {
                        this.fieldList = response.data.columns
                    })
                    .catch(error => {
                        this.$emit('login')
                    })
            }else{

            }
        }
    }
}
</script>

<style scoped>

</style>
