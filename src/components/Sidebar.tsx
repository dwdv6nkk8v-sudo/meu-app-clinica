'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { LayoutDashboard, Users, Briefcase, User } from 'lucide-react'

export default function Sidebar() {
  const [nomeUsuario, setNomeUsuario] = useState('Carregando...')

  useEffect(() => {
    const obterUsuarioLogado = async () => {
      // Busca a sessão ativa do usuário no Supabase
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && user.email) {
        // Pega a parte do e-mail antes do "@"
        const parteAntesDoAt = user.email.split('@')[0]
        
        // Deixa a primeira letra maiúscula para ficar elegante (ex: aconchego -> Aconchego)
        const nomeFormatado = parteAntesDoAt.charAt(0).toUpperCase() + parteAntesDoAt.slice(1)
        
        setNomeUsuario(nomeFormatado)
      } else {
        setNomeUsuario('Clínica')
      }
    }

    obterUsuarioLogado()
  }, [])

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between print:hidden shadow-xl">
      <div>
        {/* Nome do usuário dinâmico com ícone de perfil */}
        <div className="mb-8 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-blue-400">
            <User size={20} className="text-blue-500" />
            <h2 className="text-xl font-bold tracking-tight truncate" title={nomeUsuario}>
              {nomeUsuario}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium tracking-wide uppercase">Conta Conectada</p>
        </div>

        <nav className="space-y-1.5">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition">
            <LayoutDashboard size={18} /> <span>📊 Início</span>
          </Link>
          <Link href="/dashboard/pacientes" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition">
            <Users size={18} /> <span>👥 Pacientes</span>
          </Link>
          <Link href="/dashboard/funcionarios" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition">
            <Briefcase size={18} /> <span>💼 Funcionários</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
