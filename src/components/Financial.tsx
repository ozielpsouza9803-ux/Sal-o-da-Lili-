import React, { useState } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar,
  Search,
  Plus
} from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const transactionData = [
  { id: '1', date: '2023-10-25', description: 'Corte + Barba - Marcos Oliveira', category: 'Serviço', amount: 105.00, type: 'income' },
  { id: '2', date: '2023-10-25', description: 'Venda Shampoo Professional', category: 'Venda', amount: 85.00, type: 'income' },
  { id: '3', date: '2023-10-24', description: 'Aluguel Salão', category: 'Fixo', amount: -2500.00, type: 'expense' },
  { id: '4', date: '2023-10-24', description: 'Energia Elétrica', category: 'Fixo', amount: -450.00, type: 'expense' },
  { id: '5', date: '2023-10-23', description: 'Mechas - Ana Paula', category: 'Serviço', amount: 350.00, type: 'income' },
];

const pieData = [
  { name: 'Corte', value: 4500, color: '#d4af37' },
  { name: 'Coloração', value: 3200, color: '#8b5cf6' },
  { name: 'Vendas', value: 2100, color: '#10b981' },
  { name: 'Barba', value: 1200, color: '#f59e0b' },
];

export const Financial: React.FC = () => {
  const totalIncome = 12450.80;
  const totalExpense = 4850.30;
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Financeiro</h1>
          <p className="text-neutral-400 mt-1">Controle seu fluxo de caixa, despesas e lucratividade.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-all">
            <Download size={18} />
            Exportar
          </button>
          <button className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#d4af37]/90 transition-all shadow-lg">
            <Plus size={18} />
            Lançamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ArrowUpCircle size={24} />
            </div>
            <TrendingUp size={20} className="text-emerald-500/20" />
          </div>
          <h3 className="text-neutral-400 text-sm font-medium mb-1">Receitas Brutas</h3>
          <p className="text-white text-3xl font-bold tracking-tight">{formatCurrency(totalIncome)}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-500">
            <span>+12.5% em relação ao mês anterior</span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
              <ArrowDownCircle size={24} />
            </div>
          </div>
          <h3 className="text-neutral-400 text-sm font-medium mb-1">Despesas Totais</h3>
          <p className="text-white text-3xl font-bold tracking-tight">{formatCurrency(totalExpense)}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-rose-500">
            <span>+5.2% em relação ao mês anterior</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#d4af37] to-[#8a6d1c] p-6 rounded-2xl shadow-xl shadow-[#d4af37]/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-black/20 text-white">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-black/60 text-sm font-bold mb-1">Saldo Líquido</h3>
          <p className="text-black text-3xl font-black tracking-tight">{formatCurrency(balance)}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-black/50">
            <span>Margem de lucro: 61%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Receitas por Categoria</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: 'none', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-neutral-400 text-xs font-medium">{item.name}</span>
                <span className="text-white text-xs font-bold ml-auto">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Últimas Transações</h2>
            <button className="text-xs text-[#d4af37] font-bold hover:underline">Ver todas</button>
          </div>
          <div className="space-y-4">
            {transactionData.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    tx.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {tx.type === 'income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold truncate max-w-[200px]">{tx.description}</h4>
                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <div className={cn(
                  "font-bold text-sm",
                  tx.type === 'income' ? "text-emerald-500" : "text-rose-500"
                )}>
                  {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
