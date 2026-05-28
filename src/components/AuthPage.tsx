import React, { useState, FormEvent } from 'react';
import {
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  RefreshCw,
  KeyRound,
  Fingerprint
} from 'lucide-react';

export interface AuthPageProps {
  onLoginSuccess: (role: string) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // LOGIN STEPS: 'login' | 'force_change' | 'mfa'
  const [step, setStep] = useState<'login' | 'force_change' | 'mfa'>('login');

  // CHANGE PASSWORD STATE (first login force change password security)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // MFA CODE STATE
  const [mfaCode, setMfaCode] = useState('');
  const [simulationLoading, setSimulationLoading] = useState(false);

  // PASSWORD STRENGTH REQUIREMENTS CHECKER FOR SECURITY REGULATION
  const hasUpperCase = /[A-Z]/.test(password || newPassword);
  const hasNumber = /[0-9]/.test(password || newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password || newPassword);
  const isMinLength = (password || newPassword).length >= 8;

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-seeded credentials check (Admin@123456)
    if ((email === 'admin@titanxerp.com' || email === 'superadmin') && password === 'Admin@123456') {
      // First login requires a forced password renewal
      setStep('force_change');
    } else if ((email === 'admin@titanxerp.com' || email === 'superadmin') && password === 'admin') {
      setErrorMsg('A senha padrão anterior expirou. Por favor utilize a credencial regulada "Admin@123456" para o primeiro acesso.');
    } else {
      setErrorMsg('Credenciais corporativas inválidas. Caso tenha esquecido, solicite redefinição ao administrador da rede TI.');
    }
  };

  const handleForceChangeSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    if (!hasUpperCase || !hasNumber || !hasSpecial || !isMinLength) {
      setErrorMsg('A nova senha não obedece à política forte de segurança LGPD de 8 caracteres exigida.');
      return;
    }

    // Pass password renewal step -> forward to MFA verification
    setSimulationLoading(true);
    setTimeout(() => {
      setSimulationLoading(false);
      setStep('mfa');
    }, 1200);
  };

  const handleMfaSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mfaCode === '123456') {
      setSimulationLoading(true);
      setTimeout(() => {
        setSimulationLoading(false);
        onLoginSuccess('Super Admin');
      }, 1500);
    } else {
      setErrorMsg('Código MFA incorreto. Digite o simulador de teste "123456" de seu dispositivo corporativo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row font-sans relative overflow-hidden">
      {/* BRAND BANNER LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 border-r border-slate-900 flex-col justify-between p-12 relative">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 relative">
          <div className="h-6 w-11 bg-gradient-to-tr from-[#00E5FF] via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <span className="text-[11px] text-white font-black tracking-widest">TX</span>
          </div>
          <span className="text-sm font-extrabold tracking-wider font-mono bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">TITANX ERP CORPORATE</span>
          <span className="p-0.5 px-2 bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] font-mono font-bold tracking-wider rounded-full border border-[#00E5FF]/20 uppercase">Enterprise X9</span>
        </div>

        <div className="space-y-6 max-w-sm relative">
          <div className="p-2 px-3 bg-slate-850/60 border border-slate-800 rounded-xl inline-flex items-center gap-1.5 text-xs text-[#00E5FF] font-mono leading-none">
            <ShieldCheck size={13} className="text-[#00E5FF]" /> Camada de Criptografia Ativa TitanX
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 font-sans leading-tight">
            Plataforma Enterprise Saas Global e Multilíngue.
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Solução high-end para conciliação fiscal multinacional, controle de faturamento, roteamento de frotas globais e automação de PCP preditiva.
          </p>
        </div>

        <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-850 pt-5 space-y-1">
          <p className="font-semibold text-slate-400">Canal LGPD e Termo de Consentimento:</p>
          <p className="font-sans">Este terminal altamente criptografado armazena logs de atividade corporativa e endereços IP de auditoria sob regulação internacional de conformidade.</p>
        </div>
      </div>

      {/* SECURE CONTAINER RIGHT FORM */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full p-6 md:p-12 relative">
        {/* UPPER MOBILE LOGO HEADER */}
        <div className="md:hidden flex items-center gap-2 pb-8">
          <div className="h-6 w-11 bg-gradient-to-tr from-[#00E5FF] via-indigo-600 to-purple-600 rounded flex items-center justify-center">
            <span className="text-[10px] text-white font-black">TX</span>
          </div>
          <span className="text-sm font-bold tracking-wider font-mono">TITANX ERP CORPORATE</span>
        </div>

        <div className="space-y-7">
          {/* STEP 1: INITIAL LOGIN PORTAL */}
          {step === 'login' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-100 font-sans tracking-tight">Login Corporativo</h2>
                <p className="text-xs text-slate-400">Insira as credenciais para verificação de permissões.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg flex gap-2 text-xs leading-normal">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SIMULATION HELPER BOX */}
              <div className="p-3 bg-indigo-505/10 border border-indigo-500/20 rounded-xl text-[11px] leading-relaxed text-indigo-300 space-y-1 bg-indigo-950/10 backdrop-blur-sm">
                <p className="font-bold flex items-center gap-1.5 text-[#00E5FF]"><Sparkles size={11} /> Acesso de Diretor S/A Master:</p>
                <div className="font-mono text-xs mt-1">
                  <div><span>Usuário: </span><span className="font-bold text-white bg-slate-900/60 px-1.5 py-0.5 rounded">superadmin</span></div>
                  <div className="mt-1"><span>E-mail: </span><span className="font-bold text-white bg-slate-900/60 px-1.5 py-0.5 rounded">admin@titanxerp.com</span></div>
                  <div className="mt-1"><span>Senha: </span><span className="font-bold text-[#00E5FF] bg-slate-900/60 px-1.5 py-0.5 rounded">Admin@123456</span></div>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-medium">
                <div className="space-y-1">
                  <label className="text-slate-400">Endereço de E-mail ou Usuário Corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      type="text"
                      required
                      placeholder="superadmin ou seu.nome@titanxerp.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-[#00E5FF]/50 p-2.5 pl-10 rounded-xl focus:outline-none text-slate-200 text-xs font-sans placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Senha Privada</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-[#00E5FF]/50 p-2.5 pl-10 pr-10 rounded-xl focus:outline-none text-slate-200 text-xs font-sans placeholder-slate-600 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <input type="submit" value="Acessar Sistema" className="w-full bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold py-2.5 rounded-xl cursor-pointer transition-colors text-center text-xs block" />
              </form>
            </div>
          )}

          {/* STEP 2: FORCED CHANGE REGULATED PASSWORD */}
          {step === 'force_change' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="p-2 bg-amber-500/10 border border-amber-500/25 rounded-md inline-flex items-center gap-1.5 text-[9px] font-mono text-amber-400 leading-none uppercase tracking-wider">
                  <KeyRound size={11} /> Primeiro acesso detectado
                </div>
                <h2 className="text-base font-bold text-slate-100 font-sans tracking-tight pt-1">Atualização Obrigatória de Senha</h2>
                <p className="text-xs text-slate-400 leading-normal">Seu perfil exige a definição de nova senha pessoal obedecendo a diretiva de segurança corporativa do Ministério do Faturamento.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg flex gap-2 text-xs leading-normal">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SECURITY DIRECTIVE CHECKLIST */}
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl space-y-2 text-[10px]">
                <span className="block font-bold text-slate-400 font-mono tracking-wider uppercase text-[9px]">Politica de Segurança Forte S/A:</span>
                <ul className="grid grid-cols-2 gap-2 text-slate-505">
                  <li className={`flex items-center gap-1.5 ${isMinLength ? 'text-emerald-400' : 'text-slate-550'}`}>
                    <span className={`h-1 w-1 rounded-full ${isMinLength ? 'bg-emerald-400' : 'bg-slate-600'}`} /> Mínimo 8 caracteres
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-400' : 'text-slate-550'}`}>
                    <span className={`h-1 w-1 rounded-full ${hasUpperCase ? 'bg-emerald-400' : 'bg-slate-600'}`} /> Letra Maiúscula
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-550'}`}>
                    <span className={`h-1 w-1 rounded-full ${hasNumber ? 'bg-emerald-400' : 'bg-slate-600'}`} /> Número (0-9)
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-slate-550'}`}>
                    <span className={`h-1 w-1 rounded-full ${hasSpecial ? 'bg-emerald-400' : 'bg-slate-600'}`} /> Caractere Especial
                  </li>
                </ul>
              </div>

              <form onSubmit={handleForceChangeSubmit} className="space-y-4 text-xs font-medium">
                <div className="space-y-1">
                  <label className="text-slate-400">Nova Senha</label>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl focus:outline-none text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Confirme a Nova Senha</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl focus:outline-none text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={simulationLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-555 text-slate-950 font-bold py-2.5 rounded-xl cursor-pointer hover:opacity-90 flex items-center justify-center gap-2 text-xs"
                >
                  {simulationLoading && <RefreshCw size={14} className="animate-spin" />}
                  {simulationLoading ? 'Atualizando Criptografia...' : 'Atualizar e ProSSEGUIR'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: MFA DISPOSITIVO VALIDATOR */}
          {step === 'mfa' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md inline-flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 leading-none uppercase tracking-wider">
                  <Fingerprint size={11} /> Double safety trigger
                </div>
                <h2 className="text-base font-bold text-slate-100 font-sans tracking-tight pt-1">Autenticação de Duplo Fator (MFA)</h2>
                <p className="text-xs text-slate-400 leading-normal">Segurança auditada. Digite abaixo o código OTP enviado em seu dispositivo de segurança gerador cadastrado.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg flex gap-2 text-xs leading-normal">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* OTP HELPER */}
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[10px] leading-relaxed text-emerald-400">
                <span className="font-bold">Simulador OTP corporativo:</span> Digite <span className="font-mono font-bold text-white bg-slate-900 px-1 py-0.5 rounded">123456</span> para validar login Super Admin.
              </div>

              <form onSubmit={handleMfaSubmit} className="space-y-4 text-xs font-medium">
                <div className="space-y-1">
                  <label className="text-slate-400">Código OTP MFA (6 dígitos)</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-center tracking-[12px] font-mono font-bold p-2.5 rounded-xl focus:outline-none text-slate-100 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={simulationLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl cursor-pointer hover:opacity-90 flex items-center justify-center gap-2 text-xs"
                >
                  {simulationLoading && <RefreshCw size={14} className="animate-spin" />}
                  {simulationLoading ? 'Criando Sessão Criptografada...' : 'Validar & Acessar ERP'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
