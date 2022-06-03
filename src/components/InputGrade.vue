<script setup>
import {ref} from 'vue'
defineProps({
 listForInput:{type:Array, require:true},
 disIn:{type:Boolean, require:true}
})


</script>

<template>
    <div>
        <div v-for="(listInput,index) in listForInput" :key="index">
            วิชา: <input :disabled="disIn" type="text"  v-model="listInput.subject" placeholder="INT555:How to be hacker">&nbsp;
            เกรด: <select :disabled="disIn" v-model="listInput.grade"  >
                  <option value="" disabled selected>grade</option>
                  <option value="4" >A</option>
                  <option value="3.5" >B+</option>
                  <option value="3" >B</option>
                  <option value="2.5" >C+</option>
                  <option value="2" >C</option>
                  <option value="1.5" >D+</option>
                  <option value="1" >D</option>
                  <option value="0" >F</option>
              </select>&nbsp;
            หน่วยกิต: <input :disabled="disIn" v-model="listInput.credit"  type="number" min="1" step="0.5" max="5"> <br><br>
        </div>
    </div>
</template>
