let mock0 = [
  {
    operation: "AND",
    firstRegister: "R1",
    secondRegister: "R2",
    thirdRegister: "R3",
  },
  {
    operation: "ADD",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "CMN",
    firstRegister: "R6",
    secondRegister: "R7",
    thirdRegister: "R8",
  },
  {
    operation: "CMP",
    firstRegister: "R9",
    secondRegister: "R10",
    thirdRegister: "R11",
  },
  {
    operation: "BEQ",
    firstRegister: "R12",
    secondRegister: "R1",
    thirdRegister: "#2",
    fourthRegister: false,
  },
  {
    operation: "SUB",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "LDR",
    firstRegister: "R11",
    secondRegister: "R1",
  },
  {
    operation: "MOV",
    firstRegister: "R6",
    secondRegister: "R8",
  },
  {
    operation: "MUL",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "ORR",
    firstRegister: "R4",
    secondRegister: "R5",
    thirdRegister: "R6",
  },
];

let mock1 = [
  {
    operation: "ADD",
    firstRegister: "R1",
    secondRegister: "R2",
    thirdRegister: "R3",
  },
  {
    operation: "ADD",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "SUB",
    firstRegister: "R2",
    secondRegister: "R3",
    thirdRegister: "R4",
  },
  {
    operation: "CMP",
    firstRegister: "R9",
    secondRegister: "R10",
    thirdRegister: "R11",
  },
  {
    operation: "BEQ",
    firstRegister: "R2",
    secondRegister: "R1",
    thirdRegister: "#2",
    fourthRegister: true,
  },
  {
    operation: "SUB",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "LDR",
    firstRegister: "R11",
    secondRegister: "R1",
  },
  {
    operation: "ADD",
    firstRegister: "R1",
    secondRegister: "R3",
    thirdRegister: "R2",
  },
  {
    operation: "MUL",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "ORR",
    firstRegister: "R4",
    secondRegister: "R5",
    thirdRegister: "R6",
  },
];
let mock2 = [
  {
    operation: "AND",
    firstRegister: "R1",
    secondRegister: "R2",
    thirdRegister: "R3",
  },
  {
    operation: "AND",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "CMN",
    firstRegister: "R6",
    secondRegister: "R7",
    thirdRegister: "R8",
  },
  {
    operation: "CMP",
    firstRegister: "R6",
    secondRegister: "R10",
    thirdRegister: "R11",
  },
  {
    operation: "BEQ",
    firstRegister: "R12",
    secondRegister: "R1",
    thirdRegister: "#6",
    fourthRegister: false,
  },
  {
    operation: "SUB",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "ORR",
    firstRegister: "R11",
    secondRegister: "R1",
    thirdRegister: "R3"
  },
  {
    operation: "MOV",
    firstRegister: "R6",
    secondRegister: "R8",
  },
  {
    operation: "MUL",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "ORR",
    firstRegister: "R4",
    secondRegister: "R5",
    thirdRegister: "R6",
  },
];
let mock3 = [
  {
    operation: "ADD",
    firstRegister: "R1",
    secondRegister: "R2",
    thirdRegister: "R3",
  },
  {
    operation: "ADD",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "SUB",
    firstRegister: "R2",
    secondRegister: "R3",
    thirdRegister: "R4",
  },
  {
    operation: "CMP",
    firstRegister: "R9",
    secondRegister: "R10",
    thirdRegister: "R11",
  },
  {
    operation: "BEQ",
    firstRegister: "R2",
    secondRegister: "R1",
    thirdRegister: "#2",
    fourthRegister: true,
  },
  {
    operation: "SUB",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "LDR",
    firstRegister: "R11",
    secondRegister: "R1",
  },
  {
    operation: "ADD",
    firstRegister: "R1",
    secondRegister: "R3",
    thirdRegister: "R2",
  },
  {
    operation: "MUL",
    firstRegister: "R3",
    secondRegister: "R1",
    thirdRegister: "R2",
  },
  {
    operation: "ORR",
    firstRegister: "R4",
    secondRegister: "R5",
    thirdRegister: "R6",
  },
];

export default [mock0, mock1, mock2, mock3];
