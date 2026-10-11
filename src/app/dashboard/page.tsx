'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import CardAgenda from '../../components/CardAgenda'
import { supabase } from '../../lib/supabase'
import { LogOut, ClipboardList, X, Save, Cake, Briefcase, User } from 'lucide-react'
import { startOfWeek, addWeeks, format, parseISO } from 'date-fns'

interface Compromisso {
  id: string
  paciente_nome: string
  dia_semana: string
  data_consulta: string
  observacao: string
  tipo_consulta: string 
  data_real?: string   
}

interface AniversarianteDoDia {
  id: string
  nome: string
  tipo: 'paciente' | 'funcionario'
  detalhe: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [compromissos, setCompromissos] = useState<Compromisso[]>([])
  const [aniversariantesTodos, setAniversariantesTodos] = useState<{ [key: string]: AniversarianteDoDia[] }>({})
  const [modalAberto, setModalAberto] = useState(false)
  
  const [titulo, setTitulo] = useState('')
  const [dataConsulta, setDataConsulta] = useState('')
  const [observacao, setObservacao] = useState('')
  const [salvando, setSalvando] = useState(false)

  const hoje = new Date()
  const inicioSemanaAtual = startOfWeek(hoje, { weekStartsOn: 1 }) 
  const inicioProximaSemana = addWeeks(inicioSemanaAtual, 1)

  const diasInglesParaPortugues: { [key: string]: string } = {
    'Monday': 'Segunda', 'Tuesday': 'Terça', 'Wednesday': 'Quarta',
    'Thursday': 'Quinta', 'Friday': 'Sexta', 'Saturday': 'Sábado', 'Sunday': 'Domingo'
  }

  // 🎯 CORREÇÃO: Declarado o array de dias que estava faltando para o mapeamento das colunas
  const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

  // 🧠 Busca compromissos e calcula os aniversariantes mapeados por texto "DD/MM"
  const carregarDadosDashboard = async () => {
    // Busca Consultas
    const { data: consultasData } = await supabase.from('consultas').select('*')
    if (consultasData) setCompromissos(consultasData)

    // Busca Pacientes e Funcionários para mapeamento de Aniversários
    const { data: pacientesData } = await supabase.from('pacientes')
      .select('id, nome_completo, data_nascimento, plano_de_saude')
    
    const { data: funcionariosData } = await supabase.from('funcionarios')
      .select('id, nome_completo, data_nascimento, cargo_funcao')

    const mapaAnivs: { [key: string]: AniversarianteDoDia[] } = {}

    // Processa Pacientes salvando no mapa de aniversários
    if (pacientesData) {
      pacientesData.forEach(p => {
        if (p.data_nascimento) {
          const partes = p.data_nascimento.split('-')
          if (partes.length === 3) {
            const chaveDiaMes = `${partes[2]}/${partes[1]}` // Gera o padrão "DD/MM"
            if (!mapaAnivs[chaveDiaMes]) {
              mapaAnivs[chaveDiaMes] = []
            }
            mapaAnivs[chaveDiaMes].push({
              id: p.id,
              nome: p.nome_completo,
              tipo: 'paciente',
              detalhe: p.plano_de_saude || 'Particular'
            })
          }
        }
      })
    }

    // Processa Funcionários salvando no mapa de aniversários
    if (funcionariosData) {
      funcionariosData.forEach(f => {
        if (f.data_nascimento) {
          const partes = f.data_nascimento.split('-')
          if (partes.length === 3) {
            const chaveDiaMes = `${partes[2]}/${partes[1]}` // Gera o padrão "DD/MM"
            if (!mapaAnivs[chaveDiaMes]) {
              mapaAnivs[chaveDiaMes] = []
            }
            mapaAnivs[chaveDiaMes].push({
              id: f.id,
              nome: f.nome_completo,
              tipo: 'funcionario',
              detalhe: f.cargo_funcao || 'Equipe'
            })
          }
        }
      })
    }

    setAniversariantesTodos(mapaAnivs)
  }

    useEffect(() => {
    // 🎯 CORREÇÃO: Executa a busca assíncrona de forma segura isolando o ciclo de renderização
    const inicializarDashboard = async () => {
      await carregarDadosDashboard()
    }
    
    inicializarDashboard()
  }, []) // Mantém o array vazio para rodar estritamente uma única vez ao montar a página


  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSalvarNota = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)

    const dataObjeto = parseISO(dataConsulta)
    const diaIngles = format(dataObjeto, 'EEEE')
    const diaCalculado = diasInglesParaPortugues[diaIngles] || 'Segunda'
    const dataExibicao = format(dataObjeto, 'dd/MM')

    let semanaCalculada = 'Atual'
    if (dataObjeto >= inicioProximaSemana) {
      semanaCalculada = 'Proxima'
    }

    const { error } = await supabase.from('consultas').insert([
      {
        paciente_nome: titulo,
        dia_semana: diaCalculado,
        data_consulta: dataExibicao,
        hora_consulta: dataConsulta, 
        tipo_consulta: semanaCalculada,
        observacao: observacao
      }
    ])

    if (!error) {
      setModalAberto(false)
      setTitulo('')
      setDataConsulta('')
      setObservacao('')
      carregarDadosDashboard()
    } else {
      alert('Erro ao salvar: ' + error.message)
    }
    setSalvando(false)
  }

  const handleExcluirNota = async (id: string) => {
    const { error } = await supabase.from('consultas').delete().eq('id', id)
    if (!error) carregarDadosDashboard()
  }

  const renderLinhaSemana = (tipoSemana: 'Atual' | 'Proxima') => {
    const dataBase = tipoSemana === 'Atual' ? inicioSemanaAtual : inicioProximaSemana

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {diasDaSemana.map((dia, index) => {
          const dataDiaObjeto = new Date(dataBase)
          dataDiaObjeto.setDate(dataBase.getDate() + index)
          const dataTextoFormatada = format(dataDiaObjeto, 'dd/MM')

          const itensDoDia = compromissos.filter(c => 
            c.dia_semana === dia && c.data_consulta === dataTextoFormatada
          )

          // Pega a lista de aniversariantes da data correspondente a esse card
          const aniversariantesDoDia = aniversariantesTodos[dataTextoFormatada] || []

          return (
            <div key={dia} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[240px]">
              <div className="bg-slate-50 border-b border-slate-100 p-2.5 text-center">
                <p className="font-bold text-slate-700 text-xs uppercase tracking-wider">{dia}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{dataTextoFormatada}</p>
              </div>

              <div className="p-2 space-y-2 flex-1 bg-slate-50/30 overflow-y-auto max-h-[220px]">
                
                {/* BALÃO FESTIVO: Renderiza os aniversariantes do dia na folha da agenda */}
                {aniversariantesDoDia.map((aniv) => (
                  <div key={aniv.id} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-pink-50 border border-pink-100 text-pink-800 text-[11px] font-medium shadow-2xs">
                    <Cake size={13} className="text-pink-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate capitalize">{aniv.nome}</p>
                      <p className="text-[9px] text-pink-400 truncate uppercase flex items-center gap-0.5">
                        {aniv.tipo === 'funcionario' ? <Briefcase size={9} /> : <User size={9} />}
                        {aniv.detalhe}
                      </p>
                    </div>
                  </div>
                ))}

                {itensDoDia.length === 0 && aniversariantesDoDia.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-2 border border-dashed border-slate-100 rounded-lg">
                    <p className="text-[10px] text-slate-400 text-center">Livre</p>
                  </div>
                ) : (
                  itensDoDia.map((item) => (
                    <CardAgenda 
                      key={item.id} 
                      id={item.id}
                      titulo={item.paciente_nome} 
                      observacao={item.observacao} 
                      onExcluir={handleExcluirNota} 
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800 text-sm">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Agenda Semanal</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setModalAberto(true)} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition text-sm"
            >
              <ClipboardList size={16} /> Anotar Agenda
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium rounded-lg border border-red-200 bg-white transition">
              <LogOut size={16} /> Sair
            </button>
          </div>
        </header>

        <div className="mb-8">
          <h2 className="text-base font-bold text-blue-600 mb-3 flex items-center gap-2">📌 Semana Atual</h2>
          {renderLinhaSemana('Atual')}
        </div>

        <div className="mb-4">
          <h2 className="text-base font-bold text-purple-600 mb-3 flex items-center gap-2">⏭️ Próxima Semana</h2>
          {renderLinhaSemana('Proxima')}
        </div>
      </main>

            {/* 📋 Janela Flutuante Remontada e Fechada Completamente */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Nova Anotação</h3>
              <button type="button" onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarNota} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título / Compromisso</label>
                <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Atendimento Clínico ou Lembrete" className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data do Compromisso</label>
                <input type="date" required value={dataConsulta} onChange={(e) => setDataConsulta(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observações</label>
                <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={3} placeholder="Instruções adicionais..." className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 resize-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition flex items-center gap-1.5 disabled:opacity-50">
                  <Save size={15} /> {salvando ? 'Salvando...' : 'Salvar Compromisso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
