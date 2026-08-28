import { createContext, useContext } from 'react'

export const LenisContext = createContext(null)

// Returns a ref object — access the instance via lenisRef.current
export function useLenis() {
  return useContext(LenisContext)
}