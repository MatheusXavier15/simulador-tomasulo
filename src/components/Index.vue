<template>
  <div class="content-all">
    <div style="display: flex">
      <div class="input-content">
        <label for="number-of-instructions" class="input-label"
          >Número de Instruções:
        </label>
        <input
          type="number"
          class="input-number"
          name="number-of-instructions"
          v-model="numberOfInstructions"
          id="number-of-instructions"
          :disabled="disable"
        />
      </div>
      <div class="input-content">
        <label for="number-of-instructions" class="input-label"
          >Carregar Exemplo:
        </label>
        <select id="" v-model="choosedExemple" class="op-select" @change="addMock" :disabled="numberOfInstructions > 0">
          <option v-for="n in mocks.length" :key="n" :value="n - 1">{{n}}</option>
         </select>
      </div>
    </div>
    <div class="options-content" v-if="Number(numberOfInstructions) > 0">
      <label for="registers" class="input-label">Instruções</label>
      <register-insert
        v-for="n in Number(numberOfInstructions)"
        id="registers"
        ref="operations"
        :key="n"
        :disabled="disable"
      />
    </div>
    <button
      @click="getAllOperations"
      v-if="Number(numberOfInstructions) > 0"
      class="confirm-btn"
    >
      Confirmar
    </button>

    <div class="table-content" v-if="operations">
      <table class="table">
        <tr class="tableRow">
          <thead class="tableHeader">
            Buffer de Reordenamento
          </thead>
        </tr>
        <tr class="tableRow">
          <th>Entrada</th>
          <th>Instrução</th>
          <th>Status</th>
          <th>Destino</th>
          <th>Valor</th>
        </tr>
        <tr
          class="tableRow"
          v-for="(operation, index) in operations.operations"
          :key="index"
        >
          <td>{{ index }}</td>
          <td>
            {{ operation.operation }}: {{ operation.firstRegister }},
            {{ operation.secondRegister }},
            {{
              operation.thirdRegister != undefined
                ? operation.thirdRegister
                : ""
            }}
          </td>
          <td>{{ operation.status == "initial" ? "" : operation.status }}</td>
          <td>{{ operation.destiny }}</td>
          <td>{{ operation.value }}</td>
        </tr>
        <tr class="tableRow">
          <thead class="tableHeader">
            Estação de Reserva
          </thead>
        </tr>
        <tr class="tableRow">
          <th>Nome</th>
          <th>Busy</th>
          <th>Op</th>
          <th>Vj</th>
          <th>Vk</th>
          <th>Qj</th>
          <th>Qk</th>
          <th>Dest</th>
          <th>A</th>
        </tr>
        <tr
          class="tableRow"
          v-for="(functionalUnit, index) in Object.values(
            operations.reserveStation
          )"
          :key="'Unit' + index"
        >
          <td>{{ functionalUnit.name }}</td>
          <td>{{ functionalUnit.busy }}</td>
          <td>{{ functionalUnit.Op }}</td>
          <td>{{ functionalUnit.Vj }}</td>
          <td>{{ functionalUnit.Vk }}</td>
          <td>{{ functionalUnit.Qj }}</td>
          <td>{{ functionalUnit.Qk }}</td>
          <td>{{ functionalUnit.Dest }}</td>
          <td>{{ functionalUnit.A }}</td>
        </tr>
        <tr class="tableRow">
          <thead class="tableHeader">
            Banco de Registradores
          </thead>
        </tr>
        <tr class="tableRow">
          <th
            v-for="(register, index) in operations.registers"
            :key="'R' + index"
          >
            R{{ index }}
          </th>
        </tr>
        <tr class="tableRow">
          <td
            v-for="(register, index) in operations.registers"
            :key="'R' + index"
          >
            {{ register.busy != "" ? register.busy : " " }}
          </td>
        </tr>
        <tr class="tableRow">
          <td
            v-for="(register, index) in operations.registers"
            :key="'R' + index"
          >
            {{ register.content != "" ? register.content : " " }}
          </td>
        </tr>
      </table>
      <div class="cycle-content">
        <div class="input-content">
          <label for="cycles" class="input-label">Próximo ciclo:</label>
          <button @click="handleExecCycle" class="cycle-btn">Avançar</button>
        </div>

        <div class="input-content">
          <label for="cycles" class="input-label">Número de Ciclos: </label>
          <input
            type="number"
            class="input-number"
            name="cycles"
            v-model="cycles"
            id="cycles"
            disabled
          />
        </div>
        <div class="input-content">
          <p>
            Atual ciclo: {{ actualStatus != "" ? actualStatus : "Inicial" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import registerInsert from "./register-insert.vue";
import mocks from "../mock";
import { Simulator } from "../simulador";
export default {
  components: { registerInsert },
  name: "IndexApp",
  props: {
    msg: String,
  },
  data() {
    return {
      mocks: [],
      operations: "",
      choosedExemple: "",
      numberOfInstructions: "",
      reserveUnits: [],
      disable: false,
      cycles: 0,
      cycleStatus: {
        initial: "",
        issue: "Despachado",
        execution: "Em execução",
        write: "Escrita",
        commit: "Commit",
      },
      actualStatus: "",
    };
  },
  mounted(){
    this.mocks = mocks
  },
  methods: {
    addMock() {
      this.cycles = 0
      this.actualStatus = ""
      this.disable = !this.disable;
      let mock = this.mocks[this.choosedExemple];
      this.operations = new Simulator(mock, false);
      let keys = Object.keys(this.operations.reserveStation);
      let values = Object.values(this.operations.reserveStation);
      for (let index = 0; index < keys.length; index++) {
        values[index].name = keys[index];
        this.reserveUnits.push(values[index]);
      }
    },
    getAllOperations() {
      this.cycles = 0
      this.actualStatus = ""
      this.disable = !this.disable;
      let ops = this.$refs.operations.map((e) => {
        return e.content;
      });
      this.operations = new Simulator(ops, false);
      let keys = Object.keys(this.operations.reserveStation);
      let values = Object.values(this.operations.reserveStation);
      for (let index = 0; index < keys.length; index++) {
        values[index].name = keys[index];
        this.reserveUnits.push(values[index]);
      }
    },
    handleExecCycle() {
      this.cycles++;
      switch (this.actualStatus) {
        case "":
          this.operations.issuesInstructions();
          this.actualStatus = this.cycleStatus.issue;
          return;
        case this.cycleStatus.commit:
          this.operations.issuesInstructions();
          this.actualStatus = this.cycleStatus.issue;
          return;
        case this.cycleStatus.issue:
          this.operations.execInstructions();
          this.actualStatus = this.cycleStatus.execution;
          return;
        case this.cycleStatus.execution:
          this.operations.writeInstructions();
          this.actualStatus = this.cycleStatus.write;
          return;
        case this.cycleStatus.write:
          this.operations.commitInstructions();
          this.actualStatus = this.cycleStatus.commit;
          return;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.content-all {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  gap: 10px;
}
.table-content {
  display: flex;
  flex-direction: row;
  gap: 50px;
}
.input-content {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  width: 200px;
  margin: 15px;
}
.input-label {
  width: 100%;
  text-align: left;
}
.input-number {
  width: 100px;
  height: 20px;
  border-radius: 5px;
  border: 1px solid lightblue;
  background: white;
  box-shadow: 2px 5px 5px 1px rgba(0, 0, 0, 0.25);
}
.confirm-btn {
  width: 100px;
  height: 30px;
  background: lightblue;
  border-radius: 5px;
  border: none;
  outline: none;
  margin: 15px;
}
.cycle-btn {
  width: 100px;
  height: 30px;
  background: white;
  border-radius: 5px;
  border: 2px solid lightblue;
  outline: none;
  margin: 15px 0px;
}
.options-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px;
}

.tableHeader {
  width: 100%;
  background-color: lightblue;
}

.tableRow {
  background-color: whitesmoke;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.table {
  width: 75%;
  border-collapse: collapse;
}
td,
table,
th {
  min-height: 20px;
  width: 100%;
  border: 1px black solid;
}
</style>
