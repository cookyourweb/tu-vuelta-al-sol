// src/app/api/astrology/cache/check/route.ts
export async function POST(request: Request) {
  const { userId, birthDataHash } = await request.json();
  
  // Buscar en MongoDB
  const cachedAgenda = await db.collection('user_agenda_cache').findOne({
    userId,
    birthDataHash,
    expiresAt: { $gt: new Date() } // No expirado
  });
  
  return Response.json({ data: cachedAgenda });
}