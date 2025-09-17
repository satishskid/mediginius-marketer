import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
)

export type WhitelistEntry = {
  id?: string
  email?: string
  domain?: string
  addedBy: string
  addedAt: Date
  active: boolean
}

export const WhitelistAPI = {
  async getWhitelist(): Promise<WhitelistEntry[]> {
    const { data, error } = await supabase
      .from('whitelist')
      .select('*')
      .eq('active', true)
      
    if (error) throw error
    return data || []
  },

  async addToWhitelist(entry: Omit<WhitelistEntry, 'id' | 'addedAt'>): Promise<WhitelistEntry> {
    const { data, error } = await supabase
      .from('whitelist')
      .insert([{
        ...entry,
        addedAt: new Date(),
        active: true
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async removeFromWhitelist(identifier: string): Promise<void> {
    const { error } = await supabase
      .from('whitelist')
      .update({ active: false })
      .or(`email.eq.${identifier},domain.eq.${identifier}`)
    
    if (error) throw error
  },

  async isWhitelisted(email: string): Promise<boolean> {
    // First check for exact email match
    const { data: emailMatch, error: emailError } = await supabase
      .from('whitelist')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('active', true)
      .maybeSingle()

    if (emailError) throw emailError
    if (emailMatch) return true

    // Then check domain
    const domain = email.split('@')[1]?.toLowerCase()
    if (!domain) return false

    const { data: domainMatch, error: domainError } = await supabase
      .from('whitelist')
      .select('id')
      .eq('domain', domain)
      .eq('active', true)
      .maybeSingle()

    if (domainError) throw domainError
    return !!domainMatch
  }
}
