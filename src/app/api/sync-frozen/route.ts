// /api/sync-frozen — called by the card button to update the server-side
// frozen subscription state immediately, so the next AI tool call sees
// the correct frozen status.
// Body: { id: string; frozen: boolean }

import { serverFrozenSubIds } from "@/lib/subscriptionState";

export async function POST(req: Request) {
  const { id, frozen } = (await req.json()) as { id: string; frozen: boolean };
  if (frozen) serverFrozenSubIds.add(id);
  else serverFrozenSubIds.delete(id);
  return Response.json({ ok: true });
}
