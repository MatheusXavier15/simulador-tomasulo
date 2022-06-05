export class Simulator {

    // Initial
    // Despachado
    // Em exec
    // Commit
    // Escrito

    constructor(operations, ) {

        this.operations = operations

        this.estadoInstrucoes = [];
        for(let i = 0; i < this.operations.length; i++) {
            let linha = {}
            linha["instrucao"] = {                      
                "operacao": this.operations[i]["operation"],
                "firstRegister": this.operations[i]["firstRegister"],
                "secondRegister": this.operations[i]["secondRegister"],
                "thirdRegister": this.operations[i]["thirdRegister"],
            };

            linha["index"] = i;                          
            linha["status"] = null;                     
            this.estadoInstrucoes[i] = linha;
        }
    }

    verificaUFInstrucao(instrucao) {
        // Funcao que verifica em qual unidade funcional cada instrucao deve executar
        "AND", "ADD", "SUB", "MUL", "CMP", "CMN", "BEQ", "ORR", "LDR", "MOV"
        switch (instrucao.operacao) {
            case 'ADD':
                return 'Add'
            case 'SUB':
                return 'Add'
            case 'MUL':
                return 'Mult'
            case 'LDR':
                return 'Load'
            case 'MOV':
                return 'Load'
            case 'AND':
                return 'Add'
            case 'CMP':
                return 'Add'
            case 'BEQ':
                return 'Add'
            case 'CMN':
                return 'Add'
            case 'ORR':
                return 'Add'
         }
    }

    alocaFuMem(uf, instrucao, estadoInstrucao) {
        // Funcao que aloca uma unidade funcional de memória para uma instrucao
        uf.instrucao = instrucao;
        uf.estadoInstrucao = estadoInstrucao;
        uf.tempo = 1; // salva o número de ciclos + 1 uma vez que quando estiver livre, nao execute um ciclo a menos (possivel execucao apos o issue)
        uf.ocupado = true;
        uf.operacao = instrucao.operation;
        uf.endereco = instrucao.secondRegister + '+' + instrucao.thirdRegister;
        uf.destino = instrucao.firstRegister;
        uf.qi = null;
        uf.qj = null;

        // // caso a instrucao seja de store, verifica se tem que esperar a uf escrever no registrador que vai salvar
        // if (instrucao.operacao === 'SD') {
        //     // busca no banco de registradores qual o valor que esta escrito (VAL(UF)-execucao completa; UF-execucao pendente)
        //     let UFQueTemQueEsperar = this.estacaoRegistradores[instrucao.registradorR];

        //     // caso o nome seja de uma das unidades funcionais, marca que tem que esperar ela
        //     if ((UFQueTemQueEsperar in this.unidadesFuncionais) || (UFQueTemQueEsperar in this.unidadesFuncionaisMemoria))
        //         uf.qi = UFQueTemQueEsperar;
        //     else
        //         uf.qi = null;
        // }

        // // verifica se tem que esperar a uf de inteiros escrever o valor do registrador de deslocamento
        // // busca no banco de registradores qual o valor que esta escrito (VAL(UF)-execucao completa; UF-execucao pendente)
        // let UFintQueTemQueEsperar = this.estacaoRegistradores[instrucao.registradorT];

        // // caso o nome seja de uma das unidades funcionais, marca que tem que esperar ela
        // if ((UFintQueTemQueEsperar in this.unidadesFuncionais) || (UFintQueTemQueEsperar in this.unidadesFuncionaisMemoria))
        //     uf.qj = UFintQueTemQueEsperar;
        // else
        //     uf.qj = null;
    }

    alocaFU(uf, instrucao, estadoInstrucao) {
        // funcao que aloca uma unidade funcional
            uf.instrucao = instrucao;
            uf.estadoInstrucao = estadoInstrucao;
            uf.tempo =  1; // é somado 1 pq vai ser subtraido 1 na fase de execucao apos isso 
            uf.ocupado = true;
            uf.operacao = instrucao.operation;
    
            let reg_j;
            let reg_k;
            let reg_j_inst;
            let reg_k_inst;
    
            // caso seja uma das instrucoes condicionais
            if (instrucao.operacao === 'BEQ') {
                reg_j = this.estacaoRegistradores[instrucao.firstRegister];   // busca o nome da uf q esta usando o registrador r
                reg_k = this.estacaoRegistradores[instrucao.secondRegister];   // busca o nome da uf q esta usando o registrador s
    
                reg_j_inst = instrucao.firstRegister;                         // salva o nome dos registradores que veio da instrucao
                reg_k_inst = instrucao.secondRegister;
            } else {
                reg_j = this.estacaoRegistradores[instrucao.secondRegister];   // busca o nome da uf q esta usando o registrador s
                reg_k = this.estacaoRegistradores[instrucao.thirdRegister];   // busca o nome da uf q esta usando o registrador t
    
                reg_j_inst = instrucao.secondRegister;                         // salva o nome dos registradores que veio da instrucao
                reg_k_inst = instrucao.thirdRegister;
            }
    
            // se o registrador j e nulo (ninguem usou ele) ou nao definido (label), usa como valor o registrador que veio da instrucao
            if (reg_j === null || reg_j === undefined)
                uf.vj = reg_j_inst;
            else {
                // caso o nome seja uma unidade funcional, este registrador vai ter o valor escrito ainda, entao tem que esperar
                if ((reg_j in this.unidadesFuncionais) || (reg_j in this.unidadesFuncionaisMemoria))
                    uf.qj = reg_j;
                else
                    uf.vj = reg_j;
            }
    
            // se o registrador k e nulo (ninguem usou ele) ou nao definido (label), usa como valor o registrador que veio da instrucao
            if (reg_k === null || reg_k === undefined)
                uf.vk = reg_k_inst;
            else {
                // caso o nome seja uma unidade funcional, este registrador vai ter o valor escrito ainda, entao tem que esperar
                if ((reg_k in this.unidadesFuncionais) || (reg_k in this.unidadesFuncionaisMemoria))
                    uf.qk = reg_k;
                else
                    uf.vk = reg_k;
            }
        }

    desalocaUFMem(ufMem) {
        // funcao que desaloca (limpa os campos) das unidades funcionais de memoria
            ufMem.instrucao = null;
            ufMem.estadoInstrucao = null;
            ufMem.tempo = null;
            ufMem.ocupado = false;
            ufMem.operacao = null;
            ufMem.endereco = null;
            ufMem.destino = null;
            ufMem.qi = null;
            ufMem.qj = null;
    }

    desalocaUF(uf) {
    // funcao que desaloca (limpa os campos) das unidades funcionais
        uf.instrucao = null;
        uf.estadoInstrucao = null;
        uf.tempo = null;
        uf.ocupado = false;
        uf.operacao = null;
        uf.vj = null;
        uf.vk = null;
        uf.qj = null;
        uf.qk = null;
    }

    getInstruction(){
        // let instruction = this.operations.forEach(element => {
        //     if (element.status == 'Initial') return element
        // });
        // return instruction
    }

    despachaInstrucao(){

    }

    executaInstrucao(){

    }

    commitaInstrucao(){

    }

    escreveInstrucao(){

    }
}