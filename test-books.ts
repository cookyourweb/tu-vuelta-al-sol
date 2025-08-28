// test-books.ts - Script para verificar el archivo chunks.json
import fs from 'fs';
import path from 'path';

const chunksPath = path.join(__dirname, 'astrology_books/chunks.json');

try {
  // Leer el archivo chunks.json
  const chunksData = fs.readFileSync(chunksPath, 'utf-8');
  const chunks = JSON.parse(chunksData);
  
  console.log('✅ Archivo chunks.json cargado exitosamente');
  console.log(`📊 Total de fragmentos: ${chunks.length}`);
  console.log(`💾 Tamaño aproximado: ${(JSON.stringify(chunks).length / 1024 / 1024).toFixed(2)} MB`);
  
  // Mostrar información de los primeros 3 fragmentos
  console.log('\n📝 Primeros 3 fragmentos:');
  chunks.slice(0, 3).forEach((chunk: any, index: number) => {
    console.log(`\n--- Fragmento ${index + 1} ---`);
    console.log(`Libro: ${chunk.book}`);
    console.log(`Índice: ${chunk.chunk_index}`);
    console.log(`Texto (primeros 100 caracteres): ${chunk.text.substring(0, 100)}...`);
  });
  
  // Estadísticas por libro
  console.log('\n📚 Estadísticas por libro:');
  const bookStats: Record<string, number> = {};
  chunks.forEach((chunk: any) => {
    bookStats[chunk.book] = (bookStats[chunk.book] || 0) + 1;
  });
  
  Object.entries(bookStats).forEach(([book, count]) => {
    console.log(`- ${book}: ${count} fragmentos`);
  });
  
  console.log('\n🎯 Verificación completada exitosamente!');
  
} catch (error) {
  console.error('❌ Error al cargar el archivo chunks.json:');
  console.error(error);
  process.exit(1);
}
