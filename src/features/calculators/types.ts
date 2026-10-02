// src/features/calculators/types.ts
import type { ComponentType } from "react";

export type CalculatorDefinition = {
  id: string;
  label: string;
  category: string;
  description: string;
  Component: ComponentType;
};
