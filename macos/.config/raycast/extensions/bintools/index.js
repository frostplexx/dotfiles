"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  default: () => Command
});
module.exports = __toCommonJS(src_exports);
var import_react = require("react");
var import_api = require("@raycast/api");

// src/Float.ts
var BinaryFloat = class {
  constructor(number) {
    this.sign = 0;
    this.exponent = 0;
    this.mantissa = "0";
    this.floatBinary = "";
    this.fixedBinary = number;
    this.setSign();
    this.setExponentAndMantissa();
    this.setFloatBinary();
  }
  getMantissa() {
    return this.mantissa;
  }
  getExponent() {
    return this.exponent;
  }
  getSign() {
    return this.sign;
  }
  getFloatBinary() {
    return this.floatBinary;
  }
};
var SinglePrecision = class extends BinaryFloat {
  constructor(number) {
    super(number);
  }
  setExponentAndMantissa() {
    const { delta, mantissa } = normalizeNumber(this.fixedBinary);
    this.exponent = delta + 127;
    this.mantissa = mantissa;
  }
  getMantissa() {
    return this.mantissa;
  }
  setSign() {
    console.log(this.fixedBinary[0]);
    if (this.fixedBinary[0] === "-") {
      this.sign = 1;
    } else {
      this.sign = 0;
    }
  }
  setFloatBinary() {
    if (this.mantissa.length > 23) {
      this.mantissa = this.mantissa.slice(0, 23);
    }
    this.floatBinary = this.sign.toString() + " " + this.exponent.toString(2) + "0".repeat(8 - this.exponent.toString(2).length) + " " + this.mantissa + "0".repeat(23 - this.mantissa.length);
  }
  getFloatDecimal() {
    let decimal = 0;
    for (let i = 0; i < this.mantissa.length; i++) {
      decimal += parseInt(this.mantissa[i]) * Math.pow(2, -1 * (i + 1));
    }
    decimal += 1;
    decimal *= Math.pow(2, this.exponent - 127);
    if (this.sign === 1) {
      decimal *= -1;
    }
    return decimal.toString();
  }
};
var DoublePrecision = class extends BinaryFloat {
  getFloatDecimal() {
    let mantissa = 0;
    for (let i = 0; i < this.mantissa.length; i++) {
      mantissa += parseInt(this.mantissa[i]) * Math.pow(2, -1 * (i + 1));
    }
    mantissa += 1;
    mantissa *= Math.pow(2, this.exponent - 1023);
    if (this.sign === 1) {
      mantissa *= -1;
    }
    return mantissa.toString();
  }
  constructor(number) {
    super(number);
  }
  setExponentAndMantissa() {
    const { delta, mantissa } = normalizeNumber(this.fixedBinary);
    this.exponent = delta + 1023;
    this.mantissa = mantissa;
  }
  getMantissa() {
    return this.mantissa;
  }
  setSign() {
    if (this.fixedBinary[0] === "-") {
      this.sign = 1;
    } else {
      this.sign = 0;
    }
  }
  setFloatBinary() {
    if (this.mantissa.length > 52) {
      this.mantissa = this.mantissa.slice(0, 52);
    }
    this.floatBinary = this.sign.toString() + " " + this.exponent.toString(2) + "0".repeat(11 - this.exponent.toString(2).length) + " " + this.mantissa + "0".repeat(52 - this.mantissa.length);
  }
};
function normalizeNumber(fixedPoint) {
  fixedPoint = fixedPoint.replace("-", "");
  fixedPoint = fixedPoint.replace("+", "");
  fixedPoint = fixedPoint.replace(",", ".");
  let fixedPointArray = fixedPoint.split("");
  const commaIndex = fixedPointArray.indexOf(".");
  let closestOneIndex = NaN;
  const farthestOneIndex = NaN;
  fixedPointArray = fixedPointArray.filter(function(letter) {
    return letter != ",";
  });
  console.log(fixedPointArray);
  for (let i = 0; i < fixedPointArray.length; i++) {
    if (fixedPointArray[i] === "1") {
      closestOneIndex = i;
      break;
    }
  }
  console.log("closest one index: " + closestOneIndex);
  console.log("comma index: " + commaIndex);
  const exponent = commaIndex - closestOneIndex;
  let mantissa;
  console.log(exponent);
  if (!isNaN(farthestOneIndex)) {
    mantissa = fixedPointArray.slice(farthestOneIndex + 1).join("").replace(",", "").replace(".", "");
  } else {
    mantissa = fixedPointArray.slice(closestOneIndex + 1).join("").replace(",", "").replace(".", "");
  }
  return {
    delta: exponent,
    mantissa
  };
}

// src/calculator.ts
function getSign(number) {
  return number.slice(0, 1) == "-" ? "-" : "";
}
function binaryCommaParser(number, setState) {
  const singlePrecBinFloat = new SinglePrecision(number);
  const doublePrecBinFloat = new DoublePrecision(number);
  const singlePrecDec = singlePrecBinFloat.getFloatDecimal();
  const doublePrecDec = doublePrecBinFloat.getFloatDecimal();
  const fixedPointArray = number.includes(",") ? number.split(",") : number.split(".");
  const fixedPointDec = number.slice(0, 1) + parseInt(fixedPointArray[0], 2) + parseInt(fixedPointArray[1], 2) / 2 ** fixedPointArray[1].length;
  setState({
    inputType: "Binary with comma" /* BinaryComma */,
    binNumber: number,
    decNumber: fixedPointDec.toString(),
    hexNumber: "",
    binFloat: {
      singlePrecision: {
        sign: singlePrecBinFloat.getSign().toString(),
        exponent: singlePrecBinFloat.getExponent().toString(),
        mantissa: singlePrecBinFloat.getMantissa().toString(),
        floatingPoint: singlePrecBinFloat.getFloatBinary().toString(),
        floatDecimal: singlePrecDec.toString()
      },
      doublePrecision: {
        sign: doublePrecBinFloat.getSign().toString(),
        exponent: doublePrecBinFloat.getExponent().toString(),
        mantissa: doublePrecBinFloat.getMantissa().toString(),
        floatingPoint: doublePrecBinFloat.getFloatBinary().toString(),
        floatDecimal: doublePrecDec.toString()
      }
    }
  });
}
function decimalCommaParser(number, setState) {
  const fixedPointArray = number.includes(",") ? number.split(",") : number.split(".");
  const fixedPointBinFirstPart = parseInt(fixedPointArray[0]).toString(2);
  let binaryRep = "";
  const demialString = "0." + fixedPointArray[1];
  let decimalRep = parseFloat(demialString);
  for (let i = 0; i < 64 && decimalRep != 0; i++) {
    if (decimalRep >= 1) {
      binaryRep += "1";
      decimalRep--;
    } else {
      binaryRep += "0";
    }
    decimalRep *= 2;
  }
  const fixedPointBin = getSign(number) + fixedPointBinFirstPart + "." + binaryRep.slice(1);
  const singlePrecBinFloat = new SinglePrecision(fixedPointBin);
  const doublePrecBinFloat = new DoublePrecision(fixedPointBin);
  setState({
    inputType: "Decimal with comma" /* DecimalComma */,
    binNumber: getSign(number) == "-" ? fixedPointBin.slice(0, 10) : fixedPointBin.slice(0, 9),
    decNumber: number,
    hexNumber: "",
    binFloat: {
      singlePrecision: {
        sign: singlePrecBinFloat.getSign().toString(),
        exponent: singlePrecBinFloat.getExponent().toString(),
        mantissa: singlePrecBinFloat.getMantissa().toString(),
        floatingPoint: singlePrecBinFloat.getFloatBinary().toString(),
        floatDecimal: singlePrecBinFloat.getFloatDecimal()
      },
      doublePrecision: {
        sign: doublePrecBinFloat.getSign().toString(),
        exponent: doublePrecBinFloat.getExponent().toString(),
        mantissa: doublePrecBinFloat.getMantissa().toString(),
        floatingPoint: doublePrecBinFloat.getFloatBinary().toString(),
        floatDecimal: doublePrecBinFloat.getFloatDecimal()
      }
    }
  });
}
function parseInputNumber(number, setState) {
  number = number.replaceAll(" ", "");
  console.log(number);
  if (number.replace("-", "").slice(2).match(/^-?[0-1]+[,.][0-1]+$/) && number.replace("-", "").slice(0, 2) == "0b") {
    console.log("Binary comma");
    binaryCommaParser(number, setState);
  } else if (number.match(/^-?[0-9]+[.,][0-9]+$/)) {
    decimalCommaParser(number, setState);
  } else {
    const numberArray = number.split(/([+*/%^-])/);
    const convertedArray = [];
    for (let i = 0; i < numberArray.length; i++) {
      if (numberArray[i] != "" && !numberArray[i].match(/([+*/%^-])/)) {
        convertedArray.push(convertToDec(numberArray[i]));
      } else {
        convertedArray.push(numberArray[i]);
      }
    }
    console.log(convertedArray);
    let result = convertedArray[0];
    const inputs = [result.type];
    for (let i = 1; i < convertedArray.length; i += 2) {
      const operator = convertedArray[i];
      const value = convertedArray[i + 1];
      if (value.number == void 0 || result.number == void 0) {
        break;
      }
      inputs.push(operator);
      switch (operator) {
        case "+":
          result.number += value.number;
          inputs.push(value.type);
          break;
        case "-":
          result.number -= value.number;
          inputs.push(value.type);
          break;
        case "*":
          result.number *= value.number;
          inputs.push(value.type);
          break;
        case "/":
          result.number /= value.number;
          inputs.push(value.type);
          break;
        case "%":
          result.number %= value.number;
          inputs.push(value.type);
          break;
        case "^":
          result.number **= value.number;
          inputs.push(value.type);
          break;
        default:
          break;
      }
    }
    if (result.number == void 0) {
      result = { number: 0, type: "" /* None */ };
    }
    setState({
      inputType: inputs.toString().replaceAll(",", " ") ?? "",
      binNumber: result.number.toString(2),
      decNumber: result.number.toString(),
      hexNumber: result.number.toString(16),
      binFloat: void 0
    });
  }
}
function convertToDec(number) {
  const radixTable = {
    "0b": { radix: 2, type: "Binary" /* Binary */ },
    "0x": { radix: 16, type: "Hexadecimal" /* Hexadecimal */ },
    "0o": { radix: 8, type: "Octal" /* Octal */ }
  };
  let radix = 10;
  let inputType = "Decimal" /* Decimal */;
  if (number.slice(0, 2) in radixTable) {
    radix = radixTable[number.slice(0, 2)].radix;
    inputType = radixTable[number.slice(0, 2)].type;
    number = number.slice(2);
  }
  return {
    number: parseInt(number, radix),
    type: inputType
  };
}

// src/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Command() {
  const [state, setState] = (0, import_react.useState)({
    binNumber: "",
    decNumber: "",
    hexNumber: "",
    binFloat: void 0,
    inputType: "" /* None */
  });
  const normalListItems = [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Detected Input", accessories: [{ text: state.inputType }] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Binary Representation", accessories: [{ text: state.binNumber }] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Decimal Representation", accessories: [{ text: state.decNumber }] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Hexadecimal Representation", accessories: [{ text: state.hexNumber }] })
  ];
  const commaListItems = [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Detected Input", accessories: [{ text: state.inputType }] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Fixed Point Binary Representation", accessories: [{ text: state.binNumber }] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Fixed Point Decimal Representation", accessories: [{ text: state.decNumber }] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.List.Section, { title: "Floating Point Binary Representation \u2014 Single Precision", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Sign", accessories: [{ text: state.binFloat?.singlePrecision.sign }] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Exponent", accessories: [{ text: state.binFloat?.singlePrecision.exponent }] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Mantissa", accessories: [{ text: state.binFloat?.singlePrecision.mantissa }] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Floating Point", accessories: [{ text: state.binFloat?.singlePrecision.floatingPoint }] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Floating Point Decimal", accessories: [{ text: state.binFloat?.singlePrecision.floatDecimal }] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.List.Section, { title: "Floating Point Binary Representation \u2014 Double Precision", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Sign", accessories: [{ text: state.binFloat?.doublePrecision.sign }] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Exponent", accessories: [{ text: state.binFloat?.doublePrecision.exponent }] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Mantissa", accessories: [{ text: state.binFloat?.doublePrecision.mantissa }] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Floating Point", accessories: [{ text: state.binFloat?.doublePrecision.floatingPoint }] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item, { title: "Floating Point Decimal", accessories: [{ text: state.binFloat?.doublePrecision.floatDecimal }] })
    ] })
  ];
  const isComma = state.inputType === "Binary with comma" /* BinaryComma */ || state.inputType === "Decimal with comma" /* DecimalComma */;
  return (
    //if the inputType is either Binary with comma or decimal with comma, then instead of showing the different representation show the number as a fixed point binary and a floating point binary broken down into its components
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_api.List,
      {
        isLoading: !state.inputType,
        searchBarPlaceholder: "Enter your calculation: 0b0101+0xff...",
        onSearchTextChange: async (text) => {
          parseInputNumber(text, setState);
        },
        children: !isComma ? normalListItems.map((item) => {
          return item;
        }) : commaListItems.map((item) => {
          return item;
        })
      }
    )
  );
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL0JpbmFyeVRvb2xzL3NyYy9pbmRleC50c3giLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL0JpbmFyeVRvb2xzL3NyYy9GbG9hdC50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvQmluYXJ5VG9vbHMvc3JjL2NhbGN1bGF0b3IudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIkByYXljYXN0L2FwaVwiO1xuaW1wb3J0IHsgSW5wdXRUeXBlLCBwYXJzZUlucHV0TnVtYmVyIH0gZnJvbSBcIi4vY2FsY3VsYXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRlIHtcbiAgICBpbnB1dFR5cGU6IHN0cmluZztcbiAgICBiaW5OdW1iZXI6IHN0cmluZztcbiAgICBkZWNOdW1iZXI6IHN0cmluZztcbiAgICBoZXhOdW1iZXI6IHN0cmluZztcbiAgICBiaW5GbG9hdDogYmluRmxvYXQgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgYmluRmxvYXQge1xuICAgIHNpbmdsZVByZWNpc2lvbjogc2luZ2xlUHJlY0Zsb2F0O1xuICAgIGRvdWJsZVByZWNpc2lvbjogZG91YmxlUHJlY0Zsb2F0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIHNpbmdsZVByZWNGbG9hdCB7XG4gICAgc2lnbjogc3RyaW5nO1xuICAgIGV4cG9uZW50OiBzdHJpbmc7XG4gICAgbWFudGlzc2E6IHN0cmluZztcbiAgICBmbG9hdGluZ1BvaW50OiBzdHJpbmc7XG4gICAgZmxvYXREZWNpbWFsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgZG91YmxlUHJlY0Zsb2F0IHtcbiAgICBzaWduOiBzdHJpbmc7XG4gICAgZXhwb25lbnQ6IHN0cmluZztcbiAgICBtYW50aXNzYTogc3RyaW5nO1xuICAgIGZsb2F0aW5nUG9pbnQ6IHN0cmluZztcbiAgICBmbG9hdERlY2ltYWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29tbWFuZCgpIHtcbiAgICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlPFN0YXRlPih7XG4gICAgICAgIGJpbk51bWJlcjogXCJcIixcbiAgICAgICAgZGVjTnVtYmVyOiBcIlwiLFxuICAgICAgICBoZXhOdW1iZXI6IFwiXCIsXG4gICAgICAgIGJpbkZsb2F0OiB1bmRlZmluZWQsXG4gICAgICAgIGlucHV0VHlwZTogSW5wdXRUeXBlLk5vbmUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBub3JtYWxMaXN0SXRlbXMgPSBbXG4gICAgICAgIDxMaXN0Lkl0ZW0gdGl0bGU9e1wiRGV0ZWN0ZWQgSW5wdXRcIn0gYWNjZXNzb3JpZXM9e1t7IHRleHQ6IHN0YXRlLmlucHV0VHlwZSB9XX0gLz4sXG4gICAgICAgIDxMaXN0Lkl0ZW0gdGl0bGU9e1wiQmluYXJ5IFJlcHJlc2VudGF0aW9uXCJ9IGFjY2Vzc29yaWVzPXtbeyB0ZXh0OiBzdGF0ZS5iaW5OdW1iZXIgfV19IC8+LFxuICAgICAgICA8TGlzdC5JdGVtIHRpdGxlPXtcIkRlY2ltYWwgUmVwcmVzZW50YXRpb25cIn0gYWNjZXNzb3JpZXM9e1t7IHRleHQ6IHN0YXRlLmRlY051bWJlciB9XX0gLz4sXG4gICAgICAgIDxMaXN0Lkl0ZW0gdGl0bGU9e1wiSGV4YWRlY2ltYWwgUmVwcmVzZW50YXRpb25cIn0gYWNjZXNzb3JpZXM9e1t7IHRleHQ6IHN0YXRlLmhleE51bWJlciB9XX0gLz4sXG4gICAgXTtcblxuICAgIGNvbnN0IGNvbW1hTGlzdEl0ZW1zID0gW1xuICAgICAgICA8TGlzdC5JdGVtIHRpdGxlPXtcIkRldGVjdGVkIElucHV0XCJ9IGFjY2Vzc29yaWVzPXtbeyB0ZXh0OiBzdGF0ZS5pbnB1dFR5cGUgfV19IC8+LFxuICAgICAgICA8TGlzdC5JdGVtIHRpdGxlPXtcIkZpeGVkIFBvaW50IEJpbmFyeSBSZXByZXNlbnRhdGlvblwifSBhY2Nlc3Nvcmllcz17W3sgdGV4dDogc3RhdGUuYmluTnVtYmVyIH1dfSAvPixcbiAgICAgICAgPExpc3QuSXRlbSB0aXRsZT17XCJGaXhlZCBQb2ludCBEZWNpbWFsIFJlcHJlc2VudGF0aW9uXCJ9IGFjY2Vzc29yaWVzPXtbeyB0ZXh0OiBzdGF0ZS5kZWNOdW1iZXIgfV19IC8+LFxuICAgICAgICA8TGlzdC5TZWN0aW9uIHRpdGxlPXtcIkZsb2F0aW5nIFBvaW50IEJpbmFyeSBSZXByZXNlbnRhdGlvbiBcdTIwMTQgU2luZ2xlIFByZWNpc2lvblwifT5cbiAgICAgICAgICAgIDxMaXN0Lkl0ZW0gdGl0bGU9e1wiU2lnblwifSBhY2Nlc3Nvcmllcz17W3sgdGV4dDogc3RhdGUuYmluRmxvYXQ/LnNpbmdsZVByZWNpc2lvbi5zaWduIH1dfSAvPlxuICAgICAgICAgICAgPExpc3QuSXRlbSB0aXRsZT17XCJFeHBvbmVudFwifSBhY2Nlc3Nvcmllcz17W3sgdGV4dDogc3RhdGUuYmluRmxvYXQ/LnNpbmdsZVByZWNpc2lvbi5leHBvbmVudCB9XX0gLz5cbiAgICAgICAgICAgIDxMaXN0Lkl0ZW0gdGl0bGU9e1wiTWFudGlzc2FcIn0gYWNjZXNzb3JpZXM9e1t7IHRleHQ6IHN0YXRlLmJpbkZsb2F0Py5zaW5nbGVQcmVjaXNpb24ubWFudGlzc2EgfV19IC8+XG4gICAgICAgICAgICA8TGlzdC5JdGVtIHRpdGxlPXtcIkZsb2F0aW5nIFBvaW50XCJ9IGFjY2Vzc29yaWVzPXtbeyB0ZXh0OiBzdGF0ZS5iaW5GbG9hdD8uc2luZ2xlUHJlY2lzaW9uLmZsb2F0aW5nUG9pbnQgfV19IC8+XG4gICAgICAgICAgICA8TGlzdC5JdGVtIHRpdGxlPXtcIkZsb2F0aW5nIFBvaW50IERlY2ltYWxcIn0gYWNjZXNzb3JpZXM9e1t7IHRleHQ6IHN0YXRlLmJpbkZsb2F0Py5zaW5nbGVQcmVjaXNpb24uZmxvYXREZWNpbWFsIH1dfSAvPlxuICAgICAgICA8L0xpc3QuU2VjdGlvbj4sXG4gICAgICAgIDxMaXN0LlNlY3Rpb24gdGl0bGU9e1wiRmxvYXRpbmcgUG9pbnQgQmluYXJ5IFJlcHJlc2VudGF0aW9uIFx1MjAxNCBEb3VibGUgUHJlY2lzaW9uXCJ9PlxuICAgICAgICAgICAgPExpc3QuSXRlbSB0aXRsZT17XCJTaWduXCJ9IGFjY2Vzc29yaWVzPXtbeyB0ZXh0OiBzdGF0ZS5iaW5GbG9hdD8uZG91YmxlUHJlY2lzaW9uLnNpZ24gfV19IC8+XG4gICAgICAgICAgICA8TGlzdC5JdGVtIHRpdGxlPXtcIkV4cG9uZW50XCJ9IGFjY2Vzc29yaWVzPXtbeyB0ZXh0OiBzdGF0ZS5iaW5GbG9hdD8uZG91YmxlUHJlY2lzaW9uLmV4cG9uZW50IH1dfSAvPlxuICAgICAgICAgICAgPExpc3QuSXRlbSB0aXRsZT17XCJNYW50aXNzYVwifSBhY2Nlc3Nvcmllcz17W3sgdGV4dDogc3RhdGUuYmluRmxvYXQ/LmRvdWJsZVByZWNpc2lvbi5tYW50aXNzYSB9XX0gLz5cbiAgICAgICAgICAgIDxMaXN0Lkl0ZW0gdGl0bGU9e1wiRmxvYXRpbmcgUG9pbnRcIn0gYWNjZXNzb3JpZXM9e1t7IHRleHQ6IHN0YXRlLmJpbkZsb2F0Py5kb3VibGVQcmVjaXNpb24uZmxvYXRpbmdQb2ludCB9XX0gLz5cbiAgICAgICAgICAgIDxMaXN0Lkl0ZW0gdGl0bGU9e1wiRmxvYXRpbmcgUG9pbnQgRGVjaW1hbFwifSBhY2Nlc3Nvcmllcz17W3sgdGV4dDogc3RhdGUuYmluRmxvYXQ/LmRvdWJsZVByZWNpc2lvbi5mbG9hdERlY2ltYWwgfV19IC8+XG4gICAgICAgIDwvTGlzdC5TZWN0aW9uPixcbiAgICBdO1xuICAgIGNvbnN0IGlzQ29tbWEgPSBzdGF0ZS5pbnB1dFR5cGUgPT09IElucHV0VHlwZS5CaW5hcnlDb21tYSB8fCBzdGF0ZS5pbnB1dFR5cGUgPT09IElucHV0VHlwZS5EZWNpbWFsQ29tbWE7XG4gICAgcmV0dXJuIChcbiAgICAgICAgLy9pZiB0aGUgaW5wdXRUeXBlIGlzIGVpdGhlciBCaW5hcnkgd2l0aCBjb21tYSBvciBkZWNpbWFsIHdpdGggY29tbWEsIHRoZW4gaW5zdGVhZCBvZiBzaG93aW5nIHRoZSBkaWZmZXJlbnQgcmVwcmVzZW50YXRpb24gc2hvdyB0aGUgbnVtYmVyIGFzIGEgZml4ZWQgcG9pbnQgYmluYXJ5IGFuZCBhIGZsb2F0aW5nIHBvaW50IGJpbmFyeSBicm9rZW4gZG93biBpbnRvIGl0cyBjb21wb25lbnRzXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgICBpc0xvYWRpbmc9eyFzdGF0ZS5pbnB1dFR5cGV9XG4gICAgICAgICAgICBzZWFyY2hCYXJQbGFjZWhvbGRlcj1cIkVudGVyIHlvdXIgY2FsY3VsYXRpb246IDBiMDEwMSsweGZmLi4uXCJcbiAgICAgICAgICAgIG9uU2VhcmNoVGV4dENoYW5nZT17YXN5bmMgKHRleHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHBhcnNlSW5wdXROdW1iZXIodGV4dCwgc2V0U3RhdGUpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgICAgeyFpc0NvbW1hXG4gICAgICAgICAgICAgICAgPyBub3JtYWxMaXN0SXRlbXMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgOiBjb21tYUxpc3RJdGVtcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgIDwvTGlzdD5cbiAgICApO1xufVxuIiwgImFic3RyYWN0IGNsYXNzIEJpbmFyeUZsb2F0IHtcbiAgICBzaWduID0gMDtcbiAgICBleHBvbmVudCA9IDA7XG4gICAgbWFudGlzc2EgPSBcIjBcIjtcbiAgICBmaXhlZEJpbmFyeTogc3RyaW5nO1xuICAgIGZsb2F0QmluYXJ5ID0gXCJcIjtcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IobnVtYmVyOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5maXhlZEJpbmFyeSA9IG51bWJlcjtcbiAgICAgICAgdGhpcy5zZXRTaWduKCk7XG4gICAgICAgIHRoaXMuc2V0RXhwb25lbnRBbmRNYW50aXNzYSgpO1xuICAgICAgICB0aGlzLnNldEZsb2F0QmluYXJ5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2lnbiBvZiB0aGUgbnVtYmVyXG4gICAgICovXG4gICAgYWJzdHJhY3Qgc2V0U2lnbigpOiB2b2lkO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZXhwb25lbnQgb2YgdGhlIG51bWJlclxuICAgICAqL1xuICAgIGFic3RyYWN0IHNldEV4cG9uZW50QW5kTWFudGlzc2EoKTogdm9pZDtcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGZsb2F0IGJpbmFyeSBvZiB0aGUgbnVtYmVyXG4gICAgICovXG4gICAgYWJzdHJhY3Qgc2V0RmxvYXRCaW5hcnkoKTogdm9pZDtcblxuICAgIGdldE1hbnRpc3NhKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbnRpc3NhO1xuICAgIH1cblxuICAgIGdldEV4cG9uZW50KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4cG9uZW50O1xuICAgIH1cblxuICAgIGdldFNpZ24oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2lnbjtcbiAgICB9XG5cbiAgICBnZXRGbG9hdEJpbmFyeSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5mbG9hdEJpbmFyeTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZXRGbG9hdERlY2ltYWwoKTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgU2luZ2xlUHJlY2lzaW9uIGV4dGVuZHMgQmluYXJ5RmxvYXQge1xuICAgIGNvbnN0cnVjdG9yKG51bWJlcjogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKG51bWJlcik7XG4gICAgfVxuXG4gICAgc2V0RXhwb25lbnRBbmRNYW50aXNzYSgpOiB2b2lkIHtcbiAgICAgICAgLy90aGUgZXhwb25lbnQgaXMgaG93IG1hbnkgcGxhY2VzIHRoZSBjb21tYSBoYXMgdG8gYmUgbW92ZWQsIHNvIHRoYXQgb25seSBhIDEgaXMgYXQgdGhlIGZyb250ICsgMTI3XG4gICAgICAgIC8vaWYgdGhlIG51bWJlciBpcyBuZWdhdGl2ZSwgdGhlIGV4cG9uZW50IGlzIDEyNyAtIHRoZSBudW1iZXIgb2YgcGxhY2VzIHRoZSBjb21tYSBoYXMgdG8gYmUgbW92ZWRcbiAgICAgICAgY29uc3QgeyBkZWx0YSwgbWFudGlzc2EgfSA9IG5vcm1hbGl6ZU51bWJlcih0aGlzLmZpeGVkQmluYXJ5KTtcbiAgICAgICAgdGhpcy5leHBvbmVudCA9IGRlbHRhICsgMTI3O1xuICAgICAgICB0aGlzLm1hbnRpc3NhID0gbWFudGlzc2E7XG4gICAgfVxuXG4gICAgZ2V0TWFudGlzc2EoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFudGlzc2E7XG4gICAgfVxuXG4gICAgc2V0U2lnbigpOiB2b2lkIHtcbiAgICAgICAgLy9pZiB0aGUgbnVtYmVyIGlzIG5lZ2F0aXZlIHJldHVybiAxXG4gICAgICAgIC8vaWYgdGhlIG51bWJlciBpcyBwb3NpdGl2ZSByZXR1cm4gMFxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZpeGVkQmluYXJ5WzBdKTtcbiAgICAgICAgaWYgKHRoaXMuZml4ZWRCaW5hcnlbMF0gPT09IFwiLVwiKSB7XG4gICAgICAgICAgICB0aGlzLnNpZ24gPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zaWduID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEZsb2F0QmluYXJ5KCk6IHZvaWQge1xuICAgICAgICAvL2NoZWNrIGlmIHRoZSBtYW50aXNzYSBpcyBsb25nZXIgdGhhbiAyMyBiaXRzXG4gICAgICAgIGlmICh0aGlzLm1hbnRpc3NhLmxlbmd0aCA+IDIzKSB7XG4gICAgICAgICAgICAvL2lmIGl0IGlzLCBjdXQgb2ZmIHRoZSByZXN0XG4gICAgICAgICAgICB0aGlzLm1hbnRpc3NhID0gdGhpcy5tYW50aXNzYS5zbGljZSgwLCAyMyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZsb2F0QmluYXJ5ID1cbiAgICAgICAgICAgIHRoaXMuc2lnbi50b1N0cmluZygpICtcbiAgICAgICAgICAgIFwiIFwiICtcbiAgICAgICAgICAgIHRoaXMuZXhwb25lbnQudG9TdHJpbmcoMikgK1xuICAgICAgICAgICAgXCIwXCIucmVwZWF0KDggLSB0aGlzLmV4cG9uZW50LnRvU3RyaW5nKDIpLmxlbmd0aCkgK1xuICAgICAgICAgICAgXCIgXCIgK1xuICAgICAgICAgICAgdGhpcy5tYW50aXNzYSArXG4gICAgICAgICAgICBcIjBcIi5yZXBlYXQoMjMgLSB0aGlzLm1hbnRpc3NhLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgZ2V0RmxvYXREZWNpbWFsKCk6IHN0cmluZyB7XG4gICAgICAgIC8vY29udmVydCB0aGUgZmxvYXQgYmluYXJ5IHRvIGRlY2ltYWxcbiAgICAgICAgbGV0IGRlY2ltYWwgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWFudGlzc2EubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRlY2ltYWwgKz0gcGFyc2VJbnQodGhpcy5tYW50aXNzYVtpXSkgKiBNYXRoLnBvdygyLCAtMSAqIChpICsgMSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vYWRkIDEgdG8gdGhlIGRlY2ltYWxcbiAgICAgICAgZGVjaW1hbCArPSAxO1xuICAgICAgICAvL211bHRpcGx5IHRoZSBkZWNpbWFsIHdpdGggMiB0byB0aGUgcG93ZXIgb2YgdGhlIGV4cG9uZW50IC0gMTI3XG4gICAgICAgIGRlY2ltYWwgKj0gTWF0aC5wb3coMiwgdGhpcy5leHBvbmVudCAtIDEyNyk7XG4gICAgICAgIC8vaWYgdGhlIHNpZ24gaXMgMSwgdGhlIG51bWJlciBpcyBuZWdhdGl2ZVxuICAgICAgICBpZiAodGhpcy5zaWduID09PSAxKSB7XG4gICAgICAgICAgICBkZWNpbWFsICo9IC0xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWNpbWFsLnRvU3RyaW5nKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG91YmxlUHJlY2lzaW9uIGV4dGVuZHMgQmluYXJ5RmxvYXQge1xuICAgIGdldEZsb2F0RGVjaW1hbCgpOiBzdHJpbmcge1xuICAgICAgICAvL2NvbnZlcnQgdGhlIG1hbnRpc3NhIHRvIGRlY2ltYWxcbiAgICAgICAgbGV0IG1hbnRpc3NhID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hbnRpc3NhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYW50aXNzYSArPSBwYXJzZUludCh0aGlzLm1hbnRpc3NhW2ldKSAqIE1hdGgucG93KDIsIC0xICogKGkgKyAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy9hZGQgMSB0byB0aGUgbWFudGlzc2FcbiAgICAgICAgbWFudGlzc2EgKz0gMTtcbiAgICAgICAgLy9tdWx0aXBseSB0aGUgbWFudGlzc2Egd2l0aCAyIHRvIHRoZSBwb3dlciBvZiB0aGUgZXhwb25lbnQgLSAxMjdcbiAgICAgICAgbWFudGlzc2EgKj0gTWF0aC5wb3coMiwgdGhpcy5leHBvbmVudCAtIDEwMjMpO1xuICAgICAgICAvL2lmIHRoZSBzaWduIGlzIDEsIHRoZSBudW1iZXIgaXMgbmVnYXRpdmVcbiAgICAgICAgaWYgKHRoaXMuc2lnbiA9PT0gMSkge1xuICAgICAgICAgICAgbWFudGlzc2EgKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hbnRpc3NhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKG51bWJlcjogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKG51bWJlcik7XG4gICAgfVxuXG4gICAgc2V0RXhwb25lbnRBbmRNYW50aXNzYSgpOiB2b2lkIHtcbiAgICAgICAgLy90aGUgZXhwb25lbnQgaXMgaG93IG1hbnkgcGxhY2VzIHRoZSBjb21tYSBoYXMgdG8gYmUgbW92ZWQsIHNvIHRoYXQgb25seSBhIDEgaXMgYXQgdGhlIGZyb250ICsgMTI3XG4gICAgICAgIC8vaWYgdGhlIG51bWJlciBpcyBuZWdhdGl2ZSwgdGhlIGV4cG9uZW50IGlzIDEyNyAtIHRoZSBudW1iZXIgb2YgcGxhY2VzIHRoZSBjb21tYSBoYXMgdG8gYmUgbW92ZWRcbiAgICAgICAgY29uc3QgeyBkZWx0YSwgbWFudGlzc2EgfSA9IG5vcm1hbGl6ZU51bWJlcih0aGlzLmZpeGVkQmluYXJ5KTtcbiAgICAgICAgdGhpcy5leHBvbmVudCA9IGRlbHRhICsgMTAyMztcbiAgICAgICAgdGhpcy5tYW50aXNzYSA9IG1hbnRpc3NhO1xuICAgIH1cblxuICAgIGdldE1hbnRpc3NhKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbnRpc3NhO1xuICAgIH1cblxuICAgIHNldFNpZ24oKTogdm9pZCB7XG4gICAgICAgIC8vaWYgdGhlIG51bWJlciBpcyBuZWdhdGl2ZSByZXR1cm4gMVxuICAgICAgICAvL2lmIHRoZSBudW1iZXIgaXMgcG9zaXRpdmUgcmV0dXJuIDBcbiAgICAgICAgaWYgKHRoaXMuZml4ZWRCaW5hcnlbMF0gPT09IFwiLVwiKSB7XG4gICAgICAgICAgICB0aGlzLnNpZ24gPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zaWduID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEZsb2F0QmluYXJ5KCk6IHZvaWQge1xuICAgICAgICAvL2NoZWNrIGlmIHRoZSBtYW50aXNzYSBpcyBsb25nZXIgdGhhbiAyMyBiaXRzXG4gICAgICAgIGlmICh0aGlzLm1hbnRpc3NhLmxlbmd0aCA+IDUyKSB7XG4gICAgICAgICAgICAvL2lmIGl0IGlzLCBjdXQgb2ZmIHRoZSByZXN0XG4gICAgICAgICAgICB0aGlzLm1hbnRpc3NhID0gdGhpcy5tYW50aXNzYS5zbGljZSgwLCA1Mik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZsb2F0QmluYXJ5ID1cbiAgICAgICAgICAgIHRoaXMuc2lnbi50b1N0cmluZygpICtcbiAgICAgICAgICAgIFwiIFwiICtcbiAgICAgICAgICAgIHRoaXMuZXhwb25lbnQudG9TdHJpbmcoMikgK1xuICAgICAgICAgICAgXCIwXCIucmVwZWF0KDExIC0gdGhpcy5leHBvbmVudC50b1N0cmluZygyKS5sZW5ndGgpICtcbiAgICAgICAgICAgIFwiIFwiICtcbiAgICAgICAgICAgIHRoaXMubWFudGlzc2EgK1xuICAgICAgICAgICAgXCIwXCIucmVwZWF0KDUyIC0gdGhpcy5tYW50aXNzYS5sZW5ndGgpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkZWx0YSAoZXhwb25lbnQpIGFuZCB0aGUgbWFudGlzc2Egb2YgdGhlIG5vcm1hbGl6ZWQgbnVtYmVyXG4gKiBAcGFyYW0gZml4ZWRQb2ludCB0aGUgbnVtYmVyIHRvIG5vcm1hbGl6ZSBpbiB0aGUgZm9ybSBvZiBhIGZpeGVkIHBvaW50IGJpbmFyeSBudW1iZXJcbiAqIEByZXR1cm5zIHt7ZGVsdGE6IG51bWJlciwgbWFudGlzc2E6IHN0cmluZ319XG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZU51bWJlcihmaXhlZFBvaW50OiBzdHJpbmcpOiB7IGRlbHRhOiBudW1iZXI7IG1hbnRpc3NhOiBzdHJpbmc7IH0ge1xuICAgIC8vaWYgdGhlIG51bWJlciBpcyBuZWdhdGl2ZSwgcmVtb3ZlIHRoZSBtaW51cyBzaWduXG4gICAgZml4ZWRQb2ludCA9IGZpeGVkUG9pbnQucmVwbGFjZShcIi1cIiwgXCJcIik7XG4gICAgLy9pZiB0aGUgbnVtYmVyIGlzIHBvc2l0aXZlLCByZW1vdmUgdGhlIHBsdXMgc2lnblxuICAgIGZpeGVkUG9pbnQgPSBmaXhlZFBvaW50LnJlcGxhY2UoXCIrXCIsIFwiXCIpO1xuXG4gICAgLy9ub3JtYWxpemUgY29tbWEgbm90YXRpb25cbiAgICBmaXhlZFBvaW50ID0gZml4ZWRQb2ludC5yZXBsYWNlKFwiLFwiLCBcIi5cIik7XG5cbiAgICAvL2NvbnZlcnQgdGhlIG51bWJlciB0byBhbiBhcnJheVxuICAgIGxldCBmaXhlZFBvaW50QXJyYXkgPSBmaXhlZFBvaW50LnNwbGl0KFwiXCIpO1xuICAgIC8vZmluZCB0aGUgY2xvc2VzdCAxIHRvIHRoZSBjb21tYVxuICAgIGNvbnN0IGNvbW1hSW5kZXggPSBmaXhlZFBvaW50QXJyYXkuaW5kZXhPZihcIi5cIik7XG5cbiAgICBsZXQgY2xvc2VzdE9uZUluZGV4ID0gTmFOO1xuXG4gICAgY29uc3QgZmFydGhlc3RPbmVJbmRleCA9IE5hTjtcblxuICAgIGZpeGVkUG9pbnRBcnJheSA9IGZpeGVkUG9pbnRBcnJheS5maWx0ZXIoZnVuY3Rpb24obGV0dGVyKSB7XG4gICAgICAgIHJldHVybiBsZXR0ZXIgIT0gXCIsXCI7XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhmaXhlZFBvaW50QXJyYXkpO1xuXG4gICAgLy9maW5kIGZpcnN0IDFcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpeGVkUG9pbnRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZml4ZWRQb2ludEFycmF5W2ldID09PSBcIjFcIikge1xuICAgICAgICAgICAgY2xvc2VzdE9uZUluZGV4ID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJjbG9zZXN0IG9uZSBpbmRleDogXCIgKyBjbG9zZXN0T25lSW5kZXgpO1xuICAgIGNvbnNvbGUubG9nKFwiY29tbWEgaW5kZXg6IFwiICsgY29tbWFJbmRleCk7XG4gICAgY29uc3QgZXhwb25lbnQgPSBjb21tYUluZGV4IC0gY2xvc2VzdE9uZUluZGV4O1xuXG4gICAgLy9jYWxjdWxhdGUgdGhlIGRlbHRhXG4gICAgbGV0IG1hbnRpc3NhOiBzdHJpbmc7XG5cbiAgICBjb25zb2xlLmxvZyhleHBvbmVudCk7XG5cbiAgICBpZiAoIWlzTmFOKGZhcnRoZXN0T25lSW5kZXgpKSB7XG4gICAgICAgIG1hbnRpc3NhID0gZml4ZWRQb2ludEFycmF5XG4gICAgICAgICAgICAuc2xpY2UoZmFydGhlc3RPbmVJbmRleCArIDEpXG4gICAgICAgICAgICAuam9pbihcIlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoXCIsXCIsIFwiXCIpXG4gICAgICAgICAgICAucmVwbGFjZShcIi5cIiwgXCJcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWFudGlzc2EgPSBmaXhlZFBvaW50QXJyYXlcbiAgICAgICAgICAgIC5zbGljZShjbG9zZXN0T25lSW5kZXggKyAxKVxuICAgICAgICAgICAgLmpvaW4oXCJcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKFwiLFwiLCBcIlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGRlbHRhOiBleHBvbmVudCxcbiAgICAgICAgbWFudGlzc2E6IG1hbnRpc3NhLFxuICAgIH07XG59XG4iLCAiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgYmluRmxvYXQsIGRvdWJsZVByZWNGbG9hdCwgc2luZ2xlUHJlY0Zsb2F0LCBTdGF0ZSB9IGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgeyBEb3VibGVQcmVjaXNpb24sIFNpbmdsZVByZWNpc2lvbiB9IGZyb20gXCIuL0Zsb2F0XCI7XG5cbmZ1bmN0aW9uIGdldFNpZ24obnVtYmVyOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbnVtYmVyLnNsaWNlKDAsIDEpID09IFwiLVwiID8gXCItXCIgOiBcIlwiO1xufVxuXG5mdW5jdGlvbiBiaW5hcnlDb21tYVBhcnNlcihudW1iZXI6IHN0cmluZywgc2V0U3RhdGU6ICh2YWx1ZTogKChwcmV2U3RhdGU6IFN0YXRlKSA9PiBTdGF0ZSkgfCBTdGF0ZSkgPT4gdm9pZCkge1xuICAgIC8vdGhlIGlucHV0IGlzIGEgYmluYXJ5IG51bWJlciB3aXRoIGEgY29tbWFcbiAgICAvL2NhbGN1bGF0ZSB0aGUgZmxvYXRpbmcgcG9pbnQgbnVtYmVyIGluIHNpbmdsZSBwcmVjaXNpb24gYW5kIGRvdWJsZSBwcmVjaXNpb25cbiAgICBjb25zdCBzaW5nbGVQcmVjQmluRmxvYXQgPSBuZXcgU2luZ2xlUHJlY2lzaW9uKG51bWJlcik7XG4gICAgY29uc3QgZG91YmxlUHJlY0JpbkZsb2F0ID0gbmV3IERvdWJsZVByZWNpc2lvbihudW1iZXIpO1xuXG4gICAgLy9jb252ZXJ0IHRoZSBmbG9hdGluZyBwb2ludCBudW1iZXJzIHRvIGRlY2ltYWxcbiAgICBjb25zdCBzaW5nbGVQcmVjRGVjID0gc2luZ2xlUHJlY0JpbkZsb2F0LmdldEZsb2F0RGVjaW1hbCgpO1xuICAgIGNvbnN0IGRvdWJsZVByZWNEZWMgPSBkb3VibGVQcmVjQmluRmxvYXQuZ2V0RmxvYXREZWNpbWFsKCk7XG5cbiAgICAvL2NvbnZlcnQgdGhlIGZpeGVkIHBvaW50IG51bWJlcnMgdG8gZGVjaW1hbFxuICAgIGNvbnN0IGZpeGVkUG9pbnRBcnJheSA9IG51bWJlci5pbmNsdWRlcyhcIixcIikgPyBudW1iZXIuc3BsaXQoXCIsXCIpIDogbnVtYmVyLnNwbGl0KFwiLlwiKTtcbiAgICBjb25zdCBmaXhlZFBvaW50RGVjID1cbiAgICAgICAgbnVtYmVyLnNsaWNlKDAsIDEpICtcbiAgICAgICAgcGFyc2VJbnQoZml4ZWRQb2ludEFycmF5WzBdLCAyKSArXG4gICAgICAgIHBhcnNlSW50KGZpeGVkUG9pbnRBcnJheVsxXSwgMikgLyAyICoqIGZpeGVkUG9pbnRBcnJheVsxXS5sZW5ndGg7XG5cbiAgICBzZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0VHlwZTogSW5wdXRUeXBlLkJpbmFyeUNvbW1hLFxuICAgICAgICBiaW5OdW1iZXI6IG51bWJlcixcbiAgICAgICAgZGVjTnVtYmVyOiBmaXhlZFBvaW50RGVjLnRvU3RyaW5nKCksXG4gICAgICAgIGhleE51bWJlcjogXCJcIixcbiAgICAgICAgYmluRmxvYXQ6IHtcbiAgICAgICAgICAgIHNpbmdsZVByZWNpc2lvbjoge1xuICAgICAgICAgICAgICAgIHNpZ246IHNpbmdsZVByZWNCaW5GbG9hdC5nZXRTaWduKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBleHBvbmVudDogc2luZ2xlUHJlY0JpbkZsb2F0LmdldEV4cG9uZW50KCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBtYW50aXNzYTogc2luZ2xlUHJlY0JpbkZsb2F0LmdldE1hbnRpc3NhKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBmbG9hdGluZ1BvaW50OiBzaW5nbGVQcmVjQmluRmxvYXQuZ2V0RmxvYXRCaW5hcnkoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGZsb2F0RGVjaW1hbDogc2luZ2xlUHJlY0RlYy50b1N0cmluZygpLFxuICAgICAgICAgICAgfSBhcyBzaW5nbGVQcmVjRmxvYXQsXG4gICAgICAgICAgICBkb3VibGVQcmVjaXNpb246IHtcbiAgICAgICAgICAgICAgICBzaWduOiBkb3VibGVQcmVjQmluRmxvYXQuZ2V0U2lnbigpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgZXhwb25lbnQ6IGRvdWJsZVByZWNCaW5GbG9hdC5nZXRFeHBvbmVudCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgbWFudGlzc2E6IGRvdWJsZVByZWNCaW5GbG9hdC5nZXRNYW50aXNzYSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgZmxvYXRpbmdQb2ludDogZG91YmxlUHJlY0JpbkZsb2F0LmdldEZsb2F0QmluYXJ5KCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBmbG9hdERlY2ltYWw6IGRvdWJsZVByZWNEZWMudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIH0gYXMgZG91YmxlUHJlY0Zsb2F0LFxuICAgICAgICB9IGFzIHVua25vd24gYXMgYmluRmxvYXQsXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlY2ltYWxDb21tYVBhcnNlcihudW1iZXI6IHN0cmluZywgc2V0U3RhdGU6ICh2YWx1ZTogKChwcmV2U3RhdGU6IFN0YXRlKSA9PiBTdGF0ZSkgfCBTdGF0ZSkgPT4gdm9pZCkge1xuICAgIC8vY29udmVydCB0aGUgZGVjaW1hbCBjb21tYSBudW1iZXIgdG8gYSBmaXhlZCBmbG9hdCBiaW5hcnkgbnVtYmVyXG4gICAgY29uc3QgZml4ZWRQb2ludEFycmF5ID0gbnVtYmVyLmluY2x1ZGVzKFwiLFwiKSA/IG51bWJlci5zcGxpdChcIixcIikgOiBudW1iZXIuc3BsaXQoXCIuXCIpO1xuICAgIGNvbnN0IGZpeGVkUG9pbnRCaW5GaXJzdFBhcnQgPSBwYXJzZUludChmaXhlZFBvaW50QXJyYXlbMF0pLnRvU3RyaW5nKDIpO1xuXG4gICAgbGV0IGJpbmFyeVJlcCA9IFwiXCI7XG4gICAgY29uc3QgZGVtaWFsU3RyaW5nID0gXCIwLlwiICsgZml4ZWRQb2ludEFycmF5WzFdO1xuICAgIGxldCBkZWNpbWFsUmVwID0gcGFyc2VGbG9hdChkZW1pYWxTdHJpbmcpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2NCAmJiBkZWNpbWFsUmVwICE9IDA7IGkrKykge1xuICAgICAgICBpZiAoZGVjaW1hbFJlcCA+PSAxKSB7XG4gICAgICAgICAgICBiaW5hcnlSZXAgKz0gXCIxXCI7XG4gICAgICAgICAgICBkZWNpbWFsUmVwLS07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiaW5hcnlSZXAgKz0gXCIwXCI7XG4gICAgICAgIH1cbiAgICAgICAgZGVjaW1hbFJlcCAqPSAyO1xuICAgIH1cblxuICAgIGNvbnN0IGZpeGVkUG9pbnRCaW4gPSBnZXRTaWduKG51bWJlcikgKyBmaXhlZFBvaW50QmluRmlyc3RQYXJ0ICsgXCIuXCIgKyBiaW5hcnlSZXAuc2xpY2UoMSk7XG5cbiAgICAvL2NhbGN1bGF0ZSB0aGUgZmxvYXRpbmcgcG9pbnQgbnVtYmVyIGluIHNpbmdsZSBwcmVjaXNpb24gYW5kIGRvdWJsZSBwcmVjaXNpb25cbiAgICBjb25zdCBzaW5nbGVQcmVjQmluRmxvYXQgPSBuZXcgU2luZ2xlUHJlY2lzaW9uKGZpeGVkUG9pbnRCaW4pO1xuICAgIGNvbnN0IGRvdWJsZVByZWNCaW5GbG9hdCA9IG5ldyBEb3VibGVQcmVjaXNpb24oZml4ZWRQb2ludEJpbik7XG5cbiAgICBzZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0VHlwZTogSW5wdXRUeXBlLkRlY2ltYWxDb21tYSxcbiAgICAgICAgYmluTnVtYmVyOiBnZXRTaWduKG51bWJlcikgPT0gXCItXCIgPyBmaXhlZFBvaW50QmluLnNsaWNlKDAsIDEwKSA6IGZpeGVkUG9pbnRCaW4uc2xpY2UoMCwgOSksXG4gICAgICAgIGRlY051bWJlcjogbnVtYmVyLFxuICAgICAgICBoZXhOdW1iZXI6IFwiXCIsXG4gICAgICAgIGJpbkZsb2F0OiB7XG4gICAgICAgICAgICBzaW5nbGVQcmVjaXNpb246IHtcbiAgICAgICAgICAgICAgICBzaWduOiBzaW5nbGVQcmVjQmluRmxvYXQuZ2V0U2lnbigpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgZXhwb25lbnQ6IHNpbmdsZVByZWNCaW5GbG9hdC5nZXRFeHBvbmVudCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgbWFudGlzc2E6IHNpbmdsZVByZWNCaW5GbG9hdC5nZXRNYW50aXNzYSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgZmxvYXRpbmdQb2ludDogc2luZ2xlUHJlY0JpbkZsb2F0LmdldEZsb2F0QmluYXJ5KCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBmbG9hdERlY2ltYWw6IHNpbmdsZVByZWNCaW5GbG9hdC5nZXRGbG9hdERlY2ltYWwoKSxcbiAgICAgICAgICAgIH0gYXMgc2luZ2xlUHJlY0Zsb2F0LFxuICAgICAgICAgICAgZG91YmxlUHJlY2lzaW9uOiB7XG4gICAgICAgICAgICAgICAgc2lnbjogZG91YmxlUHJlY0JpbkZsb2F0LmdldFNpZ24oKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGV4cG9uZW50OiBkb3VibGVQcmVjQmluRmxvYXQuZ2V0RXhwb25lbnQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIG1hbnRpc3NhOiBkb3VibGVQcmVjQmluRmxvYXQuZ2V0TWFudGlzc2EoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGZsb2F0aW5nUG9pbnQ6IGRvdWJsZVByZWNCaW5GbG9hdC5nZXRGbG9hdEJpbmFyeSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgZmxvYXREZWNpbWFsOiBkb3VibGVQcmVjQmluRmxvYXQuZ2V0RmxvYXREZWNpbWFsKCksXG4gICAgICAgICAgICB9IGFzIGRvdWJsZVByZWNGbG9hdCxcbiAgICAgICAgfSBhcyB1bmtub3duIGFzIGJpbkZsb2F0LFxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VJbnB1dE51bWJlcihudW1iZXI6IHN0cmluZywgc2V0U3RhdGU6IFJlYWN0LkRpc3BhdGNoPFJlYWN0LlNldFN0YXRlQWN0aW9uPFN0YXRlPj4pIHtcbiAgICBudW1iZXIgPSBudW1iZXIucmVwbGFjZUFsbChcIiBcIiwgXCJcIik7XG4gICAgY29uc29sZS5sb2cobnVtYmVyKTtcbiAgICBpZiAoXG4gICAgICAgIG51bWJlclxuICAgICAgICAgICAgLnJlcGxhY2UoXCItXCIsIFwiXCIpXG4gICAgICAgICAgICAuc2xpY2UoMilcbiAgICAgICAgICAgIC5tYXRjaCgvXi0/WzAtMV0rWywuXVswLTFdKyQvKSAmJlxuICAgICAgICBudW1iZXIucmVwbGFjZShcIi1cIiwgXCJcIikuc2xpY2UoMCwgMikgPT0gXCIwYlwiXG4gICAgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmluYXJ5IGNvbW1hXCIpO1xuICAgICAgICBiaW5hcnlDb21tYVBhcnNlcihudW1iZXIsIHNldFN0YXRlKTtcbiAgICB9XG4gICAgLy9jaGVjayBmb3IgZGVjaW1hbCB3aXRoIGNvbW1hXG4gICAgZWxzZSBpZiAobnVtYmVyLm1hdGNoKC9eLT9bMC05XStbLixdWzAtOV0rJC8pKSB7XG4gICAgICAgIGRlY2ltYWxDb21tYVBhcnNlcihudW1iZXIsIHNldFN0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0aGUgaW5wdXQgY2FuIGJlIGFzIGxvbmcgYXMgd2Ugd2FudCBhbmQgY2FuIGJlIGEgbWl4IG9mIGRpZmZlcmVudCB0eXBlc1xuICAgICAgICAvLyBzcGxpdCB0aGUgaW5wdXQgaW50byBhbiBhcnJheSBvZiBudW1iZXJzIGFuZCBvcGVyYXRvcnNcbiAgICAgICAgY29uc3QgbnVtYmVyQXJyYXkgPSBudW1iZXIuc3BsaXQoLyhbKyovJV4tXSkvKTtcblxuICAgICAgICBjb25zdCBjb252ZXJ0ZWRBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChudW1iZXJBcnJheVtpXSAhPSBcIlwiICYmICFudW1iZXJBcnJheVtpXS5tYXRjaCgvKFsrKi8lXi1dKS8pKSB7XG4gICAgICAgICAgICAgICAgY29udmVydGVkQXJyYXkucHVzaChjb252ZXJ0VG9EZWMobnVtYmVyQXJyYXlbaV0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udmVydGVkQXJyYXkucHVzaChudW1iZXJBcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhjb252ZXJ0ZWRBcnJheSk7XG5cbiAgICAgICAgLy9sb29wIHRocm91Z2ggdGhlIGNvbnZlcnRlZCBhcnJheSBhbmQgY2FsY3VsYXRlIHRoZSByZXN1bHQgYnkgdXNpbmcgdGhlIG9wZXJhdG9yIG9uIHRoZSBudW1iZXJzXG4gICAgICAgIGxldCByZXN1bHQgPSBjb252ZXJ0ZWRBcnJheVswXSBhcyB7IG51bWJlcjogbnVtYmVyOyB0eXBlOiBJbnB1dFR5cGUgfTtcbiAgICAgICAgY29uc3QgaW5wdXRzID0gW3Jlc3VsdC50eXBlXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb252ZXJ0ZWRBcnJheS5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSBjb252ZXJ0ZWRBcnJheVtpXSBhcyBzdHJpbmc7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRlZEFycmF5W2kgKyAxXSBhcyB7IG51bWJlcjogbnVtYmVyOyB0eXBlOiBJbnB1dFR5cGUgfTtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5udW1iZXIgPT0gdW5kZWZpbmVkIHx8IHJlc3VsdC5udW1iZXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnB1dHMucHVzaChvcGVyYXRvciBhcyBJbnB1dFR5cGUpO1xuICAgICAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgICAgIGNhc2UgXCIrXCI6XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5udW1iZXIgKz0gdmFsdWUubnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaCh2YWx1ZS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lm51bWJlciAtPSB2YWx1ZS5udW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKHZhbHVlLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiKlwiOlxuICAgICAgICAgICAgICAgICAgICByZXN1bHQubnVtYmVyICo9IHZhbHVlLm51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzLnB1c2godmFsdWUudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCIvXCI6XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5udW1iZXIgLz0gdmFsdWUubnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHMucHVzaCh2YWx1ZS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lm51bWJlciAlPSB2YWx1ZS5udW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKHZhbHVlLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiXlwiOlxuICAgICAgICAgICAgICAgICAgICByZXN1bHQubnVtYmVyICoqPSB2YWx1ZS5udW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKHZhbHVlLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQubnVtYmVyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmVzdWx0ID0geyBudW1iZXI6IDAsIHR5cGU6IElucHV0VHlwZS5Ob25lIH07XG4gICAgICAgIH1cblxuICAgICAgICAvL2NvbnZlcnQgaW5wdXRzIHRvIHN0cmluZ1xuICAgICAgICBzZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFR5cGU6IGlucHV0cy50b1N0cmluZygpLnJlcGxhY2VBbGwoXCIsXCIsIFwiIFwiKSA/PyBcIlwiLFxuICAgICAgICAgICAgYmluTnVtYmVyOiByZXN1bHQubnVtYmVyLnRvU3RyaW5nKDIpLFxuICAgICAgICAgICAgZGVjTnVtYmVyOiByZXN1bHQubnVtYmVyLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBoZXhOdW1iZXI6IHJlc3VsdC5udW1iZXIudG9TdHJpbmcoMTYpLFxuICAgICAgICAgICAgYmluRmxvYXQ6IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0VG9EZWMobnVtYmVyOiBzdHJpbmcpIHtcbiAgICBjb25zdCByYWRpeFRhYmxlOiBhbnkgPSB7XG4gICAgICAgIFwiMGJcIjogeyByYWRpeDogMiwgdHlwZTogSW5wdXRUeXBlLkJpbmFyeSB9LFxuICAgICAgICBcIjB4XCI6IHsgcmFkaXg6IDE2LCB0eXBlOiBJbnB1dFR5cGUuSGV4YWRlY2ltYWwgfSxcbiAgICAgICAgXCIwb1wiOiB7IHJhZGl4OiA4LCB0eXBlOiBJbnB1dFR5cGUuT2N0YWwgfSxcbiAgICB9O1xuICAgIGxldCByYWRpeCA9IDEwO1xuICAgIGxldCBpbnB1dFR5cGUgPSBJbnB1dFR5cGUuRGVjaW1hbDtcbiAgICBpZiAobnVtYmVyLnNsaWNlKDAsIDIpIGluIHJhZGl4VGFibGUpIHtcbiAgICAgICAgcmFkaXggPSByYWRpeFRhYmxlW251bWJlci5zbGljZSgwLCAyKV0ucmFkaXg7XG4gICAgICAgIGlucHV0VHlwZSA9IHJhZGl4VGFibGVbbnVtYmVyLnNsaWNlKDAsIDIpXS50eXBlO1xuICAgICAgICBudW1iZXIgPSBudW1iZXIuc2xpY2UoMik7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIG51bWJlcjogcGFyc2VJbnQobnVtYmVyLCByYWRpeCksXG4gICAgICAgIHR5cGU6IGlucHV0VHlwZSxcbiAgICB9O1xufVxuXG5leHBvcnQgZW51bSBJbnB1dFR5cGUge1xuICAgIE5vbmUgPSBcIlwiLFxuICAgIEJpbmFyeSA9IFwiQmluYXJ5XCIsXG4gICAgRGVjaW1hbCA9IFwiRGVjaW1hbFwiLFxuICAgIEhleGFkZWNpbWFsID0gXCJIZXhhZGVjaW1hbFwiLFxuICAgIE9jdGFsID0gXCJPY3RhbFwiLFxuICAgIEJpbmFyeUNvbW1hID0gXCJCaW5hcnkgd2l0aCBjb21tYVwiLFxuICAgIERlY2ltYWxDb21tYSA9IFwiRGVjaW1hbCB3aXRoIGNvbW1hXCIsXG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFBeUI7QUFDekIsaUJBQXFCOzs7QUNEckIsSUFBZSxjQUFmLE1BQTJCO0FBQUEsRUFNYixZQUFZLFFBQWdCO0FBTHRDLGdCQUFPO0FBQ1Asb0JBQVc7QUFDWCxvQkFBVztBQUVYLHVCQUFjO0FBRVYsU0FBSyxjQUFjO0FBQ25CLFNBQUssUUFBUTtBQUNiLFNBQUssdUJBQXVCO0FBQzVCLFNBQUssZUFBZTtBQUFBLEVBQ3hCO0FBQUEsRUFpQkEsY0FBc0I7QUFDbEIsV0FBTyxLQUFLO0FBQUEsRUFDaEI7QUFBQSxFQUVBLGNBQXNCO0FBQ2xCLFdBQU8sS0FBSztBQUFBLEVBQ2hCO0FBQUEsRUFFQSxVQUFrQjtBQUNkLFdBQU8sS0FBSztBQUFBLEVBQ2hCO0FBQUEsRUFFQSxpQkFBeUI7QUFDckIsV0FBTyxLQUFLO0FBQUEsRUFDaEI7QUFHSjtBQUVPLElBQU0sa0JBQU4sY0FBOEIsWUFBWTtBQUFBLEVBQzdDLFlBQVksUUFBZ0I7QUFDeEIsVUFBTSxNQUFNO0FBQUEsRUFDaEI7QUFBQSxFQUVBLHlCQUErQjtBQUczQixVQUFNLEVBQUUsT0FBTyxTQUFTLElBQUksZ0JBQWdCLEtBQUssV0FBVztBQUM1RCxTQUFLLFdBQVcsUUFBUTtBQUN4QixTQUFLLFdBQVc7QUFBQSxFQUNwQjtBQUFBLEVBRUEsY0FBc0I7QUFDbEIsV0FBTyxLQUFLO0FBQUEsRUFDaEI7QUFBQSxFQUVBLFVBQWdCO0FBR1osWUFBUSxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUM7QUFDL0IsUUFBSSxLQUFLLFlBQVksQ0FBQyxNQUFNLEtBQUs7QUFDN0IsV0FBSyxPQUFPO0FBQUEsSUFDaEIsT0FBTztBQUNILFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsRUFDSjtBQUFBLEVBRUEsaUJBQXVCO0FBRW5CLFFBQUksS0FBSyxTQUFTLFNBQVMsSUFBSTtBQUUzQixXQUFLLFdBQVcsS0FBSyxTQUFTLE1BQU0sR0FBRyxFQUFFO0FBQUEsSUFDN0M7QUFFQSxTQUFLLGNBQ0QsS0FBSyxLQUFLLFNBQVMsSUFDbkIsTUFDQSxLQUFLLFNBQVMsU0FBUyxDQUFDLElBQ3hCLElBQUksT0FBTyxJQUFJLEtBQUssU0FBUyxTQUFTLENBQUMsRUFBRSxNQUFNLElBQy9DLE1BQ0EsS0FBSyxXQUNMLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUyxNQUFNO0FBQUEsRUFDNUM7QUFBQSxFQUVBLGtCQUEwQjtBQUV0QixRQUFJLFVBQVU7QUFDZCxhQUFTLElBQUksR0FBRyxJQUFJLEtBQUssU0FBUyxRQUFRLEtBQUs7QUFDM0MsaUJBQVcsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsTUFBTSxJQUFJLEVBQUU7QUFBQSxJQUNwRTtBQUVBLGVBQVc7QUFFWCxlQUFXLEtBQUssSUFBSSxHQUFHLEtBQUssV0FBVyxHQUFHO0FBRTFDLFFBQUksS0FBSyxTQUFTLEdBQUc7QUFDakIsaUJBQVc7QUFBQSxJQUNmO0FBQ0EsV0FBTyxRQUFRLFNBQVM7QUFBQSxFQUM1QjtBQUNKO0FBRU8sSUFBTSxrQkFBTixjQUE4QixZQUFZO0FBQUEsRUFDN0Msa0JBQTBCO0FBRXRCLFFBQUksV0FBVztBQUNmLGFBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxTQUFTLFFBQVEsS0FBSztBQUMzQyxrQkFBWSxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxNQUFNLElBQUksRUFBRTtBQUFBLElBQ3JFO0FBRUEsZ0JBQVk7QUFFWixnQkFBWSxLQUFLLElBQUksR0FBRyxLQUFLLFdBQVcsSUFBSTtBQUU1QyxRQUFJLEtBQUssU0FBUyxHQUFHO0FBQ2pCLGtCQUFZO0FBQUEsSUFDaEI7QUFDQSxXQUFPLFNBQVMsU0FBUztBQUFBLEVBQzdCO0FBQUEsRUFDQSxZQUFZLFFBQWdCO0FBQ3hCLFVBQU0sTUFBTTtBQUFBLEVBQ2hCO0FBQUEsRUFFQSx5QkFBK0I7QUFHM0IsVUFBTSxFQUFFLE9BQU8sU0FBUyxJQUFJLGdCQUFnQixLQUFLLFdBQVc7QUFDNUQsU0FBSyxXQUFXLFFBQVE7QUFDeEIsU0FBSyxXQUFXO0FBQUEsRUFDcEI7QUFBQSxFQUVBLGNBQXNCO0FBQ2xCLFdBQU8sS0FBSztBQUFBLEVBQ2hCO0FBQUEsRUFFQSxVQUFnQjtBQUdaLFFBQUksS0FBSyxZQUFZLENBQUMsTUFBTSxLQUFLO0FBQzdCLFdBQUssT0FBTztBQUFBLElBQ2hCLE9BQU87QUFDSCxXQUFLLE9BQU87QUFBQSxJQUNoQjtBQUFBLEVBQ0o7QUFBQSxFQUVBLGlCQUF1QjtBQUVuQixRQUFJLEtBQUssU0FBUyxTQUFTLElBQUk7QUFFM0IsV0FBSyxXQUFXLEtBQUssU0FBUyxNQUFNLEdBQUcsRUFBRTtBQUFBLElBQzdDO0FBRUEsU0FBSyxjQUNELEtBQUssS0FBSyxTQUFTLElBQ25CLE1BQ0EsS0FBSyxTQUFTLFNBQVMsQ0FBQyxJQUN4QixJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsU0FBUyxDQUFDLEVBQUUsTUFBTSxJQUNoRCxNQUNBLEtBQUssV0FDTCxJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsTUFBTTtBQUFBLEVBQzVDO0FBQ0o7QUFPQSxTQUFTLGdCQUFnQixZQUEwRDtBQUUvRSxlQUFhLFdBQVcsUUFBUSxLQUFLLEVBQUU7QUFFdkMsZUFBYSxXQUFXLFFBQVEsS0FBSyxFQUFFO0FBR3ZDLGVBQWEsV0FBVyxRQUFRLEtBQUssR0FBRztBQUd4QyxNQUFJLGtCQUFrQixXQUFXLE1BQU0sRUFBRTtBQUV6QyxRQUFNLGFBQWEsZ0JBQWdCLFFBQVEsR0FBRztBQUU5QyxNQUFJLGtCQUFrQjtBQUV0QixRQUFNLG1CQUFtQjtBQUV6QixvQkFBa0IsZ0JBQWdCLE9BQU8sU0FBUyxRQUFRO0FBQ3RELFdBQU8sVUFBVTtBQUFBLEVBQ3JCLENBQUM7QUFFRCxVQUFRLElBQUksZUFBZTtBQUczQixXQUFTLElBQUksR0FBRyxJQUFJLGdCQUFnQixRQUFRLEtBQUs7QUFDN0MsUUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEtBQUs7QUFDNUIsd0JBQWtCO0FBQ2xCO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFFQSxVQUFRLElBQUksd0JBQXdCLGVBQWU7QUFDbkQsVUFBUSxJQUFJLGtCQUFrQixVQUFVO0FBQ3hDLFFBQU0sV0FBVyxhQUFhO0FBRzlCLE1BQUk7QUFFSixVQUFRLElBQUksUUFBUTtBQUVwQixNQUFJLENBQUMsTUFBTSxnQkFBZ0IsR0FBRztBQUMxQixlQUFXLGdCQUNOLE1BQU0sbUJBQW1CLENBQUMsRUFDMUIsS0FBSyxFQUFFLEVBQ1AsUUFBUSxLQUFLLEVBQUUsRUFDZixRQUFRLEtBQUssRUFBRTtBQUFBLEVBQ3hCLE9BQU87QUFDSCxlQUFXLGdCQUNOLE1BQU0sa0JBQWtCLENBQUMsRUFDekIsS0FBSyxFQUFFLEVBQ1AsUUFBUSxLQUFLLEVBQUUsRUFDZixRQUFRLEtBQUssRUFBRTtBQUFBLEVBQ3hCO0FBRUEsU0FBTztBQUFBLElBQ0gsT0FBTztBQUFBLElBQ1A7QUFBQSxFQUNKO0FBQ0o7OztBQ3ZPQSxTQUFTLFFBQVEsUUFBZ0I7QUFDN0IsU0FBTyxPQUFPLE1BQU0sR0FBRyxDQUFDLEtBQUssTUFBTSxNQUFNO0FBQzdDO0FBRUEsU0FBUyxrQkFBa0IsUUFBZ0IsVUFBa0U7QUFHekcsUUFBTSxxQkFBcUIsSUFBSSxnQkFBZ0IsTUFBTTtBQUNyRCxRQUFNLHFCQUFxQixJQUFJLGdCQUFnQixNQUFNO0FBR3JELFFBQU0sZ0JBQWdCLG1CQUFtQixnQkFBZ0I7QUFDekQsUUFBTSxnQkFBZ0IsbUJBQW1CLGdCQUFnQjtBQUd6RCxRQUFNLGtCQUFrQixPQUFPLFNBQVMsR0FBRyxJQUFJLE9BQU8sTUFBTSxHQUFHLElBQUksT0FBTyxNQUFNLEdBQUc7QUFDbkYsUUFBTSxnQkFDRixPQUFPLE1BQU0sR0FBRyxDQUFDLElBQ2pCLFNBQVMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQzlCLFNBQVMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxnQkFBZ0IsQ0FBQyxFQUFFO0FBRTlELFdBQVM7QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFdBQVcsY0FBYyxTQUFTO0FBQUEsSUFDbEMsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLE1BQ04saUJBQWlCO0FBQUEsUUFDYixNQUFNLG1CQUFtQixRQUFRLEVBQUUsU0FBUztBQUFBLFFBQzVDLFVBQVUsbUJBQW1CLFlBQVksRUFBRSxTQUFTO0FBQUEsUUFDcEQsVUFBVSxtQkFBbUIsWUFBWSxFQUFFLFNBQVM7QUFBQSxRQUNwRCxlQUFlLG1CQUFtQixlQUFlLEVBQUUsU0FBUztBQUFBLFFBQzVELGNBQWMsY0FBYyxTQUFTO0FBQUEsTUFDekM7QUFBQSxNQUNBLGlCQUFpQjtBQUFBLFFBQ2IsTUFBTSxtQkFBbUIsUUFBUSxFQUFFLFNBQVM7QUFBQSxRQUM1QyxVQUFVLG1CQUFtQixZQUFZLEVBQUUsU0FBUztBQUFBLFFBQ3BELFVBQVUsbUJBQW1CLFlBQVksRUFBRSxTQUFTO0FBQUEsUUFDcEQsZUFBZSxtQkFBbUIsZUFBZSxFQUFFLFNBQVM7QUFBQSxRQUM1RCxjQUFjLGNBQWMsU0FBUztBQUFBLE1BQ3pDO0FBQUEsSUFDSjtBQUFBLEVBQ0osQ0FBQztBQUNMO0FBRUEsU0FBUyxtQkFBbUIsUUFBZ0IsVUFBa0U7QUFFMUcsUUFBTSxrQkFBa0IsT0FBTyxTQUFTLEdBQUcsSUFBSSxPQUFPLE1BQU0sR0FBRyxJQUFJLE9BQU8sTUFBTSxHQUFHO0FBQ25GLFFBQU0seUJBQXlCLFNBQVMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQztBQUV0RSxNQUFJLFlBQVk7QUFDaEIsUUFBTSxlQUFlLE9BQU8sZ0JBQWdCLENBQUM7QUFDN0MsTUFBSSxhQUFhLFdBQVcsWUFBWTtBQUV4QyxXQUFTLElBQUksR0FBRyxJQUFJLE1BQU0sY0FBYyxHQUFHLEtBQUs7QUFDNUMsUUFBSSxjQUFjLEdBQUc7QUFDakIsbUJBQWE7QUFDYjtBQUFBLElBQ0osT0FBTztBQUNILG1CQUFhO0FBQUEsSUFDakI7QUFDQSxrQkFBYztBQUFBLEVBQ2xCO0FBRUEsUUFBTSxnQkFBZ0IsUUFBUSxNQUFNLElBQUkseUJBQXlCLE1BQU0sVUFBVSxNQUFNLENBQUM7QUFHeEYsUUFBTSxxQkFBcUIsSUFBSSxnQkFBZ0IsYUFBYTtBQUM1RCxRQUFNLHFCQUFxQixJQUFJLGdCQUFnQixhQUFhO0FBRTVELFdBQVM7QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLFdBQVcsUUFBUSxNQUFNLEtBQUssTUFBTSxjQUFjLE1BQU0sR0FBRyxFQUFFLElBQUksY0FBYyxNQUFNLEdBQUcsQ0FBQztBQUFBLElBQ3pGLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxNQUNOLGlCQUFpQjtBQUFBLFFBQ2IsTUFBTSxtQkFBbUIsUUFBUSxFQUFFLFNBQVM7QUFBQSxRQUM1QyxVQUFVLG1CQUFtQixZQUFZLEVBQUUsU0FBUztBQUFBLFFBQ3BELFVBQVUsbUJBQW1CLFlBQVksRUFBRSxTQUFTO0FBQUEsUUFDcEQsZUFBZSxtQkFBbUIsZUFBZSxFQUFFLFNBQVM7QUFBQSxRQUM1RCxjQUFjLG1CQUFtQixnQkFBZ0I7QUFBQSxNQUNyRDtBQUFBLE1BQ0EsaUJBQWlCO0FBQUEsUUFDYixNQUFNLG1CQUFtQixRQUFRLEVBQUUsU0FBUztBQUFBLFFBQzVDLFVBQVUsbUJBQW1CLFlBQVksRUFBRSxTQUFTO0FBQUEsUUFDcEQsVUFBVSxtQkFBbUIsWUFBWSxFQUFFLFNBQVM7QUFBQSxRQUNwRCxlQUFlLG1CQUFtQixlQUFlLEVBQUUsU0FBUztBQUFBLFFBQzVELGNBQWMsbUJBQW1CLGdCQUFnQjtBQUFBLE1BQ3JEO0FBQUEsSUFDSjtBQUFBLEVBQ0osQ0FBQztBQUNMO0FBRU8sU0FBUyxpQkFBaUIsUUFBZ0IsVUFBdUQ7QUFDcEcsV0FBUyxPQUFPLFdBQVcsS0FBSyxFQUFFO0FBQ2xDLFVBQVEsSUFBSSxNQUFNO0FBQ2xCLE1BQ0ksT0FDSyxRQUFRLEtBQUssRUFBRSxFQUNmLE1BQU0sQ0FBQyxFQUNQLE1BQU0sc0JBQXNCLEtBQ2pDLE9BQU8sUUFBUSxLQUFLLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxLQUFLLE1BQ3pDO0FBQ0UsWUFBUSxJQUFJLGNBQWM7QUFDMUIsc0JBQWtCLFFBQVEsUUFBUTtBQUFBLEVBQ3RDLFdBRVMsT0FBTyxNQUFNLHNCQUFzQixHQUFHO0FBQzNDLHVCQUFtQixRQUFRLFFBQVE7QUFBQSxFQUN2QyxPQUFPO0FBR0gsVUFBTSxjQUFjLE9BQU8sTUFBTSxZQUFZO0FBRTdDLFVBQU0saUJBQWlCLENBQUM7QUFFeEIsYUFBUyxJQUFJLEdBQUcsSUFBSSxZQUFZLFFBQVEsS0FBSztBQUN6QyxVQUFJLFlBQVksQ0FBQyxLQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxNQUFNLFlBQVksR0FBRztBQUM3RCx1QkFBZSxLQUFLLGFBQWEsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUFBLE1BQ3BELE9BQU87QUFDSCx1QkFBZSxLQUFLLFlBQVksQ0FBQyxDQUFDO0FBQUEsTUFDdEM7QUFBQSxJQUNKO0FBRUEsWUFBUSxJQUFJLGNBQWM7QUFHMUIsUUFBSSxTQUFTLGVBQWUsQ0FBQztBQUM3QixVQUFNLFNBQVMsQ0FBQyxPQUFPLElBQUk7QUFDM0IsYUFBUyxJQUFJLEdBQUcsSUFBSSxlQUFlLFFBQVEsS0FBSyxHQUFHO0FBQy9DLFlBQU0sV0FBVyxlQUFlLENBQUM7QUFDakMsWUFBTSxRQUFRLGVBQWUsSUFBSSxDQUFDO0FBQ2xDLFVBQUksTUFBTSxVQUFVLFVBQWEsT0FBTyxVQUFVLFFBQVc7QUFDekQ7QUFBQSxNQUNKO0FBQ0EsYUFBTyxLQUFLLFFBQXFCO0FBQ2pDLGNBQVEsVUFBVTtBQUFBLFFBQ2QsS0FBSztBQUNELGlCQUFPLFVBQVUsTUFBTTtBQUN2QixpQkFBTyxLQUFLLE1BQU0sSUFBSTtBQUN0QjtBQUFBLFFBQ0osS0FBSztBQUNELGlCQUFPLFVBQVUsTUFBTTtBQUN2QixpQkFBTyxLQUFLLE1BQU0sSUFBSTtBQUN0QjtBQUFBLFFBQ0osS0FBSztBQUNELGlCQUFPLFVBQVUsTUFBTTtBQUN2QixpQkFBTyxLQUFLLE1BQU0sSUFBSTtBQUN0QjtBQUFBLFFBQ0osS0FBSztBQUNELGlCQUFPLFVBQVUsTUFBTTtBQUN2QixpQkFBTyxLQUFLLE1BQU0sSUFBSTtBQUN0QjtBQUFBLFFBQ0osS0FBSztBQUNELGlCQUFPLFVBQVUsTUFBTTtBQUN2QixpQkFBTyxLQUFLLE1BQU0sSUFBSTtBQUN0QjtBQUFBLFFBQ0osS0FBSztBQUNELGlCQUFPLFdBQVcsTUFBTTtBQUN4QixpQkFBTyxLQUFLLE1BQU0sSUFBSTtBQUN0QjtBQUFBLFFBQ0o7QUFDSTtBQUFBLE1BQ1I7QUFBQSxJQUNKO0FBRUEsUUFBSSxPQUFPLFVBQVUsUUFBVztBQUM1QixlQUFTLEVBQUUsUUFBUSxHQUFHLE1BQU0sY0FBZTtBQUFBLElBQy9DO0FBR0EsYUFBUztBQUFBLE1BQ0wsV0FBVyxPQUFPLFNBQVMsRUFBRSxXQUFXLEtBQUssR0FBRyxLQUFLO0FBQUEsTUFDckQsV0FBVyxPQUFPLE9BQU8sU0FBUyxDQUFDO0FBQUEsTUFDbkMsV0FBVyxPQUFPLE9BQU8sU0FBUztBQUFBLE1BQ2xDLFdBQVcsT0FBTyxPQUFPLFNBQVMsRUFBRTtBQUFBLE1BQ3BDLFVBQVU7QUFBQSxJQUNkLENBQUM7QUFBQSxFQUNMO0FBQ0o7QUFFQSxTQUFTLGFBQWEsUUFBZ0I7QUFDbEMsUUFBTSxhQUFrQjtBQUFBLElBQ3BCLE1BQU0sRUFBRSxPQUFPLEdBQUcsTUFBTSxzQkFBaUI7QUFBQSxJQUN6QyxNQUFNLEVBQUUsT0FBTyxJQUFJLE1BQU0sZ0NBQXNCO0FBQUEsSUFDL0MsTUFBTSxFQUFFLE9BQU8sR0FBRyxNQUFNLG9CQUFnQjtBQUFBLEVBQzVDO0FBQ0EsTUFBSSxRQUFRO0FBQ1osTUFBSSxZQUFZO0FBQ2hCLE1BQUksT0FBTyxNQUFNLEdBQUcsQ0FBQyxLQUFLLFlBQVk7QUFDbEMsWUFBUSxXQUFXLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ3ZDLGdCQUFZLFdBQVcsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDM0MsYUFBUyxPQUFPLE1BQU0sQ0FBQztBQUFBLEVBQzNCO0FBQ0EsU0FBTztBQUFBLElBQ0gsUUFBUSxTQUFTLFFBQVEsS0FBSztBQUFBLElBQzlCLE1BQU07QUFBQSxFQUNWO0FBQ0o7OztBRmhLUTtBQVZPLFNBQVIsVUFBMkI7QUFDOUIsUUFBTSxDQUFDLE9BQU8sUUFBUSxRQUFJLHVCQUFnQjtBQUFBLElBQ3RDLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWO0FBQUEsRUFDSixDQUFDO0FBRUQsUUFBTSxrQkFBa0I7QUFBQSxJQUNwQiw0Q0FBQyxnQkFBSyxNQUFMLEVBQVUsT0FBTyxrQkFBa0IsYUFBYSxDQUFDLEVBQUUsTUFBTSxNQUFNLFVBQVUsQ0FBQyxHQUFHO0FBQUEsSUFDOUUsNENBQUMsZ0JBQUssTUFBTCxFQUFVLE9BQU8seUJBQXlCLGFBQWEsQ0FBQyxFQUFFLE1BQU0sTUFBTSxVQUFVLENBQUMsR0FBRztBQUFBLElBQ3JGLDRDQUFDLGdCQUFLLE1BQUwsRUFBVSxPQUFPLDBCQUEwQixhQUFhLENBQUMsRUFBRSxNQUFNLE1BQU0sVUFBVSxDQUFDLEdBQUc7QUFBQSxJQUN0Riw0Q0FBQyxnQkFBSyxNQUFMLEVBQVUsT0FBTyw4QkFBOEIsYUFBYSxDQUFDLEVBQUUsTUFBTSxNQUFNLFVBQVUsQ0FBQyxHQUFHO0FBQUEsRUFDOUY7QUFFQSxRQUFNLGlCQUFpQjtBQUFBLElBQ25CLDRDQUFDLGdCQUFLLE1BQUwsRUFBVSxPQUFPLGtCQUFrQixhQUFhLENBQUMsRUFBRSxNQUFNLE1BQU0sVUFBVSxDQUFDLEdBQUc7QUFBQSxJQUM5RSw0Q0FBQyxnQkFBSyxNQUFMLEVBQVUsT0FBTyxxQ0FBcUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxNQUFNLFVBQVUsQ0FBQyxHQUFHO0FBQUEsSUFDakcsNENBQUMsZ0JBQUssTUFBTCxFQUFVLE9BQU8sc0NBQXNDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sTUFBTSxVQUFVLENBQUMsR0FBRztBQUFBLElBQ2xHLDZDQUFDLGdCQUFLLFNBQUwsRUFBYSxPQUFPLGdFQUNqQjtBQUFBLGtEQUFDLGdCQUFLLE1BQUwsRUFBVSxPQUFPLFFBQVEsYUFBYSxDQUFDLEVBQUUsTUFBTSxNQUFNLFVBQVUsZ0JBQWdCLEtBQUssQ0FBQyxHQUFHO0FBQUEsTUFDekYsNENBQUMsZ0JBQUssTUFBTCxFQUFVLE9BQU8sWUFBWSxhQUFhLENBQUMsRUFBRSxNQUFNLE1BQU0sVUFBVSxnQkFBZ0IsU0FBUyxDQUFDLEdBQUc7QUFBQSxNQUNqRyw0Q0FBQyxnQkFBSyxNQUFMLEVBQVUsT0FBTyxZQUFZLGFBQWEsQ0FBQyxFQUFFLE1BQU0sTUFBTSxVQUFVLGdCQUFnQixTQUFTLENBQUMsR0FBRztBQUFBLE1BQ2pHLDRDQUFDLGdCQUFLLE1BQUwsRUFBVSxPQUFPLGtCQUFrQixhQUFhLENBQUMsRUFBRSxNQUFNLE1BQU0sVUFBVSxnQkFBZ0IsY0FBYyxDQUFDLEdBQUc7QUFBQSxNQUM1Ryw0Q0FBQyxnQkFBSyxNQUFMLEVBQVUsT0FBTywwQkFBMEIsYUFBYSxDQUFDLEVBQUUsTUFBTSxNQUFNLFVBQVUsZ0JBQWdCLGFBQWEsQ0FBQyxHQUFHO0FBQUEsT0FDdkg7QUFBQSxJQUNBLDZDQUFDLGdCQUFLLFNBQUwsRUFBYSxPQUFPLGdFQUNqQjtBQUFBLGtEQUFDLGdCQUFLLE1BQUwsRUFBVSxPQUFPLFFBQVEsYUFBYSxDQUFDLEVBQUUsTUFBTSxNQUFNLFVBQVUsZ0JBQWdCLEtBQUssQ0FBQyxHQUFHO0FBQUEsTUFDekYsNENBQUMsZ0JBQUssTUFBTCxFQUFVLE9BQU8sWUFBWSxhQUFhLENBQUMsRUFBRSxNQUFNLE1BQU0sVUFBVSxnQkFBZ0IsU0FBUyxDQUFDLEdBQUc7QUFBQSxNQUNqRyw0Q0FBQyxnQkFBSyxNQUFMLEVBQVUsT0FBTyxZQUFZLGFBQWEsQ0FBQyxFQUFFLE1BQU0sTUFBTSxVQUFVLGdCQUFnQixTQUFTLENBQUMsR0FBRztBQUFBLE1BQ2pHLDRDQUFDLGdCQUFLLE1BQUwsRUFBVSxPQUFPLGtCQUFrQixhQUFhLENBQUMsRUFBRSxNQUFNLE1BQU0sVUFBVSxnQkFBZ0IsY0FBYyxDQUFDLEdBQUc7QUFBQSxNQUM1Ryw0Q0FBQyxnQkFBSyxNQUFMLEVBQVUsT0FBTywwQkFBMEIsYUFBYSxDQUFDLEVBQUUsTUFBTSxNQUFNLFVBQVUsZ0JBQWdCLGFBQWEsQ0FBQyxHQUFHO0FBQUEsT0FDdkg7QUFBQSxFQUNKO0FBQ0EsUUFBTSxVQUFVLE1BQU0sdURBQXVDLE1BQU07QUFDbkU7QUFBQTtBQUFBLElBRUk7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNHLFdBQVcsQ0FBQyxNQUFNO0FBQUEsUUFDbEIsc0JBQXFCO0FBQUEsUUFDckIsb0JBQW9CLE9BQU8sU0FBYztBQUNyQywyQkFBaUIsTUFBTSxRQUFRO0FBQUEsUUFDbkM7QUFBQSxRQUVDLFdBQUMsVUFDSSxnQkFBZ0IsSUFBSSxDQUFDLFNBQVM7QUFDNUIsaUJBQU87QUFBQSxRQUNYLENBQUMsSUFDQyxlQUFlLElBQUksQ0FBQyxTQUFTO0FBQzNCLGlCQUFPO0FBQUEsUUFDWCxDQUFDO0FBQUE7QUFBQSxJQUNUO0FBQUE7QUFFUjsiLAogICJuYW1lcyI6IFtdCn0K
