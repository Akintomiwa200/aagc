import React, { useState } from 'react';
import { CreditCard, History, Heart, CheckCircle, Loader2, DollarSign, Wallet, Target, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useGiving } from '../hooks/useAppHooks';

export const Giving: React.FC = () => {
  const { history, give } = useGiving();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Tithe' | 'Offering' | 'Missions' | 'Building'>('Offering');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGive = async () => {
    if (!amount) return;
    setProcessing(true);
    await give(type as any, Number(amount));
    setProcessing(false);
    setSuccess(true);
    setTimeout(() => {
        setSuccess(false);
        setAmount('');
    }, 4000);
  };

  const presetAmounts = [20, 50, 100, 250, 500, 1000];

  const categories = [
    { id: 'Offering', name: 'Free Will', icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { id: 'Tithe', name: 'Tithe', icon: ShieldCheck, color: 'bg-primary-100 text-primary-600' },
    { id: 'Missions', name: 'Evangelism', icon: Globe, color: 'bg-blue-100 text-blue-600' },
    { id: 'Building', name: 'Church Project', icon: Target, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="pb-24 p-4 space-y-8 bg-gray-50 dark:bg-black min-h-screen">
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Financial Seeds</h1>
        <p className="text-[10px] text-primary-600 dark:text-primary-400 font-black uppercase tracking-[0.3em]">Kingdom Dominion Finance</p>
      </div>

      {/* Campaign Progress Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-primary-500/20">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-45">
            <DollarSign size={160} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 text-primary-400 mb-4 bg-white/5 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                <Target size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">November Building Seed</span>
            </div>
            <h2 className="text-4xl font-black mb-8 tracking-tighter">$1,240.00</h2>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-4 border border-white/5">
                <div className="bg-primary-500 h-full w-[62%] rounded-full shadow-[0_0_20px_rgba(184,146,37,0.8)] animate-pulse" />
            </div>
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="text-primary-300">62% Manifested</span>
                <span>$2,000.00 Target</span>
            </div>
        </div>
      </div>

      {/* Planting Form */}
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative">
          {success ? (
              <div className="text-center py-12 animate-in zoom-in duration-700">
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/40 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20 rotate-12">
                      <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Seed Accepted!</h3>
                  <p className="text-sm text-gray-500 font-medium italic">"He who supplies seed to the sower will also supply bread for food and multiply your seed for sowing."</p>
              </div>
          ) : (
              <div className="space-y-10">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Seed Category</label>
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Select One</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setType(cat.id as any)}
                                    className={`p-6 rounded-[2rem] flex flex-col items-center gap-3 border-2 transition-all ${
                                        type === cat.id 
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg' 
                                        : 'border-transparent bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className={`p-3 rounded-2xl ${cat.color} ${type === cat.id ? 'shadow-xl' : ''}`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${type === cat.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-500'}`}>{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Seed Value</label>
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">USD Currency</span>
                    </div>
                    <div className="relative mb-6">
                        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300">$</span>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-16 pr-8 py-8 bg-gray-50 dark:bg-gray-800/80 border-none rounded-[2rem] text-4xl font-black text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 outline-none placeholder:text-gray-200 tracking-tighter"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                        {presetAmounts.map(val => (
                            <button 
                                key={val}
                                onClick={() => setAmount(val.toString())}
                                className={`px-6 py-4 rounded-2xl text-xs font-black transition-all border-2 whitespace-nowrap ${
                                    amount === val.toString() 
                                    ? 'bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/30' 
                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-200'
                                }`}
                            >
                                ${val}
                            </button>
                        ))}
                    </div>
                </div>

                <Button 
                    fullWidth 
                    size="lg" 
                    onClick={handleGive}
                    disabled={!amount || processing}
                    className="h-20 rounded-[1.75rem] text-xl font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(184,146,37,0.4)] bg-gradient-to-tr from-primary-600 to-primary-400 border-0"
                >
                    {processing ? <Loader2 className="animate-spin mr-3" /> : <CreditCard className="mr-3" />}
                    {processing ? 'Processing Seed...' : 'Plant Your Seed'}
                </Button>
              </div>
          )}
      </div>

      {/* Stewardship Records */}
      <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight">Faith History</h3>
            <div className="p-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <History size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="space-y-4 px-2">
              {history.map((tx) => (
                  <div key={tx.id} className="p-6 bg-white dark:bg-gray-900 rounded-[2rem] flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary-200 transition-all cursor-pointer group">
                      <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tx.type === 'Tithe' ? 'bg-primary-50 text-primary-600' : 'bg-blue-50 text-blue-600'} group-hover:scale-110 transition-transform shadow-sm`}>
                              {tx.type === 'Tithe' ? <ShieldCheck size={24} /> : <Heart size={24} />}
                          </div>
                          <div>
                              <p className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest">{tx.type}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{tx.date}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-black text-gray-900 dark:text-white text-xl tracking-tight">${tx.amount.toFixed(2)}</p>
                          <p className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em] mt-1">Confirmed</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};