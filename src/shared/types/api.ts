export type UserProfile = {
  id?: string
  full_name?: string
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
