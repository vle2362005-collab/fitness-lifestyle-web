"use client";
import React, { useEffect, useState } from 'react';
import apiClient from '@/services/api';
import { Dumbbell, Flame, Target } from 'lucide-react';
import Link from 'next/link';

export default function UserExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/Exercise').then(res => {
      setExercises(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-wide">KHO BÀI TẬP <span className="text-cyan-400">AI</span></h1>
        <p className="text-slate-400 mt-2">Chọn bài tập và để Camera AI đồng hành cùng bạn.</p>
      </div>

      {loading ? <div className="text-cyan-400 animate-pulse text-center p-10">Đang tải dữ liệu...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(ex => (
            <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all group">
              <div className="h-48 bg-slate-800 relative">
                {ex.imageUrl ? (
                  <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600"><Dumbbell size={48}/></div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{ex.name}</h3>
                <div className="flex gap-4 text-sm font-medium mb-6">
                  <span className="flex items-center text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full"><Flame size={14} className="mr-1"/> {ex.caloriesPerMinute} kcal/p</span>
                  <span className="flex items-center text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full"><Target size={14} className="mr-1"/> AI Ready</span>
                </div>
                <Link href="/trueformcoach" className="block text-center w-full bg-slate-800 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition-colors">
                  Tập ngay với AI
                </Link>
              </div>
            </div>
          ))}
          {exercises.length === 0 && <div className="col-span-full text-center text-slate-500">Chưa có bài tập nào.</div>}
        </div>
      )}
    </div>
  );
}