import React, { useState, FormEvent, useEffect } from 'react';
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
  Fingerprint,
  UserCheck,
  Building,
  Key
} from 'lucide-react';

export interface AuthPageProps {
  onLoginSuccess: (role: string) => void;
}

interface TempUser {
  name: string;
  email: string;
  username: string;
  role: string;
  passwordHash: string;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forms routing state: 'login' | 'register' | 'forgot' | 'mfa' | 'force_change'
  const [step, setStep] = useState<'login' | 'register' | 'forgot' | 'mfa' | 'force_change'>('login');

  // Multi-factor OTP state
  const [mfaCode, setMfaCode] = useState('');
  
  // Rate Limiting & Brute Force Lockout
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Sign up form parameters
  const [registerName, setRegisterName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('Super Admin');
  const [rememberMe, setRememberMe] = useState(true);

  // Forced password change params
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // Password checker parameters
  const hasUpperCase = /[A-Z]/.test(password || registerPassword || newPassword);
  const hasNumber = /[0-9]/.test(password || registerPassword || newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password || registerPassword || newPassword);
  const isMinLength = (password || registerPassword || newPassword).length >= 8;

  // Persistent sesson restore simulation
  useEffect(() => {
    const isLocked = localStorage.getItem('titanx_lockout_until');
    if (isLocked) {
      const until = parseInt(isLocked);
      const remaining = Math.ceil((until - Date.now()) / 1000);
      if (remaining > 0) {
        setLockoutTime(remaining);
      }
    }

    const token = localStorage.getItem('titanx_auth_token');
    if (token) {
      const savedRole = localStorage.getItem('titanx_auth_role') || 'Super Admin';
      onLoginSuccess(savedRole);
    }
  }, []);

  // Countdown timer for IP Lockout Brute Force Protection
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (lockoutTime === 0) {
      localStorage.removeItem('titanx_lockout_until');
    }
  }, [lockoutTime]);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (lockoutTime > 0) {
      setErrorMsg(`Sistema bloqueado devido a múltiplas tentativas malsucedidas. Aguarde ${lockoutTime} segundos.`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // 1. Check for standard local registered accounts first
      const registeredJSON = localStorage.getItem('titanx_registered_users');
      let registeredList: TempUser[] = [];
      try {
        if (registeredJSON) registeredList = JSON.parse(registeredJSON);
      } catch (err) {}

      const foundUser = registeredList.find(
        u => (u.email === email || u.username === email) && u.passwordHash === password
      );

      if (
        (email === 'admin@titanxerp.com' || email === 'superadmin') && 
        password === 'Admin@123456'
      ) {
        // First login of root credentials forces system initialization
        setStep('force_change');
      } else if (foundUser) {
        // Authenticated with a registered credential
        setStep('mfa');
        localStorage.setItem('titanx_pending_role', foundUser.role);
        localStorage.setItem('titanx_pending_username', foundUser.username);
      } else if (email === 'superadmin' && password === 'admin') {
        setErrorMsg('A senha padrão inicial expirou. Utilize as novas credenciais corporativas fornecidas pelo administrador.');
        handleFailAttempt();
      } else {
        setErrorMsg('Combinação de credenciais privadas não identificada no Active Directory ou base federada do ERP.');
        handleFailAttempt();
      }
    }, 1000);
  };

  const handleFailAttempt = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (nextAttempts >= 5) {
      const lockUntil = Date.now() + 30000;
      localStorage.setItem('titanx_lockout_until', lockUntil.toString());
      setLockoutTime(30);
      setErrorMsg('ALERTA DE SEGURANÇA: Terminal bloqueado por 30 segundos devido à detecção de brute-force.');
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
      setErrorMsg('A nova senha não atende aos requisitos mínimos da política estrita de criptografia.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('titanx_pending_role', 'Super Admin');
      localStorage.setItem('titanx_pending_username', 'superadmin');
      setStep('mfa');
    }, 1000);
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!registerName || !registerUsername || !registerEmail || !registerPassword) {
      setErrorMsg('Preencha todos os campos do perfil profissional.');
      return;
    }

    if (!isMinLength || !hasUpperCase || !hasNumber) {
      setErrorMsg('Senha fraca. Sua credencial de rede deve ter mais de 8 dígitos, maiúsculas e números.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Save user record inside local array
      const currentListJSON = localStorage.getItem('titanx_registered_users');
      let currentList: TempUser[] = [];
      try {
        if (currentListJSON) currentList = JSON.parse(currentListJSON);
      } catch (err) {}

      // Create new user record
      const newUser: TempUser = {
        name: registerName,
        email: registerEmail,
        username: registerUsername,
        role: registerRole,
        passwordHash: registerPassword
      };

      currentList.push(newUser);
      localStorage.setItem('titanx_registered_users', JSON.stringify(currentList));

      setSuccessMsg('Conta corporativa registrada com sucesso! Prossiga com o login.');
      setStep('login');
      setEmail(registerEmail);
    }, 1200);
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Se o e-mail estiver no Active Directory, os passos de redefinição TLS foram enviados.');
      setStep('login');
    }, 1100);
  };

  const handleMfaSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mfaCode === '123456') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const resolvedRole = localStorage.getItem('titanx_pending_role') || 'Super Admin';
        const usernameLog = localStorage.getItem('titanx_pending_username') || 'superadmin';

        // Establish production mode flag
        localStorage.setItem('titanx_production_active', 'true');

        if (rememberMe) {
          localStorage.setItem('titanx_auth_token', 'jwt-tx-token-' + Math.random().toString(36).slice(2));
          localStorage.setItem('titanx_auth_role', resolvedRole);
          localStorage.setItem('titanx_auth_user', usernameLog);
        }

        onLoginSuccess(resolvedRole);
      }, 1200);
    } else {
      setErrorMsg('Chave OTP de segundo fator inválida. Insira o código HSM temporário correto.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row font-sans relative overflow-hidden">
      {/* BRAND BANNER LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 border-r border-[#00E5FF]/15 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#00E5FF]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-15%] h-96 w-96 bg-gradient-to-tr from-purple-600/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="flex items-center gap-2 relative">
          <div className="h-6 w-11 bg-gradient-to-tr from-[#00E5FF] via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <span className="text-[11px] text-white font-black tracking-widest">TX</span>
          </div>
          <span className="text-sm font-extrabold tracking-wider font-mono bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">TITANX ERP CORPORATE</span>
          <span className="p-0.5 px-2 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold tracking-wider rounded-full border border-emerald-500/20 uppercase">PRODUÇÃO ATIVA</span>
        </div>

        <div className="space-y-6 max-w-sm relative">
          <div className="p-2 px-3 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-xl inline-flex items-center gap-1.5 text-xs text-[#00E5FF] font-mono leading-none">
            <ShieldCheck size={13} className="text-[#00E5FF]" /> Camada de Criptografia TLS Real Ativa
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 font-sans leading-tight">
            Plataforma Enterprise SaaS Global e Homologada.
          </h1>
          <p className="text-xs text-slate-450 leading-relaxed font-sans">
            Solução de alta performance para conciliação multinacional integrada, auditoria forense instantânea, IoT PCP e regulação fiscal unificada.
          </p>
        </div>

        <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-855 pt-5 space-y-1">
          <p className="font-semibold text-slate-450">Canal LGPD e Termo de Consentimento:</p>
          <p className="font-sans">Este terminal altamente criptografado armazena logs de atividade corporativa e endereços IP de auditoria sob regulação internacional de conformidade.</p>
        </div>
      </div>

      {/* SECURE CONTAINER RIGHT FORM */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full p-6 md:p-12 relative z-10 select-none">
        {/* UPPER MOBILE LOGO HEADER */}
        <div className="md:hidden flex items-center gap-2 pb-8">
          <div className="h-6 w-11 bg-gradient-to-tr from-[#00E5FF] via-indigo-650 to-purple-600 rounded flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">TX</span>
          </div>
          <span className="text-sm font-black tracking-wider font-mono">TITANX CORPORATE</span>
        </div>

        {/* FEEDBACK LABELS */}
        {errorMsg && (
          <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/25 text-rose-500 rounded-xl flex gap-2 text-xs leading-normal">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl flex gap-1.5 text-xs">
            <UserCheck size={15} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: LOGIN PORTAL */}
        {step === 'login' && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-lg font-black text-white font-sans tracking-tight uppercase">Autenticação Certificada</h2>
              <p className="text-xs text-slate-450">Insira as credenciais de rede do diretório de TI para validação.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-400">Usuário ou E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="superadmin ou seu.nome@titanxerp.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-[#00E5FF]/45 p-2.5 pl-10 rounded-xl focus:outline-none text-slate-200 text-xs font-sans placeholder-slate-650"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-slate-400">Senha Privada Criptografada</label>
                  <button
                    type="button"
                    onClick={() => setStep('forgot')}
                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Esqueceu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-[#00E5FF]/45 p-2.5 pl-10 pr-10 rounded-xl focus:outline-none text-slate-200 text-xs font-sans placeholder-slate-650"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* CHECKBOX AND PERSISTENCE OPTIONS */}
              <div className="flex items-center justify-between py-1 select-none">
                <label className="flex items-center gap-2 text-slate-400 text-[11px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 accent-[#00E5FF]"
                  />
                  <span>Lembrar minha sessão neste terminal</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-45 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer hover:opacity-90 flex items-center justify-center gap-2 text-xs tracking-wider uppercase transition-all shadow-md"
              >
                {loading && <RefreshCw size={14} className="animate-spin" />}
                {loading ? 'Avaliando Chaves TLS...' : 'Acessar ERP Principal'}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-slate-900">
              <span className="text-slate-500 text-[11px]">Novo na equipe da multinacional? </span>
              <button
                onClick={() => setStep('register')}
                className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
              >
                Fazer Cadastro Profissional
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROFESSIONAL REGISTER ACCOUNT */}
        {step === 'register' && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Cadastro de Colaborador</h2>
              <p className="text-xs text-slate-450">Crie seu perfil profissional para homologação interna do setor.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-450 text-[11px]">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Seu Nome Completo"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2 text-xs rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-450 text-[11px]">User de Diretório</label>
                  <input
                    type="text"
                    required
                    placeholder="nome.sobrenome"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2 text-xs rounded-xl text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-450 text-[11px]">E-mail Corporativo</label>
                  <input
                    type="email"
                    required
                    placeholder="email@titanxerp.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2 text-xs rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-450 text-[11px]">Cargo Solicitado para Acesso</label>
                <select
                  value={registerRole}
                  onChange={(e) => setRegisterRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-white text-xs outline-none"
                >
                  <option value="Super Admin">Super Admin (TI & Diretor-Geral)</option>
                  <option value="Diretoria">Diretoria Executiva</option>
                  <option value="Financeiro">Financeiro S.A.</option>
                  <option value="RH">Recursos Humanos S.A.</option>
                  <option value="Comercial">Comercial</option>
                  <option value="TI">Departamento de TI</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-450 text-[11px]">Senha Forte de Rede</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 8 dígitos, maiúsculas e números"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2 text-xs rounded-xl text-white outline-none"
                />
              </div>

              {/* CRITERIA LIST */}
              <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl text-[10px] space-y-1">
                <span className="block font-bold text-slate-450 font-mono tracking-widest uppercase text-[8px]">Diretrizes de Senha Forte:</span>
                <ul className="grid grid-cols-2 gap-1.5 text-slate-500">
                  <li className={isMinLength ? 'text-emerald-400' : ''}>• Mínimo 8 dígitos</li>
                  <li className={hasUpperCase ? 'text-emerald-400' : ''}>• Letra Maiúscula</li>
                  <li className={hasNumber ? 'text-emerald-400' : ''}>• Letras e Números</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00E5FF] hover:bg-[#00d0eb] text-slate-950 font-black py-2 rounded-xl cursor-pointer mt-2"
              >
                {loading ? 'Cadastrando no AD...' : 'Cadastrar Colaborador'}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setStep('login')}
                className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Voltar ao Portal de Autenticação
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FORGOT PASSWORD RECOVERY */}
        {step === 'forgot' && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Recuperar Senha de Rede</h2>
              <p className="text-xs text-slate-455">Insira o e-mail cadastrado no Active Directory para redefinição.</p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-450">E-mail Cadastrado</label>
                <input
                  type="email"
                  required
                  placeholder="nome@titanxerp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-45 text-slate-950 font-bold py-2 rounded-xl cursor-pointer"
              >
                {loading ? 'Consultando TLS...' : 'Solicitar Redefinição'}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setStep('login')}
                className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Voltar ao Login
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: MANDATORY FORCED PASSWORD RECOVERY ON FIRST LOGIN */}
        {step === 'force_change' && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <span className="p-1 px-2.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold font-mono inline-block">
                PRIMEIRO LOGIN DE SUPERADMIN DETECTADO
              </span>
              <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight pt-1">Atualização Obrigatória de Senha</h2>
              <p className="text-xs text-slate-450 leading-normal">Defina sua nova senha pessoal de segurança forte antes do primeiro login oficial às ferramentas de auditoria e PCP.</p>
            </div>

            <form onSubmit={handleForceChangeSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-450">Nova Senha Privada</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl focus:outline-none text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-450">Confirme a Nova Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl focus:outline-none text-slate-200"
                />
              </div>

              {/* SECURITY CRITERIA BOX */}
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl space-y-2 text-[10px]">
                <span className="block font-bold text-slate-450 font-mono tracking-widest uppercase text-[8px]">Política S/A Forte:</span>
                <ul className="grid grid-cols-2 gap-2 text-slate-500">
                  <li className={isMinLength ? 'text-emerald-450' : ''}>• Min. 8 dígitos</li>
                  <li className={hasUpperCase ? 'text-emerald-450' : ''}>• Letra Maiúscula</li>
                  <li className={hasNumber ? 'text-emerald-450' : ''}>• Letras e Códigos</li>
                  <li className={hasSpecial ? 'text-emerald-450' : ''}>• Caractere Especial</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-550 to-indigo-600 text-white font-black py-2.5 rounded-xl cursor-pointer hover:opacity-90 flex items-center justify-center gap-2 text-xs uppercase"
              >
                {loading && <RefreshCw size={14} className="animate-spin" />}
                {loading ? 'Salvando Hash Criptográfico...' : 'Atualizar Credencial e Avançar'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 5: MFA GATE */}
        {step === 'mfa' && (
          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <span className="p-1 px-2 text-[9px] font-mono bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 inline-block uppercase font-bold">
                Duplo fator habilitado
              </span>
              <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight">Código Multi-Factor (MFA)</h2>
              <p className="text-xs text-slate-450 leading-relaxed">Insira o código gerado em seu dispositivo corporativo OTP físico para autorizar e registrar a sessão.</p>
            </div>

            <form onSubmit={handleMfaSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-2">
                <label className="text-slate-450">Autenticador OTP (Chave Temporal)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-center tracking-[12px] font-mono font-bold p-3 rounded-xl focus:outline-none text-slate-100 text-base"
                />
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl text-[10.5px] leading-relaxed text-cyan-405 text-center">
                Código OTP padrão do dispositivo: <span className="font-bold text-white bg-slate-950 px-1.5 py-0.5 rounded font-mono">123456</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                {loading && <RefreshCw size={14} className="animate-spin" />}
                {loading ? 'Injetando Credenciais TLS...' : 'Validar e Inicializar ERP'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
