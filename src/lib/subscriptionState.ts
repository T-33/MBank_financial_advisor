// Server-side singleton — single source of truth for frozen subscription IDs.
//
// Uses globalThis to guarantee that BOTH /api/sync-frozen AND /api/chat
// share the SAME Set instance, even if Next.js creates separate module
// evaluation contexts per route (which it does in App Router dev mode).
// This is the standard Next.js singleton pattern (same as Prisma client).

declare global {
  // eslint-disable-next-line no-var
  var __frozenSubIds: Set<string> | undefined;
}

if (!globalThis.__frozenSubIds) {
  globalThis.__frozenSubIds = new Set<string>();
}

export const serverFrozenSubIds: Set<string> = globalThis.__frozenSubIds;

export function syncFrozenIds(ids: string[]): void {
  serverFrozenSubIds.clear();
  for (const id of ids) serverFrozenSubIds.add(id);
}
