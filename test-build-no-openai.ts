// test-build-no-openai.ts - Script para verificar que el build funciona sin OPENAI_API_KEY
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🧪 Probando build sin OPENAI_API_KEY...');

// Guardar el valor actual de OPENAI_API_KEY si existe
const originalApiKey = process.env.OPENAI_API_KEY;

try {
  // Eliminar temporalmente la variable de entorno
  delete process.env.OPENAI_API_KEY;
  
  console.log('🔧 Variable OPENAI_API_KEY removida temporalmente');
  
  // Ejecutar el build
  console.log('🏗️  Ejecutando npm run build...');
  const result = execSync('npm run build', { 
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log('✅ BUILD EXITOSO SIN OPENAI_API_KEY!');
  console.log('📋 Resultado del build:');
  console.log(result.substring(result.length - 500)); // Mostrar solo el final del output
  
} catch (error: any) {
  console.error('❌ Error durante el build sin OPENAI_API_KEY:');
  if (error.stdout) {
    console.error('STDOUT:', error.stdout);
  }
  if (error.stderr) {
    console.error('STDERR:', error.stderr);
  }
  process.exit(1);
} finally {
  // Restaurar la variable de entorno original
  if (originalApiKey) {
    process.env.OPENAI_API_KEY = originalApiKey;
    console.log('🔧 OPENAI_API_KEY restaurada');
  }
}

console.log('\n🎯 Test completado: El proyecto puede compilarse sin OPENAI_API_KEY configurada');
