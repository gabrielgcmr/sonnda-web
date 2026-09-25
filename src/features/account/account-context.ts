// src/features/account/context/account-context.ts
import { createContext } from "react";
import type { AccountContextValue } from "./types";

export const AccountContext = createContext<AccountContextValue | null>(null);
