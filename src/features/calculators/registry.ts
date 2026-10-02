// src/features/calculators/registry.ts
import Fib4Calculator from "./fib4/Fib4Calculator";
import type { CalculatorDefinition } from "./types";

export const calculators: CalculatorDefinition[] = [
  {
    id: "fib4",
    label: "FIB-4",
    category: "Hepatologia",
    description:
      "Estimativa de fibrose hepática avançada a partir de idade, AST, ALT e plaquetas.",
    Component: Fib4Calculator,
  },
];
