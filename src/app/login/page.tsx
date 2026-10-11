'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    // Conecta de verdade com o Supabase usando as chaves do seu .env.local
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('E-mail ou senha incorretos. Tente novamente.')
      setCarregando(false)
    } else {
      // Login correto! Redireciona para o painel principal
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-slate-100">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Painel da Clínica</h1>
          <p className="text-sm text-slate-500 mt-2">Entre com suas credenciais para acessar o sistema</p>
        </div>

        {/* Mensagem de Erro (caso erre a senha) */}
        {erro && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100">
            {erro}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail corporativo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.nome@clinica.com"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha de acesso</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
          >
            {carregando ? 'Verificando...' : 'Entrar no Sistema'}
          </button>
        </form>

      </div>
    </div>
  )
}
