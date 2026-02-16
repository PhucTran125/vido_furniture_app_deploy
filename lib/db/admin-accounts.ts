import { supabaseAdmin } from '../supabase/server';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export interface AdminAccount {
  id: number;
  username: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Legacy SHA-256 hash for migration compatibility
 */
function legacySha256Hash(password: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verify admin credentials
 * Supports both bcrypt and legacy SHA-256 hashes (auto-migrates to bcrypt on login)
 */
export async function verifyAdmin(username: string, password: string): Promise<AdminAccount | null> {
  const { data, error } = await supabaseAdmin
    .from('admin_accounts')
    .select('id, username, password_hash, created_at, updated_at')
    .eq('username', username)
    .single();

  if (error || !data) {
    return null;
  }

  const storedHash = data.password_hash;
  let isValid = false;

  // Check if hash is bcrypt format (starts with $2b$ or $2a$)
  if (storedHash.startsWith('$2b$') || storedHash.startsWith('$2a$')) {
    isValid = await bcrypt.compare(password, storedHash);
  } else {
    // Legacy SHA-256 comparison
    isValid = storedHash === legacySha256Hash(password);
    if (isValid) {
      // Auto-migrate to bcrypt
      const bcryptHash = await hashPassword(password);
      await supabaseAdmin
        .from('admin_accounts')
        .update({ password_hash: bcryptHash })
        .eq('id', data.id);
    }
  }

  if (!isValid) {
    return null;
  }

  return { id: data.id, username: data.username, created_at: data.created_at, updated_at: data.updated_at };
}

/**
 * Update admin password (uses bcrypt)
 */
export async function updateAdminPassword(id: number, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword);

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
 * Supports both bcrypt and legacy SHA-256 hashes
 */
export async function verifyCurrentPassword(id: number, currentPassword: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('admin_accounts')
    .select('id, password_hash')
    .eq('id', id)
    .single();

  if (error || !data) {
    return false;
  }

  const storedHash = data.password_hash;

  if (storedHash.startsWith('$2b$') || storedHash.startsWith('$2a$')) {
    return bcrypt.compare(currentPassword, storedHash);
  }

  // Legacy SHA-256
  return storedHash === legacySha256Hash(currentPassword);
}
