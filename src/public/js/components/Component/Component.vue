<script setup>

import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";

import { ref } from 'vue';
import TabPanel from "primevue/tabpanel";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanels from "primevue/tabpanels";
import Tabs from "primevue/tabs";
import ComponentDetails from "./Component-details.vue";
import ComponentCode from "./Component-code.vue";
</script>

<template>
    <div class="card bg-white p-3 p-6 m-6">
        <h2 v-if="$route.params.id">Edit Component</h2>
        <h2 v-else>New Component</h2>
        <label>Input base table information.</label>
    </div>
    <Tabs v-model:value="activePanel" class="mt-4">
        <TabList>
            <Tab value="Details">Details</Tab>
            <Tab v-if="$route.params.id" value="Code">Code</Tab>
        </TabList>
        <TabPanels>
            <TabPanel value="Details">
                <Component-details />
            </TabPanel>
            <TabPanel value="Code">
                <Component-code />
            </TabPanel>

        </TabPanels>
    </Tabs>
</template>

<script>
import {ref} from "vue";

export default {
    name: "Component",
    data() {
        return{
            confirm: useConfirm(),
            toast: useToast(),
            activePanel: ref('Code'), //id open AccordionPanel
        }
    },
    mounted() {
        this.getActivePanel()
    },
    watch: {

    },
    methods:{
        getActivePanel(){
            if(this.$route.params.id){
                this.activePanel = 'Code'
            }else{
                this.activePanel = 'Details'
            }
        },

    }

}
</script>

<style scoped>

</style>
