"use client";
import React, { useEffect, useState } from 'react';
import apiClient from '@/services/api';
import { Activity, Flame, Clock, Trophy, Target } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    caloriesBurned: 0,
    totalMinutes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/Dashboard');
        if (res.data) {
          setStats({
            totalWorkouts: res.data.totalWorkouts || 0,
            caloriesBurned: res.data.caloriesBurned || 0,
            totalMinutes: res.data.totalMinutes || 0
          });
        }
      } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center text-cyan-400 animate-pulse">Đang đồng bộ dữ liệu...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-wide">TỔNG QUAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">HOẠT ĐỘNG</span></h1>
        <p className="text-slate-400 mt-2 text-lg">Theo dõi tiến trình luyện tập của bạn hôm nay.</p>
      </div>

      {/* THẺ THỐNG KÊ (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-slate-400 font-medium">Buổi tập hoàn thành</h3>
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg"><Activity size={20}/></div>
          </div>
          <p className="text-4xl font-black text-white relative z-10">{stats.totalWorkouts}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-orange-500/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-slate-400 font-medium">Calories đốt cháy</h3>
            <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg"><Flame size={20}/></div>
          </div>
          <p className="text-4xl font-black text-white relative z-10">{stats.caloriesBurned} <span className="text-lg font-normal text-slate-500">kcal</span></p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-slate-400 font-medium">Thời gian tập</h3>
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Clock size={20}/></div>
          </div>
          <p className="text-4xl font-black text-white relative z-10">{stats.totalMinutes} <span className="text-lg font-normal text-slate-500">phút</span></p>
        </div>
      </div>

      {/* VÙNG ĐIỀU HƯỚNG NHANH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl flex flex-col items-start justify-between">
          <div>
            <div className="p-3 bg-blue-500/20 text-blue-400 w-max rounded-xl mb-4"><Target size={28}/></div>
            <h2 className="text-2xl font-bold text-white mb-2">Bắt đầu tập luyện ngay!</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">Hệ thống AI MoveNet đã sẵn sàng đếm Reps và chấm điểm tư thế cho bạn.</p>
          </div>
          <Link href="/trueformcoach" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all">
            Mở Camera AI
          </Link>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl flex flex-col items-start justify-between">
          <div>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 w-max rounded-xl mb-4"><Trophy size={28}/></div>
            <h2 className="text-2xl font-bold text-white mb-2">Nhật ký Dinh dưỡng</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">Đừng quên ghi lại các bữa ăn hôm nay để đảm bảo lượng calo nạp vào hợp lý.</p>
          </div>
          <Link href="/nutrition" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all">
            Cập nhật Bữa ăn
          </Link>
        </div>
      </div>
    </div>
  );
}