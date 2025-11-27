export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">¡Pago Exitoso!</h1>
        <p className="text-xl text-gray-300 mb-8">Tu compra ha sido procesada correctamente.</p>
        <a
          href="/dashboard"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Ir al Dashboard
        </a>
      </div>
    </div>
  );
}
