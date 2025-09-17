import React, { useState, useEffect } from 'react';
import { WhitelistService, WhitelistEntry } from '../services/whitelistService';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '@clerk/clerk-react';
import { Shield, UserPlus, XCircle, Loader2 } from 'lucide-react';

export const WhitelistManager: React.FC = () => {
  const { user } = useAuth();
  const [newEntry, setNewEntry] = useState('');
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadWhitelist = async () => {
      try {
        const list = await WhitelistService.getWhitelist();
        if (mounted) {
          setWhitelist(list);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load whitelist:', error);
        if (mounted) {
          setError('Failed to load whitelist. Please try again.');
          setLoading(false);
        }
      }
    };

    loadWhitelist();
    return () => { mounted = false; };
  }, []);

  if (!user || !WhitelistService.isAdmin(user.primaryEmailAddress?.emailAddress || '')) {
    return null;
  }

  const validateEntry = (entry: string): boolean => {
    // Domain validation (e.g., example.com)
    if (!entry.includes('@')) {
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
      return domainRegex.test(entry);
    }
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(entry);
  };

  const handleAdd = async () => {
    if (!validateEntry(newEntry)) {
      setError('Please enter a valid email address or domain');
      return;
    }

    setIsProcessing(true);
    try {
      const isEmail = newEntry.includes('@');
      const entry: Omit<WhitelistEntry, 'id' | 'addedAt' | 'active'> = {
        [isEmail ? 'email' : 'domain']: newEntry.toLowerCase(),
        addedBy: user.primaryEmailAddress?.emailAddress || 'unknown'
      };

      const added = await WhitelistService.addToWhitelist(entry);
      if (added) {
        const updatedList = await WhitelistService.getWhitelist();
        setWhitelist(updatedList);
        setNewEntry('');
        setError(null);
      } else {
        setError('Failed to add entry. Please try again.');
      }
    } catch (error) {
      console.error('Failed to add entry:', error);
      setError('Failed to add entry. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async (identifier: string) => {
    setIsProcessing(true);
    try {
      const removed = await WhitelistService.removeFromWhitelist(identifier);
      if (removed) {
        const updatedList = await WhitelistService.getWhitelist();
        setWhitelist(updatedList);
      } else {
        setError('Failed to remove entry. Please try again.');
      }
    } catch (error) {
      console.error('Failed to remove entry:', error);
      setError('Failed to remove entry. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card
        title={
          <>
            <Shield className="mr-2 h-6 w-6 text-sky-400" /> Whitelist Manager
          </>
        }
        className="max-w-2xl mx-auto"
        titleClassName="flex items-center"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
          <span className="ml-2 text-sm text-slate-400">Loading whitelist...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <>
          <Shield className="mr-2 h-6 w-6 text-sky-400" /> Whitelist Manager
        </>
      }
      className="max-w-2xl mx-auto"
      titleClassName="flex items-center"
    >
      <div className="space-y-6">
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 text-blue-100 rounded-lg">
          <p className="text-sm">
            Add email addresses or domains to control access to MediGenius. Only whitelisted users can sign in.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Email address or domain (e.g., email@domain.com or domain.com)"
              value={newEntry}
              onChange={(e) => {
                setNewEntry(e.target.value);
                setError(null);
              }}
              className="flex-1"
              disabled={isProcessing}
            />
            <Button 
              onClick={handleAdd} 
              disabled={!newEntry || isProcessing}
              className="relative"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sky-200">Current Whitelist</h3>
          {whitelist.length === 0 ? (
            <p className="text-slate-400 text-sm">No entries in whitelist</p>
          ) : (
            <div className="space-y-2">
              {whitelist.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700"
                >
                  <div className="text-sm">
                    <p className="text-white">{entry.email || entry.domain}</p>
                    <p className="text-xs text-slate-400">
                      Added by {entry.addedBy} on{' '}
                      {entry.addedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleRemove(entry.email || entry.domain || '')
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
