import React, { useState } from 'react';
import { Plus, Search, Package, ShoppingCart, AlertCircle, Edit2, Trash2, Tag, Image as ImageIcon } from 'lucide-react';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { formatCurrency } from '@/src/lib/utils';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  imageUrl?: string;
}

export const Products: React.FC = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', [
    { id: '1', name: 'Shampoo Professional 1L', category: 'Cabelo', price: 85.00, stock: 12, minStock: 5 },
    { id: '2', name: 'Pomada Efeito Matte', category: 'Finalização', price: 45.00, stock: 3, minStock: 10 },
    { id: '3', name: 'Óleo para Barba', category: 'Barba', price: 35.00, stock: 25, minStock: 5 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Produtos & Estoque</h1>
          <p className="text-neutral-400 mt-1">Gerencie seu inventário e vendas de balcão.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af37]/90 transition-all shadow-lg"
        >
          <Plus size={20} />
          Cadastrar Produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Package size={20} />
            </div>
            <span className="text-neutral-400 text-sm font-medium">Total de Itens</span>
          </div>
          <p className="text-2xl font-bold text-white">{products.length} Produtos</p>
        </div>
        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
              <AlertCircle size={20} />
            </div>
            <span className="text-neutral-400 text-sm font-medium">Estoque Baixo</span>
          </div>
          <p className="text-2xl font-bold text-white">{products.filter(p => p.stock < p.minStock).length} Itens</p>
        </div>
        <div className="bg-[#111111] border border-[#d4af37]/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <Tag size={20} />
            </div>
            <span className="text-neutral-400 text-sm font-medium">Valor em Estoque</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(products.reduce((acc, p) => acc + (p.price * p.stock), 0))}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
        <input 
          type="text"
          placeholder="Buscar produtos..."
          className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#d4af37]/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#d4af37]/30 transition-all group">
            <div className="aspect-square bg-neutral-900 flex items-center justify-center relative">
              <ImageIcon size={40} className="text-neutral-800" />
              {product.stock < product.minStock && (
                <div className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                  ESTOQUE BAIXO
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div>
                <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">{product.category}</span>
                <h3 className="text-white font-bold group-hover:text-[#d4af37] transition-colors line-clamp-1">{product.name}</h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-neutral-500 text-xs">Preço Venda</p>
                  <p className="text-white font-bold">{formatCurrency(product.price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-500 text-xs">Qtd. Estoque</p>
                  <p className={cn(
                    "font-bold",
                    product.stock < product.minStock ? "text-rose-500" : "text-white"
                  )}>{product.stock} un</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm">
                  <Edit2 size={14} />
                  Editar
                </button>
                <button className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-all">
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#d4af37]/30 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Cadastrar Novo Produto</h3>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Nome do Produto</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Categoria</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50">
                      <option>Cabelo</option>
                      <option>Barba</option>
                      <option>Finalização</option>
                      <option>Acessórios</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Preço de Venda (R$)</label>
                    <input type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Estoque Inicial</label>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37]/50" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl font-bold text-neutral-400 hover:bg-white/5">Cancelar</button>
                  <button type="submit" className="flex-1 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af37]/90">Salvar Produto</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
