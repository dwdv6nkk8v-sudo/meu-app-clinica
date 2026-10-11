// src/components/ModalFichaFuncionario.tsx
import { Pencil, Save, Printer, Trash2, X } from 'lucide-react'

interface ModalProps {
  editandoId: string | null; carregando: boolean; modoEdicao: boolean; setModoEdicao: (v: boolean) => void;
  clinica: string; onFechar: () => void; onSalvar: (e: React.FormEvent) => void; onExcluir: (id: string) => void;
  nome: string; setNome: (v: string) => void; cpf: string; setCpf: (v: string) => void;
  nascimento: string; setNascimento: (v: string) => void; endereco: string; setEndereco: (v: string) => void;
  cargo: string; setCargo: (v: string) => void; regime: string; setRegime: (v: string) => void;
  ingresso: string; setIngresso: (v: string) => void; status: string; setStatus: (v: string) => void;
}

export default function ModalFichaFuncionario({
  editandoId, carregando, modoEdicao, setModoEdicao, clinica, onFechar, onSalvar, onExcluir,
  nome, setNome, cpf, setCpf, nascimento, setNascimento, endereco, setEndereco,
  cargo, setCargo, regime, setRegime, ingresso, setIngresso, status, setStatus
}: ModalProps) {
  
  const field = (lbl: string, val: string) => (
    <div className="border-b border-slate-300 pb-1 mb-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase block">{lbl}</label>
      <span className="text-xs font-semibold text-slate-800 block mt-0.5 print:text-black">{val || '-'}</span>
    </div>
  )

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:absolute print:inset-0 print:bg-white print:p-0 print:block"
      onClick={(e) => e.stopPropagation()}
    >
      <style>{`
        @media print {
          @page {
            size: portrait;
            margin: 10mm 15mm 10mm 15mm !important;
          }
          body {
            padding: 0mm !important;
          }
        }
      `}</style>

      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-xl flex flex-col print:shadow-none print:w-full print:max-w-none print:m-0 print:p-0 print:block"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex justify-between items-center p-4 border-b bg-slate-50 rounded-t-xl print:hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">{!editandoId ? '📝 Novo Funcionário' : modoEdicao ? '✏️ Editar Perfil' : '📋 Dados do Profissional'}</h3>
            {editandoId && (
              <button 
                type="button" 
                onClick={() => window.print()} 
                className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded shadow flex items-center gap-1 hover:bg-emerald-700 transition"
              >
                <Printer size={13} /> Imprimir 
              </button>
            )}
          </div>
          <button type="button" onClick={onFechar} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="hidden print:flex flex-col items-center text-center border-b pb-2 mb-6 pt-4">
          <h1 className="text-xl font-black uppercase text-slate-900">Clínica {clinica}</h1>
          <h2 className="text-xs font-bold uppercase text-slate-500 mt-0.5">Ficha de Registro de Funcionário</h2>
        </div>

        <form onSubmit={onSalvar} className="p-4 space-y-3 overflow-y-auto max-h-[80vh] print:p-0 print:overflow-visible print:max-h-none">
          {modoEdicao ? (
            <div className="space-y-2 print:hidden">
              <input type="text" required placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50 text-slate-800" />
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[10px] font-bold text-slate-400 uppercase">CPF</label><input type="text" required placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase">Nascimento</label><input type="date" required value={nascimento} onChange={(e) => setNascimento(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50 text-slate-800" /></div>
              </div>
              <input type="text" placeholder="Endereço Residencial" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50" />
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[10px] font-bold text-slate-400 uppercase">Cargo / Função</label><input type="text" required placeholder="Médico, Recepcionista" value={cargo} onChange={(e) => setCargo(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50" /></div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50 text-slate-800">
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Data de Ingresso</label>
                  <input type="date" required value={ingresso} onChange={(e) => setIngresso(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50 text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Regime Contratual</label>
                  <select value={regime} onChange={(e) => setRegime(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50 text-slate-800">
                    <option value="CLT">CLT (Carteira Assinada)</option>
                    <option value="PJ">PJ (Prestador de Serviço)</option>
                    <option value="Contrato Especial">Contrato Especial</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 print:block">
              {field('Nome Completo do Profissional', nome)}
              <div className="grid grid-cols-2 gap-4">{field('CPF', cpf)}{field('Data de Nascimento', nascimento ? nascimento.split('-').reverse().join('/') : '-')}</div>
              {field('Endereço Residencial', endereco)}
              <div className="grid grid-cols-2 gap-4">{field('Cargo / Função', cargo)}{field('Situação / Status', status)}</div>
              <div className="grid grid-cols-2 gap-4">{field('Data de Ingresso', ingresso ? ingresso.split('-').reverse().join('/') : '-')}{field('Regime Contratual', regime)}</div>
              
              <div className="hidden print:block mt-12 text-center mx-auto w-64 border-t border-black pt-1">
                <p className="text-[10px] font-bold uppercase text-black">Assinatura do Profissional</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t print:hidden">
            {editandoId && (
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onExcluir(editandoId); }} 
                className="mr-auto text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-5 transition"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFechar(); }} className="px-3 py-1.5 border rounded text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            {modoEdicao ? (
              <button type="submit" disabled={carregando} className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded shadow hover:bg-blue-700 transition flex items-center gap-1.5 disabled:opacity-50">
                <Save size={14} /> {carregando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            ) : (
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setModoEdicao(true); }} 
                className="bg-slate-800 text-white text-xs font-semibold px-4 py-1.5 rounded shadow hover:bg-slate-900 transition flex items-center gap-1.5"
              >
                <Pencil size={14} /> Editar Perfil
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  )
}
