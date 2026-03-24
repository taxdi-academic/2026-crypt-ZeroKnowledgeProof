// src/server/db.ts
import type { Point } from '../shared/ed25519.js';

interface User      { P: Point }
interface Challenge { R: Point; c: bigint; expiresAt: number }

export const users      = new Map<string, User>();
export const challenges = new Map<string, Challenge>();