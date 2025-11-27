export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Pago Cancelado</h1>
        <p className="text-xl text-gray-300 mb-8">El pago ha sido cancelado. Puedes intentarlo de nuevo cuando desees.</p>
        <a
          href="/dashboard"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Volver al Dashboard
        </a>
      </div>
    </div>
  );
}
