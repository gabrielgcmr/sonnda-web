// src/features/account/hooks/useAccount.ts
import { useContext } from "react";
import { AccountContext } from "./account-context";

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context)
    throw new Error("useAccount must be used within AccountProvider");
  return context;
}
