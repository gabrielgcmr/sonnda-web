// tests/fib4.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateFib4,
  interpretFib4,
  isValidFib4Input,
} from "../src/features/calculators/fib4/fib4";

test("calculates FIB-4", () => {
  const value = calculateFib4({ age: 50, ast: 40, alt: 25, platelets: 200 });
  assert.equal(value.toFixed(2), "2.00");
});

test("interprets risk with age-adjusted lower cutoff", () => {
  assert.equal(interpretFib4(1.0, 50), "low");
  assert.equal(interpretFib4(1.5, 50), "indeterminate");
  assert.equal(interpretFib4(1.5, 70), "low");
  assert.equal(interpretFib4(2.67, 50), "indeterminate");
  assert.equal(interpretFib4(3, 50), "high");
});

test("rejects missing, zero or negative inputs", () => {
  assert.equal(
    isValidFib4Input({ age: 50, ast: 40, alt: 25, platelets: 200 }),
    true,
  );
  assert.equal(
    isValidFib4Input({ age: 50, ast: 40, alt: 0, platelets: 200 }),
    false,
  );
  assert.equal(
    isValidFib4Input({ age: NaN, ast: 40, alt: 25, platelets: 200 }),
    false,
  );
});
