<template>
  <div class="content-register">
      <select id="" v-model="content.operation" class="op-select" :disabled="disabled">
          <option v-for="op in operations" :key="op" :value="op">{{op}}</option>
      </select>
      <input type="text" id="" v-model="content.firstRegister" class="register" :disabled="disabled">
      <input type="text" id="" v-model="content.secondRegister" class="register" :disabled="disabled">
      <input v-if="content.operation != 'MOV' && content.operation != 'LDR'" type="text" id="" v-model="content.thirdRegister" class="register" :disabled="disabled">
        <select  v-if="content.operation == 'BEQ'" v-model="content.fourthRegister" id="" class="op-select" :disabled="disabled">
          <option :value="true">Desvia</option>
          <option :value="false">Não Desvia</option>
      </select>
  </div>
</template>

<script>
export default {
    props:{
        disabled: Boolean
    },
    data(){
        return {
            content: {                
                operation: '',
                firstRegister: '',
                secondRegister: '',
                thirdRegister: '',
                fourthRegister: ''
            },
            operations: [ 
                "AND", "ADD", "SUB", "MUL", "CMP", "CMN", "BEQ", "ORR", "LDR", "MOV"
            ]
        }
    },
    methods: {
        getOperation(){
            return this.content
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
        margin: 0px 0px 5px 0px;
    }
    .op-select {
        width: 100px;
        border-radius: 5px;
        border: 1px solid lightblue;
        background: white;
        box-shadow: 2px 5px 5px 1px rgba(0,0,0,0.25);
    }

    .register {
        width: 20%;
        height: 20px;
        border-radius: 5px;
        border: 1px solid lightblue;
        background: white;
        box-shadow: 2px 5px 5px 1px rgba(0,0,0,0.25);
    }

</style>