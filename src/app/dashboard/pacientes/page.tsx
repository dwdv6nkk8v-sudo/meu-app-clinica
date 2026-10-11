'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Sidebar from '../../../components/Sidebar'
import ModalFichaPaciente from '../../../components/ModalFichaPaciente'
import { Plus, Users } from 'lucide-react'

interface Paciente {
  id: string; nome_completo: string; data_nascimento: string; data_admissao: string;
  cpf: string; rg: string; plano_de_saude: string; estado_civil: string;
  trabalho: string; naturalidade: string; responsavel_nome: string;
  responsavel_cpf: string; responsavel_rg: string; endereco: string;
  telefone: string; historico_medico: string;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [carregando, setCarregando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false) // Iniciado como false para proteger a visualização inicial
  const [clinica, setClinica] = useState('Aconchego')

  const [nome, setNome] = useState(''); const [nascimento, setNascimento] = useState('')
  const [admissao, setAdmissao] = useState(''); const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState(''); const [plano, setPlano] = useState('')
  const [civil, setCivil] = useState(''); const [trabalho, setTrabalho] = useState('')
  const [naturalidade, setNaturalidade] = useState(''); const [respNome, setRespNome] = useState('')
  const [respCpf, setRespCpf] = useState(''); const [respRg, setRespRg] = useState('')
  const [endereco, setEndereco] = useState(''); const [telefone, setTelefone] = useState('')
  const [historico, setHistorico] = useState('')

  const buscarPacientes = async () => {
    const { data } = await supabase.from('pacientes').select('*').order('nome_completo', { ascending: true })
    if (data) setPacientes(data)
  }

  useEffect(() => {
    buscarPacientes()
    const pegarUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const pre = user.email.split('@')
        setClinica(pre[0].charAt(0).toUpperCase() + pre[0].slice(1))
      }
    }
    pegarUser()
  }, []) // Dependência limpa para evitar re-renderizações infinitas

  const limpar = () => {
    setModalAberto(false); setEditandoId(null); setModoEdicao(false)
    setNome(''); setNascimento(''); setAdmissao(''); setCpf(''); setRg(''); setPlano('')
    setCivil(''); setTrabalho(''); setNaturalidade(''); setRespNome(''); setRespCpf('')
    setRespRg(''); setEndereco(''); setTelefone(''); setHistorico('')
  }

  const handleAbrirNovoPaciente = () => {
    limpar()
    setModoEdicao(true) // Força modo edição para novos registros
    setModalAberto(true)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault(); setCarregando(true)
    const dados = {
      nome_completo: nome, data_nascimento: nascimento, data_admissao: admissao || null,
      cpf, rg, plano_de_saude: plano, estado_civil: civil, trabalho, naturalidade,
      responsavel_nome: respNome, responsavel_cpf: respCpf, responsavel_rg: respRg,
      endereco, telefone, historico_medico: historico
    }
    const { error } = editandoId ? await supabase.from('pacientes').update(dados).eq('id', editandoId) : await supabase.from('pacientes').insert([dados])
    if (!error) { limpar(); buscarPacientes() }
    setCarregando(false)
  }

  const handleExcluir = async (id: string) => {
    const { error } = await supabase.from('pacientes').delete().eq('id', id)
    if (!error) { limpar(); buscarPacientes() }
  }

  const iniciarEdicao = (p: Paciente) => {
    setEditandoId(p.id)
    setModoEdicao(false) // Abre primeiro em formato Prontuário (Visualização)
    setNome(p.nome_completo); setNascimento(p.data_nascimento); setAdmissao(p.data_admissao || '')
    setCpf(p.cpf); setRg(p.rg || ''); setPlano(p.plano_de_saude || ''); setCivil(p.estado_civil || '')
    setTrabalho(p.trabalho || ''); setNaturalidade(p.naturalidade || ''); setRespNome(p.responsavel_nome || '')
    setRespCpf(p.responsavel_cpf || ''); setRespRg(p.responsavel_rg || ''); setEndereco(p.endereco || '')
    setTelefone(p.telefone || ''); setHistorico(p.historico_medico || '')
    setModalAberto(true)
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800 text-sm print:bg-white print:p-0">
      <Sidebar />
      <main className="flex-1 p-8 print:p-0">
        <header className="flex justify-between items-center mb-6 print:hidden">
          <div className="flex items-center gap-3">
            <Users size={28} className="text-blue-600" />
            <h1 className="text-3xl font-bold">Lista de Pacientes</h1>
          </div>
          <button onClick={handleAbrirNovoPaciente} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium shadow">
            <Plus size={16} /> Adicionar Paciente
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:hidden flex flex-col h-[calc(100vh-140px)]">
          <div className="overflow-y-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-500 text-xs font-bold uppercase sticky top-0 bg-slate-50 z-10">
                  <th className="p-4">Nome do Paciente</th>
                  <th className="p-4">CPF</th>
                  <th className="p-4">Data de Nascimento</th>
                  <th className="p-4">Plano</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pacientes.map((p) => (
                  <tr 
                    key={p.id} 
                    onClick={() => iniciarEdicao(p)} 
                    className="hover:bg-slate-50 cursor-pointer select-none"
                  >
                    <td className="p-4 font-semibold text-slate-900 capitalize">{p.nome_completo}</td>
                    <td className="p-4 text-slate-500">{p.cpf}</td>
                    <td className="p-4 text-slate-500">{p.data_nascimento ? p.data_nascimento.split('-').reverse().join('/') : '-'}</td>
                    <td className="p-4 text-slate-500 uppercase">{p.plano_de_saude || 'SUS'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {modalAberto && (
        <ModalFichaPaciente
          editandoId={editandoId} carregando={carregando} modoEdicao={modoEdicao} setModoEdicao={setModoEdicao} clinica={clinica} onFechar={limpar} onSalvar={handleSalvar} onExcluir={handleExcluir}
          nome={nome} setNome={setNome} nascimento={nascimento} setNascimento={setNascimento} admissao={admissao} setAdmissao={setAdmissao}
          cpf={cpf} setCpf={setCpf} rg={rg} setRg={setRg} plano={plano} setPlano={setPlano} civil={civil} setCivil={setCivil}
          trabalho={trabalho} setTrabalho={setTrabalho} naturalidade={naturalidade} setNaturalidade={setNaturalidade}
          respNome={respNome} setRespNome={setRespNome} respCpf={respCpf} setRespCpf={setRespCpf} respRg={respRg} setRespRg={setRespRg}
          telefone={telefone} setTelefone={setTelefone} endereco={endereco} setEndereco={setEndereco} historico={historico} setHistorico={setHistorico}
        />
      )}
    </div>
  )
}
