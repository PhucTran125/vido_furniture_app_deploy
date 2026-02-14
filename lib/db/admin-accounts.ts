import { supabaseAdmin } from '../supabase/server';

export interface AdminAccount {
  id: number;
  username: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Hash a password using SHA-256 (browser-compatible)
 */
export function hashPassword(password: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verify admin credentials
 * Returns the admin account if valid, null otherwise
 */
export async function verifyAdmin(username: string, password: string): Promise<AdminAccount | null> {
  const passwordHash = hashPassword(password);

  const { data, error } = await supabaseAdmin
    .from('admin_accounts')
    .select('id, username, created_at, updated_at')
    .eq('username', username)
    .eq('password_hash', passwordHash)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Update admin password
 */
export async function updateAdminPassword(id: number, newPassword: string): Promise<void> {
  const passwordHash = hashPassword(newPassword);

  const { error } = await supabaseAdmin
    .from('admin_accounts')
    .update({ password_hash: passwordHash })
    .eq('id', id);

  if (error) {
    console.error('Error updating password:', error);
    throw new Error(`Failed to update password: ${error.message}`);
  }
}

/**
 * Verify current password for an admin by ID
 */
export async function verifyCurrentPassword(id: number, currentPassword: string): Promise<boolean> {
  const passwordHash = hashPassword(currentPassword);

  const { data, error } = await supabaseAdmin
    .from('admin_accounts')
    .select('id')
    .eq('id', id)
    .eq('password_hash', passwordHash)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}
