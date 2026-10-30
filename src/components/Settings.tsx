import React from 'react';
import { Settings as SettingsIcon, Store, Shield, Palette, Bell, HelpCircle, Save } from 'lucide-react';

export const Settings: React.FC = () => {
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
          <div className="bg-[#111111] border border-[#d4af37]/10 p-8 rounded-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Nome Fantasia</label>
                <input 
                  type="text" 
                  defaultValue="Salão Luxe Unissex"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">CNPJ (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">E-mail de Contato</label>
                <input 
                  type="email" 
                  defaultValue="contato@salaoluxe.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Telefone / WhatsApp</label>
                <input 
                  type="text" 
                  defaultValue="(11) 99999-8888"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Endereço Completo</label>
              <textarea 
                rows={3}
                defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50 transition-all resize-none"
              />
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end">
              <button className="flex items-center gap-2 bg-[#d4af37] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#d4af37]/90 transition-all shadow-lg">
                <Save size={18} />
                Salvar Alterações
              </button>
            </div>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-rose-500 font-bold">Zona de Perigo</h4>
              <p className="text-neutral-500 text-xs">Excluir todos os dados do salão e encerrar conta.</p>
            </div>
            <button className="px-4 py-2 border border-rose-500/30 text-rose-500 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition-all">
              Excluir Salão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Re-using cn utility inside the component for simplicity if not imported
import { cn } from '@/src/lib/utils';
