<script setup>

import Button from "primevue/button";
import {Form} from "@primevue/forms";
import Message from "primevue/message";
import Textarea from 'primevue/textarea';
import FloatLabel from 'primevue/floatlabel';
import Toast from "primevue/toast";
import { useToast } from 'primevue/usetoast';
</script>

<template>
    <form @submit.prevent="saveComponentCode">
        <div class="card">
            <div class="bg-white flex justify-center">
                <div class="flex justify-left pt-5 p-4">
                    <FloatLabel>
                        <Textarea id="import" v-model="import_" rows="5" cols="30" class="w-75"/>
                        <label for="import">Import</label>
                    </FloatLabel>
                    <Message v-if="errors.import" severity="error" variant="simple" size="small">{{ errors.import[0] }}</Message>
                </div>
                <div class="flex justify-left p-4">
                    <FloatLabel>
                        <Textarea id="html" v-model="html" rows="5" cols="30" class="w-75"/>
                        <label for="html">HTML</label>
                    </FloatLabel>
                    <Message v-if="errors.html" severity="error" variant="simple" size="small">{{ errors.html[0] }}</Message>
                </div>
                <div class="flex justify-left p-4">
                    <FloatLabel>
                        <Textarea id="data_" v-model="data_" rows="5" cols="30" class="w-75"/>
                        <label for="data_">Data</label>
                    </FloatLabel>
                    <Message v-if="errors.data_" severity="error" variant="simple" size="small">{{ errors.data_[0] }}</Message>
                </div>
                <div class="flex justify-left p-4">
                    <FloatLabel>
                        <Textarea id="script" v-model="script" rows="5" cols="30" class="w-75"/>
                        <label for="script">Script</label>
                    </FloatLabel>
                    <Message v-if="errors.script" severity="error" variant="simple" size="small">{{ errors.script[0] }}</Message>
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

export default {
    name: "Component-code",
    data(){
        return{
            import_: '',
            html: '',
            data_: '',
            script: '',
            parameters: '', // {"parameters":[{"name":"length", "type":"number", "default":"255"}]}

            errors: {
                import_: null,
                html: null,
            },
            toast: useToast(),
        }
    },
    mounted() {
        this.getComponent()
    },
    methods:{
        getComponent(){
            if(this.$route.params.id){
                axios.get('/api/component/' + this.$route.params.id)
                    .then(response => {
                        this.import_ = JSON.parse(response.data.component.details).import
                        this.html = response.data.component.html
                        this.data_ = JSON.parse(response.data.component.details).data
                        this.script = JSON.parse(response.data.component.details).script

                    })
                    .catch(error => {
                        this.$emit('login')
                    })
            }else{
                this.import_ = null
                this.code = null
            }
        },
        saveComponentCode(){
            this.errors = {}; // cleaning errors
            axios.put('/api/component/code/'+this.$route.params.id, {
                import: this.import_,
                html: this.html,
                data: this.data_,
                script: this.script,
            })
            .then(res => {
                if (res.response && res.response.status === 422) {// Handling Error 422 (Validation)
                    this.errors = res.response.data.errors
                }else{
                    this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Component updated', life: 3000 });
                }
            });
        },
    }
}

</script>

<style scoped>

</style>
