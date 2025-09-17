import { useState, useEffect } from 'react';
import { WhitelistAPI, WhitelistEntry } from '../api/whitelist';

// Admin emails configuration with secure validation
const ADMIN_EMAILS = new Set((import.meta.env.VITE_ADMIN_EMAILS || '').toLowerCase().split(',').filter(Boolean));

export const WhitelistService = {
  isAdmin: (email: string): boolean => {
    return email ? ADMIN_EMAILS.has(email.toLowerCase()) : false;
  },

  isWhitelisted: async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    // Admins are always whitelisted
    if (WhitelistService.isAdmin(email)) {
      return true;
    }

    try {
      return await WhitelistAPI.isWhitelisted(email);
    } catch (error) {
      console.error('Failed to check whitelist status:', error);
      return false;
    }
  },

  addToWhitelist: async (entry: Omit<WhitelistEntry, 'id' | 'addedAt' | 'active'>): Promise<WhitelistEntry | null> => {
    try {
      return await WhitelistAPI.addToWhitelist({
        ...entry,
        active: true
      });
    } catch (error) {
      console.error('Failed to add to whitelist:', error);
      return null;
    }
  },

  removeFromWhitelist: async (identifier: string): Promise<boolean> => {
    try {
      await WhitelistAPI.removeFromWhitelist(identifier);
      return true;
    } catch (error) {
      console.error('Failed to remove from whitelist:', error);
      return false;
    }
  },

  getWhitelist: async (): Promise<WhitelistEntry[]> => {
    try {
      return await WhitelistAPI.getWhitelist();
    } catch (error) {
      console.error('Failed to get whitelist:', error);
      return [];
    }
  }
};

// React hook for whitelist state management
export const useWhitelist = (email: string | null) => {
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      if (!email) {
        if (mounted) {
          setIsWhitelisted(false);
          setIsAdmin(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        const [whitelisted, admin] = await Promise.all([
          WhitelistService.isWhitelisted(email),
          Promise.resolve(WhitelistService.isAdmin(email))
        ]);

        if (mounted) {
          setIsWhitelisted(whitelisted);
          setIsAdmin(admin);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to check whitelist status:', error);
        if (mounted) {
          setIsWhitelisted(false);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    };

    checkStatus();
    return () => { mounted = false; };
  }, [email]);

  return { isWhitelisted, isAdmin };
};
