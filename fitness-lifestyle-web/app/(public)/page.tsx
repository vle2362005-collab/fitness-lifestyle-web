import Link from 'next/link';
import { Activity, Dumbbell, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden relative flex flex-col items-center justify-center">
      {/* Vòng sáng nền */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[120px]"></div>

      <div className="text-center z-10 max-w-4xl px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-cyan-400 font-medium mb-8">
          <Activity size={18} /> Đồ án Lập Trình Web - Hệ thống nhận diện tư thế AI
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
          Nâng tầm vóc dáng cùng <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">TRUEFORM AI</span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Tích hợp công nghệ TensorFlow MoveNet. Tự động nhận diện khung xương, đếm số lần lặp lại (Reps) và phân tích dinh dưỡng cá nhân hóa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-2 transition-all">
            Bắt đầu ngay <ArrowRight size={20} />
          </Link>
          <Link href="/register" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-4 px-10 rounded-xl transition-all">
            Đăng ký tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}