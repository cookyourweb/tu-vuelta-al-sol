import db from "@/lib/db";

// src/app/api/astrology/cache/save/route.ts
export async function POST(request: Request) {
  const { cache } = await request.json();

  // Obtener la conexión de mongoose
  const mongoose = await db();

  // Guardar/actualizar en MongoDB
  await mongoose.connection.collection('user_agenda_cache').replaceOne(
    { userId: cache.userId },
    cache,
    { upsert: true }
  );

  return Response.json({ success: true });
}