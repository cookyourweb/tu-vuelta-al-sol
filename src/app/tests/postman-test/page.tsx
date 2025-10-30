// src/app/postman-test/page.tsx
import PostmanTest from '@/components/test/PostmanTest';

export default function PostmanTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Prueba con Token de Postman</h1>
      <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
        Esta página te permite probar la generación de cartas natales usando exactamente
        el mismo token y formato que has probado con éxito en Postman.
      </p>
      
      <div className="max-w-2xl mx-auto bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-8">
        <h2 className="font-bold text-yellow-800">Instrucciones</h2>
        <ol className="mt-2 ml-6 text-sm text-yellow-700 list-decimal">
          <li className="mb-1">Abre Postman y copia el token Bearer (sin la palabra &quot;Bearer&quot;)</li>
          <li className="mb-1">Pega el token en el formulario a continuación</li>
          <li className="mb-1">Mantén los valores predeterminados o ajústalos a tu preferencia</li>
          <li className="mb-1">Haz clic en &quot;Generar Carta Natal&quot; para probar la conexión</li>
        </ol>
      </div>
      
      <PostmanTest />
    </div>
  );
}