// src/features/patient/types.ts
export type Patient = {
  id: string;
  full_name: string;
  cpf?: string | null;
  cns?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  race?: string | null;
  avatar_url?: string | null;
};
