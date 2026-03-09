export type UserProfile = {
  id?: string
  full_name?: string
  role?: string
  account_type?: string
  user_role?: string
  profile_type?: string
  birth_date?: string
  cpf?: string
  phone?: string
  [key: string]: unknown
}

export type CreateUserRequest = {
  full_name: string
  birth_date: string
  cpf: string
  phone: string
}
