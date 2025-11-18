/**
 * Token management utilities
 * Handles storing and retrieving authentication tokens
 */

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const TOKEN_TYPE_KEY = "token_type"
const EXP_KEY = "exp"
const REFRESH_EXP_KEY = "refresh_exp"

export interface TokenData {
  access_token: string
  refresh_token: string
  token_type: string
  exp: number
  refresh_exp: number
}

/**
 * Store authentication tokens
 */
export function setTokens(data: TokenData): void {
  if (typeof window === "undefined") return

  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
  localStorage.setItem(TOKEN_TYPE_KEY, data.token_type)
  localStorage.setItem(EXP_KEY, data.exp.toString())
  localStorage.setItem(REFRESH_EXP_KEY, data.refresh_exp.toString())
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Get token type
 */
export function getTokenType(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_TYPE_KEY)
}

/**
 * Get all tokens
 */
export function getTokens(): TokenData | null {
  if (typeof window === "undefined") return null

  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  const tokenType = getTokenType()
  const exp = localStorage.getItem(EXP_KEY)
  const refreshExp = localStorage.getItem(REFRESH_EXP_KEY)

  if (!accessToken || !refreshToken || !tokenType || !exp || !refreshExp) {
    return null
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: tokenType,
    exp: parseInt(exp, 10),
    refresh_exp: parseInt(refreshExp, 10),
  }
}

/**
 * Check if access token is expired
 */
export function isAccessTokenExpired(): boolean {
  const tokens = getTokens()
  if (!tokens) return true

  const now = Math.floor(Date.now() / 1000)
  return tokens.exp <= now
}

/**
 * Check if refresh token is expired
 */
export function isRefreshTokenExpired(): boolean {
  const tokens = getTokens()
  if (!tokens) return true

  const now = Math.floor(Date.now() / 1000)
  return tokens.refresh_exp <= now
}

/**
 * Clear all tokens
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(TOKEN_TYPE_KEY)
  localStorage.removeItem(EXP_KEY)
  localStorage.removeItem(REFRESH_EXP_KEY)
}

