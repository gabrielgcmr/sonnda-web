const DEV_API_URL = 'http://localhost:8080'
const PROD_API_URL = 'https://api.sonnda.com.br'
const DEV_API_PROXY_PATH = '/api'

function getRequiredEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY') {
  const value = import.meta.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function normalizeApiUrl(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function getApiUrl() {
  const configuredUrl =
    import.meta.env.VITE_API_URL?.trim() || (import.meta.env.DEV ? DEV_API_URL : PROD_API_URL)

  return normalizeApiUrl(configuredUrl)
}

function getBrowserApiBaseUrl(apiUrl: string) {
  if (!import.meta.env.DEV) {
    return apiUrl
  }

  if (/^https?:\/\//i.test(apiUrl)) {
    return DEV_API_PROXY_PATH
  }

  return normalizeApiUrl(apiUrl)
}

export const env = {
  apiUrl: getApiUrl(),
  browserApiBaseUrl: getBrowserApiBaseUrl(getApiUrl()),
  supabaseUrl: getRequiredEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: getRequiredEnv('VITE_SUPABASE_ANON_KEY'),
}
