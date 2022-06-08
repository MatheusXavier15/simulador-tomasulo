export class Simulator {

    // Initial
    // Despachado
    // Em exec
    // Commit
    // Escrito

    constructor(operations, fullSimulation) {
        this.fullSimulation = fullSimulation
        this.status = {
            initial: "",
            issue: "Despachado",
            execution: "Em execução",
            write: "Escrita",
            commit: "Commit"
        }
        this.amount = 3
        this.initialState = {
            busy: false, 
            Op: "",
            Vj:"",
            Vk:"",
            Qj:"",
            Qk: "",
            Dest:"",
            A:"",
        }

        this.reserveStation = {
            Add1: { ...this.initialState },
            Add2: { ...this.initialState },
            Add3: { ...this.initialState },
            Load1: { ...this.initialState },
            Load2: { ...this.initialState },
            Mult1: { ...this.initialState },
            Mult2: { ...this.initialState },
        }

        this.operations = operations

        this.estadoInstrucoes = [];
        this.operations.forEach((operation) => {
            operation.status = this.status.initial
            operation.destiny = operation.firstRegister
            operation.value = ""
            operation.finished = false
        })

        this.verifyDependencies()

        this.registers = Array.apply(null, {length: 32}).map(Function.call, () => { return {busy: false, content: ""}})
    }

    verifyDependencies(){
        for (let i = 0; i < this.operations.length; i++) {
            this.operations[i].dependencies = new Set()
            for (let j = 0; j < i; j++) {
                if (!this.operations[i].finished) {
                    if (!this.operations[j].finished && (this.operations[i].secondRegister == this.operations[j].firstRegister || this.operations[i]?.thirdRegister == this.operations[j].firstRegister)) {
                        this.operations[i].dependencies.add(this.operations[j].firstRegister)
                    }
                    if (!this.operations[j].finished && this.operations[j].operation == "BEQ") {
                        const [, amount] = this.operations[j].thirdRegister.split("#")
                        i - j <= amount && this.operations[i].dependencies.add("BEQ")
                    }
                }
            }
        }
    }

    issuesInstructions(){
        this.operations.forEach((operation) => {
            if (operation.status == this.status.initial) {   
                let functionalStation = this.verificaUFInstrucao(operation.operation)
                if (this.FunctionalUnitAllocation(functionalStation, operation)) {
                    operation.status = this.status.issue
                }
            }
        })
        this.fullSimulation && this.execInstructions()
    }

    execInstructions(){
        this.verifyDependencies()
        this.operations.forEach((operation) => {
            if (operation.status == this.status.issue && operation.dependencies.size == 0) {
                if (operation.operation == "BEQ" && operation?.fourthRegister) {
                    const [, amount] = operation.thirdRegister.split("#")
                    this.makeBEQ(operation, amount)
                    let functionalStation = this.verificaUFInstrucao(operation.operation)
                    this.FunctionalUnitDesallocation(functionalStation, operation)
                    this.verifyDependencies()
                } else if(operation.operation == "BEQ") {
                    let index = this.operations.findIndex((op) => {
                        return op == operation
                    })
                    operation.finished = true
                    this.verifyDependencies()
                    let functionalStation = this.verificaUFInstrucao(operation.operation)
                    this.FunctionalUnitDesallocation(functionalStation, operation)
                    this.operations.splice(index, 1)
                }
    
                operation.status = this.status.execution
            }
        })
        this.fullSimulation && this.writeInstructions()
    }

    commitInstructions(){
        this.operations.forEach((operation, index) => {
            if (operation.status == this.status.write) {
                operation.status = this.status.commit
                operation.finished = true
                let functionalStation = this.verificaUFInstrucao(operation.operation)
                this.FunctionalUnitDesallocation(functionalStation, operation)
                const [, register] = operation.firstRegister.split("R")
                this.registers[register].busy = true
                this.registers[register].content = "#"+index
                if (operation != 'LDR' && operation != 'MOV') {
                    operation.value = operation.secondRegister + " + " + operation.secondRegister
                } else {
                    operation.value = `${operation.secondRegister} -> #${index}`
                }
            }
        })
        this.verifyDependencies()
        this.fullSimulation && this.issuesInstructions()
    }

    writeInstructions(){
        this.operations.forEach((operation) => {
            if (operation.status == this.status.execution) {
                operation.status = this.status.write
            }
        })
        this.fullSimulation && this.commitInstructions()
    }

    execCycle(func){
        func.apply()
    }

    verificaUFInstrucao(instrucao) {
        const MapUFI = {
            ADD: "Add",
            AND: "Add",
            SUB: "Add",
            CMP: "Add",
            CMN: "Add",
            BEQ: "Add",
            ORR: "Add",
            MUL: "Mult",
            MOV: "Load",
            LDR: "Load",
        };
        return MapUFI[instrucao];
    }

    FunctionalUnitAllocation(functionalUnit, operation){
        let allocated = false
        let UFs = Object.keys(this.reserveStation)
        switch (functionalUnit) {
            case "Add":
                UFs.forEach((uf) => {
                    if(uf.includes("Add") && this.reserveStation[uf].busy == false && allocated == false){

                        this.reserveStation[uf].busy = true
                        this.reserveStation[uf].Op = operation.operation
                        this.reserveStation[uf].Vj = operation.secondRegister
                        this.reserveStation[uf].Vk = operation?.thirdRegister ?? ""
                        this.reserveStation[uf].Dest = operation.firstRegister
                        this.reserveStation[uf].A = ""

                        const [, register] = operation.firstRegister.split("R")
                        this.registers[register].busy = true
                        this.registers[register].content = operation.firstRegister

                        if(operation.dependencies.has(operation.secondRegister)){
                            this.reserveStation[uf].Qj = operation.secondRegister ?? ""
                        } 
                        if(operation.dependencies.has(operation.thirdRegister)){
                            this.reserveStation[uf].Qk = operation.thirdRegister ?? ""
                        }

                        allocated = true
                        return allocated
                    }
                })
                return allocated
            case "Load":
                UFs.forEach((uf) => {
                    if(uf.includes("Load") && this.reserveStation[uf].busy == false && allocated == false){

                        this.reserveStation[uf].busy = true
                        this.reserveStation[uf].Op = operation.operation
                        this.reserveStation[uf].Vj = operation.secondRegister
                        this.reserveStation[uf].Vk = ""
                        this.reserveStation[uf].Dest = ""
                        this.reserveStation[uf].A = operation.firstRegister

                        const [, register] = operation.firstRegister.split("R")
                        this.registers[register].busy = true
                        this.registers[register].content = operation.firstRegister

                        if(operation.dependencies.has(operation.secondRegister)){
                            this.reserveStation[uf].Qj = operation.secondRegister ?? ""
                        }

                        allocated = true
                        return allocated
                    }
                })
                return allocated
            default:
                UFs.forEach((uf) => {
                    if(uf.includes("Mult") && this.reserveStation[uf].busy == false && allocated == false){

                        this.reserveStation[uf].busy = true
                        this.reserveStation[uf].Op = operation.operation
                        this.reserveStation[uf].Vj = operation.secondRegister
                        this.reserveStation[uf].Vk = operation?.thirdRegister ?? ""
                        this.reserveStation[uf].Dest = operation.firstRegister
                        this.reserveStation[uf].A = ""

                        const [, register] = operation.firstRegister.split("R")
                        this.registers[register].busy = true
                        this.registers[register].content = operation.firstRegister

                        if(operation.dependencies.has(operation.secondRegister)){
                            this.reserveStation[uf].Qj = operation.secondRegister ?? ""
                        } 
                        if(operation.dependencies.has(operation.thirdRegister)){
                            this.reserveStation[uf].Qk = operation.thirdRegister ?? ""
                        }

                        allocated = true
                        return allocated
                    }
                })
                return allocated
        }
    }

    FunctionalUnitDesallocation(functionalUnit, operation){
        let desallocated = false
        let UFs = Object.keys(this.reserveStation)
        switch (functionalUnit) {
            case 'Add':
                UFs.forEach((uf) => {
                    if(uf.includes("Add") && this.reserveStation[uf].busy == true && desallocated == false){
                        if(this.reserveStation[uf].Op == operation.operation &&
                        this.reserveStation[uf].Vj == operation.secondRegister &&
                        this.reserveStation[uf].Vk == operation.thirdRegister &&
                        this.reserveStation[uf].Dest == operation.firstRegister)
                        {
                            this.resetFunctionalUnit(this.reserveStation[uf])
                            desallocated = true
                            return desallocated
                        }
                    }
                })
                return desallocated
            case 'Load':
                UFs.forEach((uf) => {
                    if(uf.includes("Load") && this.reserveStation[uf].busy == true && desallocated == false){
                        if(this.reserveStation[uf].Op == operation.operation &&
                        this.reserveStation[uf].Vj == operation.secondRegister &&
                        this.reserveStation[uf].A == operation.firstRegister)
                        {
                            this.resetFunctionalUnit(this.reserveStation[uf])
                            desallocated = true
                            return desallocated
                        }
                    }
                })
                return desallocated
            default:
                UFs.forEach((uf) => {
                    if(uf.includes("Mult") && this.reserveStation[uf].busy == true && desallocated == false){
                        if(this.reserveStation[uf].Op == operation.operation &&
                        this.reserveStation[uf].Vj == operation.secondRegister &&
                        this.reserveStation[uf].Vk == operation.thirdRegister &&
                        this.reserveStation[uf].Dest == operation.firstRegister)
                        {
                            this.resetFunctionalUnit(this.reserveStation[uf])
                            desallocated = true
                            return desallocated
                        }
                    }
                })
                return desallocated
        }
    }

    resetFunctionalUnit(functionalUnit){
        functionalUnit.busy = false
        functionalUnit.Op = ""
        functionalUnit.Vj =""
        functionalUnit.Vk =""
        functionalUnit.Qj =""
        functionalUnit.Qk = ""
        functionalUnit.Dest =""
        functionalUnit.A =""
        return functionalUnit
    }

    makeBEQ(operation, amount){
        let index = this.operations.findIndex((op) => {
            return op == operation
        })
        for (let i = index; i < (index+Number(amount)) + 1; i++) {       
            let functionalStation = this.verificaUFInstrucao(this.operations[i].operation)
            this.FunctionalUnitDesallocation(functionalStation, this.operations[i])
        }
        this.operations.splice(index, ++amount)
        this.verifyDependencies()
    }
}