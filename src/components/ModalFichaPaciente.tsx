// src/components/ModalFichaPaciente.tsx
import { Pencil, Save, Printer, Trash2, X } from 'lucide-react'

interface ModalProps {
  editandoId: string | null; carregando: boolean; modoEdicao: boolean; setModoEdicao: (v: boolean) => void;
  clinica: string; onFechar: () => void; onSalvar: (e: React.FormEvent) => void; onExcluir: (id: string) => void;
  nome: string; setNome: (v: string) => void; nascimento: string; setNascimento: (v: string) => void;
  admissao: string; setAdmissao: (v: string) => void; cpf: string; setCpf: (v: string) => void;
  rg: string; setRg: (v: string) => void; plano: string; setPlano: (v: string) => void;
  civil: string; setCivil: (v: string) => void; trabalho: string; setTrabalho: (v: string) => void;
  naturalidade: string; setNaturalidade: (v: string) => void; respNome: string; setRespNome: (v: string) => void;
  respCpf: string; setRespCpf: (v: string) => void; respRg: string; setRespRg: (v: string) => void;
  telefone: string; setTelefone: (v: string) => void; endereco: string; setEndereco: (v: string) => void;
  historico: string; setHistorico: (v: string) => void;
}

export default function ModalFichaPaciente({
  editandoId, carregando, modoEdicao, setModoEdicao, clinica, onFechar, onSalvar, onExcluir,
  nome, setNome, nascimento, setNascimento, admissao, setAdmissao, cpf, setCpf, rg, setRg,
  plano, setPlano, civil, setCivil, trabalho, setTrabalho, naturalidade, setNaturalidade,
  respNome, setRespNome, respCpf, setRespCpf, respRg, setRespRg, telefone, setTelefone, endereco, setEndereco, historico, setHistorico
}: ModalProps) {
  
  const field = (lbl: string, val: string) => (
    <div className="border-b border-slate-300 pb-1 mb-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase block">{lbl}</label>
      <span className="text-xs font-semibold text-slate-800 block mt-0.5 print:text-black">{val || '-'}</span>
    </div>
  )

  return (
    // 🎯 O contêiner de fundo escuro bloqueia cliques indesejados
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:absolute print:inset-0 print:bg-white print:p-0 print:block"
      onClick={(e) => e.stopPropagation()} // 🔥 Adicionado: Evita que qualquer clique fora feche ou acione a tabela por baixo
    >
      <style>{`
        @media print {
          @page {
            size: portrait;
            margin: 10mm 15mm 10mm 15mm !important; /* Margens perfeitas para folha única */
          }
          body {
            padding: 0mm !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl flex flex-col print:shadow-none print:w-full print:max-w-none print:m-0 print:p-0 print:block"></div>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl flex flex-col print:shadow-none print:w-full print:max-w-none print:m-0 print:p-0 print:block">
        
        <div className="flex justify-between items-center p-4 border-b bg-slate-50 rounded-t-xl print:hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">{!editandoId ? '📝 Novo Paciente' : modoEdicao ? '✏️ Editar Ficha' : '📋 Prontuário'}</h3>
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

        <div className="hidden print:block mt-12 text-center mx-auto w-64 border-t border-black pt-1">
                <p className="text-[10px] font-bold uppercase text-black">Assinatura do Profissional</p>
              </div>

        <form onSubmit={onSalvar} className="p-4 space-y-3 overflow-y-auto max-h-[80vh] print:p-0 print:overflow-visible print:max-h-none">
          {modoEdicao ? (
            <div className="space-y-2 print:hidden">
              <input type="text" required placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50 text-slate-800" />
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[10px] font-bold text-slate-400 uppercase">Nascimento</label><input type="date" required value={nascimento} onChange={(e) => setNascimento(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50 text-slate-800" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase">Admissão</label><input type="date" value={admissao} onChange={(e) => setAdmissao(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50 text-slate-800" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2"><input type="text" required placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50" /><input type="text" placeholder="RG" value={rg} onChange={(e) => setRg(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50" /></div>
              <div className="grid grid-cols-2 gap-2"><input type="text" placeholder="Plano" value={plano} onChange={(e) => setPlano(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50" /><input type="text" placeholder="Estado Civil" value={civil} onChange={(e) => setCivil(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50" /></div>
              <div className="grid grid-cols-2 gap-2"><input type="text" placeholder="Trabalho" value={trabalho} onChange={(e) => setTrabalho(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50" /><input type="text" placeholder="Naturalidade" value={naturalidade} onChange={(e) => setNaturalidade(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50" /></div>
              <div className="bg-slate-50 p-2 rounded border space-y-1.5">
                <input type="text" placeholder="Nome do Responsável" value={respNome} onChange={(e) => setRespNome(e.target.value)} className="w-full px-2 py-1 border rounded bg-white" />
                <div className="grid grid-cols-2 gap-2"><input type="text" placeholder="CPF Resp." value={respCpf} onChange={(e) => setRespCpf(e.target.value)} className="w-full px-2 py-1 border rounded bg-white" /><input type="text" placeholder="RG Resp." value={respRg} onChange={(e) => setRespRg(e.target.value)} className="w-full px-2 py-1 border rounded bg-white" /></div>
                <div className="grid grid-cols-2 gap-2"><input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full px-2 py-1 border rounded bg-white" /><input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full px-2 py-1 border rounded bg-white" /></div>
              </div>
              <textarea rows={2} placeholder="Histórico Médico..." value={historico} onChange={(e) => setHistorico(e.target.value)} className="w-full px-3 py-1 border rounded bg-slate-50 resize-none" />
            </div>
          ) : (
            <div className="space-y-2 print:block">
              {field('Nome do Paciente', nome)}
              <div className="grid grid-cols-2 gap-4">{field('Nascimento', nascimento ? nascimento.split('-').reverse().join('/') : '-')}{field('Data de Admissão', admissao ? admissao.split('-').reverse().join('/') : '-')}</div>
              <div className="grid grid-cols-2 gap-4">{field('CPF', cpf)}{field('RG', rg)}</div>
              <div className="grid grid-cols-2 gap-4">{field('Plano de Saúde', plano)}{field('Estado Civil', civil)}</div>
              <div className="grid grid-cols-2 gap-4">{field('Trabalho / Profissão', trabalho)}{field('Naturalidade', naturalidade)}</div>
              
              <div className="p-2 border rounded mt-2 print:border-none print:p-0 print:mt-4">
                <h4 className="text-xs font-bold border-b pb-0.5 mb-2 print:text-black uppercase tracking-wider">Responsável e Contatos</h4>
                {field('Nome do Responsável Legal', respNome)}
                <div className="grid grid-cols-2 gap-4 mt-1">{field('CPF Resp.', respCpf)}{field('RG Resp.', respRg)}</div>
                <div className="grid grid-cols-2 gap-4 mt-1">{field('Telefone', telefone)}{field('Endereço', endereco)}</div>
              </div>

              <div className="mt-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Histórico Clínico</label>
                <span className="text-xs font-semibold text-slate-800 block mt-0.5 print:text-black">{historico || '-'}</span>
              </div>
              
              <div className="hidden print:block mt-16 text-center mx-auto w-64 border-t border-black pt-1">
                <p className="text-[10px] font-bold uppercase text-black">Assinatura do Responsável</p>
              </div>
            </div>
          )}

                    {/* Rodapé de botões do Modal - Ocultado na impressão */}
          <div className="flex justify-end gap-2 pt-2 border-t print:hidden">
            {editandoId && (
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onExcluir(editandoId);
                }} 
                className="mr-auto text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-5 transition"
              >
                <Trash2 size={16} />
              </button>
            )}
            
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFechar();
              }} 
              className="px-3 py-1.5 border rounded text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            {modoEdicao ? (
              <button 
                type="submit" 
                disabled={carregando} 
                className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded shadow hover:bg-blue-700 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save size={14} /> {carregando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            ) : (
              <button 
                type="button" // 🔥 Força o navegador a NUNCA submeter o formulário ao clicar aqui
                onClick={(e) => {
                  e.preventDefault();   // 🔥 Cancela qualquer ação padrão de submit
                  e.stopPropagation();  // 🔥 Impede que o clique suba para a tabela no fundo
                  setModoEdicao(true);  // 🔥 Ativa apenas a troca visual para os inputs
                }} 
                className="bg-slate-800 text-white text-xs font-semibold px-4 py-1.5 rounded shadow hover:bg-slate-900 transition flex items-center gap-1.5"
              >
                <Pencil size={14} /> Editar Ficha
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}