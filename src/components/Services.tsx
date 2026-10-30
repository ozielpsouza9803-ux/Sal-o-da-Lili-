import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, Clock, DollarSign, Tag } from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { Service } from '@/src/types';

const mockServices: Service[] = [
  { id: '1', name: 'Corte Masculino', category: 'Cabelo', price: 60, duration: 30 },
  { id: '2', name: 'Corte Feminino', category: 'Cabelo', price: 120, duration: 60 },
  { id: '3', name: 'Barba Terapia', category: 'Barba', price: 45, duration: 30 },
  { id: '4', name: 'Coloração', category: 'Química', price: 180, duration: 120 },
  { id: '5', name: 'Escova Modeladora', category: 'Finalização', price: 80, duration: 45 },
];

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Serviços</h1>
          <p className="text-neutral-400 mt-1">Gerencie seu catálogo de serviços e especialidades.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af37]/90 transition-all shadow-lg shadow-[#d4af37]/10"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nome ou categoria..."
            className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50 transition-colors">
          <option>Todas Categorias</option>
          <option>Cabelo</option>
          <option>Barba</option>
          <option>Estética</option>
        </select>
      </div>

      <div className="bg-[#111111] border border-[#d4af37]/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-neutral-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Serviço</th>
                <th className="px-6 py-4 font-semibold">Categoria</th>
                <th className="px-6 py-4 font-semibold">Preço</th>
                <th className="px-6 py-4 font-semibold">Duração</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-medium text-white">{service.name}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-medium">
                      <Tag size={12} />
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 text-white font-semibold">
                      <DollarSign size={14} className="text-neutral-500" />
                      {formatCurrency(service.price)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Clock size={14} />
                      {service.duration} min
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-neutral-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#d4af37]/30 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Novo Serviço</h3>
              <p className="text-neutral-400 mb-8">Preencha os dados abaixo para cadastrar um novo serviço.</p>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Nome do Serviço</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Corte Premium"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Categoria</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]/50">
                      <option>Cabelo</option>
                      <option>Barba</option>
                      <option>Estética</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Duração (min)</label>
                    <input 
                      type="number" 
                      placeholder="30"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Preço (R$)</label>
                  <input 
                    type="number" 
                    placeholder="0,00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]/50"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-neutral-400 hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af37]/90 transition-all"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
