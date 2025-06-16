/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly GEMINI_API_KEY: string
  readonly VITE_GROQ_API_KEY?: string
  readonly VITE_OPENROUTER_API_KEY?: string
  readonly VITE_STABILITY_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
