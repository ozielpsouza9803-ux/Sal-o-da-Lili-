import React, { useState } from 'react';
import { Plus, Search, User, Phone, Mail, History, CreditCard, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { Client } from '@/src/types';
import { formatCurrency } from '@/src/lib/utils';

export const Clients: React.FC = () => {
  const [clients, setClients] = useLocalStorage<Client[]>('clients', [
    { id: '1', name: 'Carlos Alberto', email: 'carlos@email.com', phone: '(11) 98888-7777', totalSpent: 1250.00 },
    { id: '2', name: 'Mariana Costa', email: 'mariana@email.com', phone: '(11) 97777-6666', totalSpent: 3420.50 },
    { id: '3', name: 'Roberto Junior', email: 'roberto@email.com', phone: '(11) 96666-5555', totalSpent: 450.00 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Clientes</h1>
          <p className="text-neutral-400 mt-1">Gerencie sua base de clientes e histórico de visitas.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af37]/90 transition-all shadow-lg">
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="flex bg-[#111111] border border-white/10 rounded-xl p-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text"
            placeholder="Nome, e-mail ou telefone..."
            className="w-full bg-transparent py-2 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((client) => (
          <div key={client.id} className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl hover:border-[#d4af37]/30 transition-all flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-[#d4af37] border border-[#d4af37]/10">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-[#d4af37] transition-colors">{client.name}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                    <Phone size={12} />
                    {client.phone}
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-700" />
                  <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                    <Mail size={12} />
                    {client.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Total Gasto</span>
                <span className="text-white font-bold">{formatCurrency(client.totalSpent)}</span>
              </div>
              <ChevronRight size={20} className="text-neutral-700 group-hover:text-[#d4af37] transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-neutral-600">
            <Search size={32} />
          </div>
          <p className="text-neutral-500">Nenhum cliente encontrado com estes termos.</p>
        </div>
      )}
    </div>
  );
};
