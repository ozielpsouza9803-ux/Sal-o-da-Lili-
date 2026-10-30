import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Lock, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Scissors, 
  LogOut, 
  ArrowLeft,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Professional, Appointment, ProfessionalCommission, ProfessionalAbsence } from '@/src/types';
import { formatCurrency, cn } from '@/src/lib/utils';
import { STATUS_LABELS } from '@/src/services/agendaStorage';

interface ProfessionalPortalViewProps {
  professionals: Professional[];
  appointments: Appointment[];
  commissions: ProfessionalCommission[];
  absences: ProfessionalAbsence[];
  onUpdateAppointmentStatus: (appId: string, newStatus: Appointment['status']) => void;
  onBackToPublic: () => void;
}

export const ProfessionalPortalView: React.FC<ProfessionalPortalViewProps> = ({
  professionals,
  appointments,
  commissions,
  absences,
  onUpdateAppointmentStatus,
  onBackToPublic
}) => {
  const [loggedProfessional, setLoggedProfessional] = useState<Professional | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'agenda' | 'comissoes' | 'perfil'>('agenda');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const found = professionals.find(
      p => p.name.toLowerCase().replace(/\s+/g, '') === emailInput.trim().toLowerCase().replace(/\s+/g, '') ||
           p.name.toLowerCase().includes(emailInput.trim().toLowerCase())
    );

    if (!found) {
      setLoginError('Profissional não encontrado no cadastro do Salão Luxe.');
      return;
    }

    if (passwordInput && passwordInput !== 'pro123' && passwordInput !== 'admin') {
      setLoginError('Senha incorreta. A senha padrão para profissionais é pro123.');
      return;
    }

    setLoggedProfessional(found);
  };

  const handleQuickLoginAs = (pro: Professional) => {
    setLoggedProfessional(pro);
    setLoginError(null);
  };

  // Filtered Appointments for logged professional only
  const proAppointments = useMemo(() => {
    if (!loggedProfessional) return [];
    return appointments
      .filter(a => a.professionalId === loggedProfessional.id)
      .sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return a.startTime.localeCompare(b.startTime);
      });
  }, [appointments, loggedProfessional]);

  // Filtered Commissions
  const proCommissions = useMemo(() => {
    if (!loggedProfessional) return [];
    return commissions.filter(c => c.professionalId === loggedProfessional.id);
  }, [commissions, loggedProfessional]);

  const totalCommissionsEarned = proCommissions.reduce((acc, curr) => acc + curr.commissionAmount, 0);

  // Filtered Absences
  const proAbsences = useMemo(() => {
    if (!loggedProfessional) return [];
    return absences.filter(a => a.professionalId === loggedProfessional.id);
  }, [absences, loggedProfessional]);

  // LOGIN SCREEN FOR PROFESSIONALS
  if (!loggedProfessional) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center p-4 animate-in fade-in duration-500">
        <div className="w-full max-w-md bg-[#101010] border border-[#d4af37]/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mx-auto mb-3">
              <Users size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Espaço do Profissional</h2>
            <p className="text-neutral-400 text-xs">
              Acesso restrito para a equipe de especialistas do Salão Luxe.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Nome do Profissional ou E-mail
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Oliveira"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="pro123"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 pl-3 pr-10 text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#d4af37] text-black font-bold text-sm rounded-xl hover:bg-[#b8860b] transition-all shadow-lg shadow-[#d4af37]/20 mt-2"
            >
              Acessar Meu Espaço
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-white/10 space-y-2 text-center">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">
              Entrar como Profissional Cadastrado:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {professionals.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleQuickLoginAs(p)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 text-neutral-300 text-xs transition-colors"
                >
                  {p.name.split(' ')[0]} ({p.role.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onBackToPublic}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 mx-auto transition-colors"
            >
              <ArrowLeft size={14} /> Voltar à Área Pública
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED PROFESSIONAL DASHBOARD
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-[#111111] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-[#d4af37] overflow-hidden flex items-center justify-center text-lg font-bold text-[#d4af37] shrink-0">
            {loggedProfessional.photoUrl ? (
              <img src={loggedProfessional.photoUrl} alt={loggedProfessional.name} className="w-full h-full object-cover" />
            ) : (
              loggedProfessional.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{loggedProfessional.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-[10px] font-bold uppercase border border-[#d4af37]/30">
                {loggedProfessional.role}
              </span>
            </div>
            <p className="text-neutral-400 text-xs mt-0.5">
              Comissão configurada: <span className="text-[#d4af37] font-bold">{loggedProfessional.commission}%</span> por serviço realizado.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLoggedProfessional(null)}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-[#111111] border border-white/10 rounded-2xl p-1.5 overflow-x-auto gap-1">
        {[
          { id: 'agenda', label: `Minha Agenda (${proAppointments.length})`, icon: Calendar },
          { id: 'comissoes', label: `Minhas Comissões (${formatCurrency(totalCommissionsEarned)})`, icon: DollarSign },
          { id: 'perfil', label: 'Meu Perfil & Horários', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap",
              activeTab === tab.id
                ? "bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MINHA AGENDA */}
      {activeTab === 'agenda' && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar size={18} className="text-[#d4af37]" />
            Seus Atendimentos Agendados
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proAppointments.map(app => {
              const statusInfo = STATUS_LABELS[app.status] || STATUS_LABELS.confirmado;

              return (
                <div key={app.id} className="p-5 rounded-2xl bg-[#111111] border border-[#d4af37]/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-[#d4af37] flex items-center gap-1.5">
                      <Clock size={15} />
                      {app.startTime} - {app.endTime} ({app.date})
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      statusInfo.bg,
                      statusInfo.text,
                      statusInfo.border
                    )}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-white font-bold text-base">{app.serviceNames.join(' + ')}</h4>
                    <p className="text-neutral-300 text-xs mt-0.5">Cliente: <span className="text-white font-semibold">{app.clientName}</span> ({app.clientPhone})</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-white font-bold text-xs">
                      Valor Total: {formatCurrency(app.totalPrice)}
                    </span>

                    {/* Quick status actions */}
                    <div className="flex gap-2">
                      {app.status !== 'em_atendimento' && app.status !== 'concluido' && (
                        <button
                          onClick={() => onUpdateAppointmentStatus(app.id, 'em_atendimento')}
                          className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-bold hover:bg-amber-500/30"
                        >
                          Iniciar
                        </button>
                      )}
                      {app.status !== 'concluido' && (
                        <button
                          onClick={() => onUpdateAppointmentStatus(app.id, 'concluido')}
                          className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-bold hover:bg-emerald-500/30"
                        >
                          Concluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {proAppointments.length === 0 && (
              <div className="col-span-full py-12 text-center text-neutral-500 text-xs bg-[#111111] border border-white/5 rounded-2xl">
                Nenhum agendamento atribuído à sua agenda no momento.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MINHAS COMISSÕES */}
      {activeTab === 'comissoes' && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign size={18} className="text-[#d4af37]" />
            Histórico de Comissões e Repasses
          </h3>

          <div className="space-y-2">
            {proCommissions.map(c => (
              <div key={c.id} className="p-4 bg-[#111111] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-white font-bold block">{c.serviceNames.join(', ')}</span>
                  <span className="text-neutral-500 text-[11px]">Cliente: {c.clientName} • Data: {c.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#d4af37] font-bold block">{formatCurrency(c.commissionAmount)}</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase",
                    c.status === 'pago' ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}

            {proCommissions.length === 0 && (
              <div className="py-12 text-center text-neutral-500 text-xs bg-[#111111] border border-white/5 rounded-2xl">
                Nenhuma comissão registrada até o momento.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MEU PERFIL */}
      {activeTab === 'perfil' && (
        <div className="max-w-2xl mx-auto bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
          <h3 className="text-lg font-bold text-white tracking-tight">Seus Dados de Profissional Cadastrado</h3>

          <div className="p-4 bg-white/5 rounded-xl space-y-1">
            <span className="text-neutral-500 block">Especialidades</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {loggedProfessional.specialties.map(spec => (
                <span key={spec} className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] font-bold text-[11px]">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl space-y-1">
            <span className="text-neutral-500 block">Percentual de Comissão</span>
            <span className="text-white font-extrabold text-sm">{loggedProfessional.commission}%</span>
          </div>

          {proAbsences.length > 0 && (
            <div className="p-4 bg-white/5 rounded-xl space-y-2">
              <span className="text-neutral-500 block">Folgas e Pausas Registradas</span>
              {proAbsences.map(abs => (
                <div key={abs.id} className="text-neutral-300">
                  • {abs.title} ({abs.startDate} até {abs.endDate})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
