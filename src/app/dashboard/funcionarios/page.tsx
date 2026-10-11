'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Sidebar from '../../../components/Sidebar'
import ModalFichaFuncionario from '../../../components/ModalFichaFuncionario'
import { Plus, Briefcase } from 'lucide-react'

interface Funcionario {
  id: string; nome_completo: string; cpf: string; data_nascimento: string;
  endereco: string; cargo_funcao: string; regime: string;
  data_ingresso: string; status: string;
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [carregando, setCarregando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [clinica, setClinica] = useState('Aconchego')

  // Estados dos Campos
  const [nome, setNome] = useState(''); const [cpf, setCpf] = useState('')
  const [nascimento, setNascimento] = useState(''); const [endereco, setEndereco] = useState('')
  const [cargo, setCargo] = useState(''); const [regime, setRegime] = useState('CLT')
  const [ingresso, setIngresso] = useState(''); const [status, setStatus] = useState('Ativo')

  const buscarFuncionarios = async () => {
    const { data } = await supabase.from('funcionarios').select('*').order('nome_completo', { ascending: true })
    if (data) setFuncionarios(data)
  }

  useEffect(() => {
    buscarFuncionarios()
    const pegarUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const pre = user.email.split('@')
        setClinica(pre[0].charAt(0).toUpperCase() + pre[0].slice(1))
      }
    }
    pegarUser()
  }, [])

  const limpar = () => {
    setModalAberto(false); setEditandoId(null); setModoEdicao(false)
    setNome(''); setCpf(''); setNascimento(''); setEndereco(''); setCargo('')
    setRegime('CLT'); setIngresso(''); setStatus('Ativo')
  }

  const handleAbrirNovoFuncionario = () => {
    limpar()
    setModoEdicao(true)
    setModalAberto(true)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault(); setCarregando(true)
    const dados = {
      nome_completo: nome, cpf, data_nascimento: nascimento || null, endereco,
      cargo_funcao: cargo, regime, data_ingresso: ingresso || null, status
    }
    const { error } = editandoId ? await supabase.from('funcionarios').update(dados).eq('id', editandoId) : await supabase.from('funcionarios').insert([dados])
    if (!error) { limpar(); buscarFuncionarios() }
    setCarregando(false)
  }

  const handleExcluir = async (id: string) => {
    if (confirm('Deseja realmente remover este funcionário?')) {
      const { error } = await supabase.from('funcionarios').delete().eq('id', id)
      if (!error) { limpar(); buscarFuncionarios() }
    }
  }

  const iniciarEdicao = (f: Funcionario) => {
    setEditandoId(f.id); setModoEdicao(false)
    setNome(f.nome_completo); setCpf(f.cpf); setNascimento(f.data_nascimento || '')
    setEndereco(f.endereco || ''); setCargo(f.cargo_funcao); setRegime(f.regime || 'CLT')
    setIngresso(f.data_ingresso || ''); setStatus(f.status); setModalAberto(true)
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800 text-sm print:bg-white print:p-0">
      <Sidebar />
      <main className="flex-1 p-8 print:p-0">
        <header className="flex justify-between items-center mb-6 print:hidden">
          <div className="flex items-center gap-3"><Briefcase size={28} className="text-blue-600" /><h1 className="text-3xl font-bold">Equipe e Funcionários</h1></div>
          <button onClick={handleAbrirNovoFuncionario} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium shadow"><Plus size={16} /> Adicionar Funcionário</button>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:hidden flex flex-col h-[calc(100vh-140px)]">
          <div className="overflow-y-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-500 text-xs font-bold uppercase sticky top-0 bg-slate-50 z-10">
                  <th className="p-4">Nome</th>
                  <th className="p-4">Cargo</th>
                  <th className="p-4">Regime</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {funcionarios.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">Nenhum funcionário cadastrado ainda.</td></tr>
                ) : (
                  funcionarios.map((f) => (
                    <tr key={f.id} onClick={() => { if (!modalAberto) iniciarEdicao(f) }} className="hover:bg-slate-50 cursor-pointer select-none">
                      <td className="p-4 font-semibold text-slate-900 capitalize">{f.nome_completo}</td>
                      <td className="p-4 text-slate-500">{f.cargo_funcao}</td>
                      <td className="p-4 text-slate-500">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          f.regime === 'CLT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          f.regime === 'PJ' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {f.regime || 'CLT'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${f.status === 'Ativo' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {modalAberto && (
        <ModalFichaFuncionario
          editandoId={editandoId} carregando={carregando} modoEdicao={modoEdicao} setModoEdicao={setModoEdicao} clinica={clinica} onFechar={limpar} onSalvar={handleSalvar} onExcluir={handleExcluir}
          nome={nome} setNome={setNome} cpf={cpf} setCpf={setCpf} nascimento={nascimento} setNascimento={setNascimento} endereco={endereco} setEndereco={setEndereco}
          cargo={cargo} setCargo={setCargo} regime={regime} setRegime={setRegime} ingresso={ingresso} setIngresso={setIngresso} status={status} setStatus={setStatus}
        />
      )}
    </div>
  )
}
