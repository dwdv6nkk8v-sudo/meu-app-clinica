// src/components/CardAgenda.tsx
import { Trash2 } from 'lucide-react'

interface CardAgendaProps {
  id: string
  titulo: string
  observacao?: string
  onExcluir: (id: string) => void
}

export default function CardAgenda({ id, titulo, observacao, onExcluir }: CardAgendaProps) {
  return (
    <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm border-l-4 border-l-blue-500 hover:border-blue-400 transition-all relative group">
      
      {/* Botão de Excluir (Aparece ao passar o mouse ou tocar) */}
      <button 
        onClick={() => onExcluir(id)}
        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors md:opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-100"
        title="Excluir Anotação"
      >
        <Trash2 size={13} />
      </button>

      <p className="font-bold text-slate-900 text-xs pr-4">{titulo}</p>
      {observacao && (
        <p className="text-slate-500 text-[11px] mt-1 whitespace-pre-wrap leading-relaxed bg-slate-50 p-1.5 rounded border border-slate-100 pr-4">
          {observacao}
        </p>
      )}
    </div>
  )
}
