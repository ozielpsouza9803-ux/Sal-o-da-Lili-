import React, { useState } from 'react';
import { Settings as SettingsIcon, Store, Shield, Palette, Bell, HelpCircle, Save, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { PixConfig } from '@/src/types';
import { getDefaultPixConfig, getDefaultSalonSettings, SalonSettings } from '@/src/services/pixService';

export const Settings: React.FC = () => {
  const [salonSettings, setSalonSettings] = useLocalStorage<SalonSettings>('salon_settings', getDefaultSalonSettings());
  const [pixConfig, setPixConfig] = useLocalStorage<PixConfig>('pix_config', getDefaultPixConfig());

  const [tradeName, setTradeName] = useState(salonSettings.tradeName);
  const [cnpj, setCnpj] = useState(salonSettings.cnpj);
  const [email, setEmail] = useState(salonSettings.email);
  const [phone, setPhone] = useState(salonSettings.phone);
  const [address, setAddress] = useState(salonSettings.address);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSalon: SalonSettings = {
      tradeName,
      cnpj,
      email,
      phone,
      address,
    };

    setSalonSettings(updatedSalon);

    // Sync with Pix config if CNPJ or trade name changed
    if (cnpj) {
      setPixConfig(prev => ({
        ...prev,
        key: cnpj,
        receiverName: tradeName.toUpperCase(),
      }));
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Configurações</h1>
        <p className="text-neutral-400 mt-1">Gerencie os dados e a identidade visual do seu salão.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { icon: Store, label: 'Dados do Salão', active: true },
            { icon: Palette, label: 'Identidade Visual', active: false },
            { icon: Shield, label: 'Segurança & Acesso', active: false },
            { icon: Bell, label: 'Notificações', active: false },
            { icon: HelpCircle, label: 'Suporte', active: false },
          ].map((item, i) => (
            <button 
              key={i}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                item.active ? "bg-[#d4af37] text-black font-bold" : "text-neutral-400 hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-[#111111] border border-[#d4af37]/10 p-8 rounded-2xl space-y-8">
            {savedSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-sm font-semibold animate-in fade-in">
                <CheckCircle2 size={20} />
                Dados do salão e chave Pix salvos com sucesso no sistema!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Nome Fantasia</label>
                <input 
                  type="text" 
                  value={tradeName}
                  onChange={e => setTradeName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">CNPJ (Chave Pix Principal)</label>
                <input 
                  type="text" 
                  value={cnpj}
                  onChange={e => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">E-mail de Contato</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Telefone / WhatsApp</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Endereço Completo</label>
              <textarea 
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all resize-none"
              />
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end">
              <button 
                type="submit"
                className="flex items-center gap-2 bg-[#d4af37] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#d4af37]/90 transition-all shadow-lg"
              >
                <Save size={18} />
                Salvar Alterações
              </button>
            </div>
          </form>

          <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-rose-500 font-bold">Zona de Perigo</h4>
              <p className="text-neutral-500 text-xs">Excluir todos os dados do salão e encerrar conta.</p>
            </div>
            <button 
              onClick={() => alert('Ação restrita. Contate o suporte para exclusão permanente do banco de dados.')}
              className="px-4 py-2 border border-rose-500/30 text-rose-500 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition-all"
            >
              Excluir Salão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
