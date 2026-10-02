// src/features/calculators/fib4/fib4.ts
export type Fib4Input = {
  age: number;
  ast: number;
  alt: number;
  platelets: number;
};

export type Fib4Risk = "low" | "indeterminate" | "high";

const HIGH_CUTOFF = 2.67;

export function calculateFib4({ age, ast, alt, platelets }: Fib4Input): number {
  return (age * ast) / (platelets * Math.sqrt(alt));
}

// Idade >= 65 usa corte inferior de 2,0 (Mcpherson et al., 2017).
export function interpretFib4(value: number, age: number): Fib4Risk {
  const lowCutoff = age >= 65 ? 2.0 : 1.3;
  if (value < lowCutoff) return "low";
  if (value <= HIGH_CUTOFF) return "indeterminate";
  return "high";
}

export function isValidFib4Input({
  age,
  ast,
  alt,
  platelets,
}: Partial<Fib4Input>): boolean {
  return [age, ast, alt, platelets].every(
    (v) => typeof v === "number" && Number.isFinite(v) && v > 0,
  );
}
