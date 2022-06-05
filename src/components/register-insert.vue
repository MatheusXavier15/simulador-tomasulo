<template>
  <div class="content-register">
      <select id="" v-model="content.operation" class="op-select">
          <option v-for="op in operations" :key="op" :value="op">{{op}}</option>
      </select>
      <input type="text" id="" v-model="content.firstRegister" class="register">
      <input type="text" id="" v-model="content.secondRegister" class="register">
      <input v-if="content.operation != 'MOV' && content.operation != 'LDR'" type="text" id="" v-model="content.thirdRegister" class="register">
  </div>
</template>

<script>
export default {
    data(){
        return {
            content: {                
                operation: '',
                firstRegister: '',
                secondRegister: '',
                thirdRegister: '',
            },
            operations: [ 
                "AND", "ADD", "SUB", "MUL", "CMP", "CMN", "BEQ", "ORR", "LDR", "MOV"
            ]
        }
    }
}
</script>

<style>
    .content-register{
        display: flex;
        justify-content: start;
        align-content: flex-start;
        gap: 10px;
        width: 400px;
    }
    .op-select {
        width: 70px;
    }

    .register {
        width: 20%;
    }
</style>