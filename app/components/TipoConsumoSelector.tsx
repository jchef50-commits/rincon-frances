'use client';

import { TipoConsumo } from '@/app/types';

interface TipoConsumoSelectorProps {
  tipoConsumo: TipoConsumo | null;
  onSeleccionar: (tipo: TipoConsumo) => void;
  numeroMesa?: number;
  onMesaChange?: (numero: number) => void;
}

const opciones = [
  { valor: TipoConsumo.MESA, label: '🪑 En mostrador', icon: '🪑' },
  { valor: TipoConsumo.PARA_LLEVAR, label: '🛍️ Para llevar', icon: '🛍️' },
  { valor: TipoConsumo.PARA_RECOGER, label: '📦 Para recoger', icon: '📦' },
];

export function TipoConsumoSelector({
  tipoConsumo,
  onSeleccionar,
  numeroMesa,
  onMesaChange,
}: TipoConsumoSelectorProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <p className="font-semibold">¿Cómo deseas tu pedido?</p>

      <div className="grid grid-cols-3 gap-2">
        {opciones.map((opcion) => (
          <button
            key={opcion.valor}
            onClick={() => onSeleccionar(opcion.valor)}
            className={`p-3 rounded-lg border-2 transition-all ${
              tipoConsumo === opcion.valor
                ? 'border-black bg-black text-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-lg mb-1">{opcion.icon}</div>
            <div className="text-xs font-medium">{opcion.label.split(' ')[1]}</div>
          </button>
        ))}
      </div>

      {tipoConsumo === TipoConsumo.MESA && onMesaChange && (
        <div>
          <label className="text-sm font-medium block mb-2">¿En qué mostrador deseas esperar?</label>
          <input
            type="number"
            min="1"
            max="30"
            value={numeroMesa || ''}
            onChange={(e) => onMesaChange(parseInt(e.target.value) || 0)}
            placeholder="Ej: 5"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      )}
    </div>
  );
}
