"use client";
import React, { useEffect, useMemo, useState } from "react";
import apiClient from "@/services/api";
import { Plus, X, Utensils } from "lucide-react";

export default function NutritionPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");

  const maxCal = 2500;

  const fetchLogs = async () => {
    try {
      const res = await apiClient.get("/Nutrition");
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      
      setLogs([
        {
          id: 1,
          foodName: "Cơm gà nướng",
          calories: 650,
          protein: 45,
          carbs: 60,
          fat: 15,
        },
        {
          id: 2,
          foodName: "Sữa tăng cơ Whey",
          calories: 120,
          protein: 25,
          carbs: 3,
          fat: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // TÍNH TỔNG TỪ DANH SÁCH LOGS
  const stats = useMemo(() => {
    const currentCal = logs.reduce(
      (sum, item) => sum + Number(item.calories || 0),
      0
    );
    const protein = logs.reduce(
      (sum, item) => sum + Number(item.protein || 0),
      0
    );
    const carbs = logs.reduce(
      (sum, item) => sum + Number(item.carbs || 0),
      0
    );
    const fat = logs.reduce((sum, item) => sum + Number(item.fat || 0), 0);

    return {
      currentCal,
      maxCal,
      protein,
      carbs,
      fat,
    };
  }, [logs]);

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();

    const newFood = {
      id: Date.now(),
      foodName,
      calories: Number(calories),
      protein: 0,
      carbs: 0,
      fat: 0,
      date: new Date().toISOString(),
    };

    try {
      await apiClient.post("/Nutrition", {
        foodName,
        calories: Number(calories),
        date: new Date().toISOString(),
      });
    } catch (err) {
      // Nếu API lỗi vẫn thêm vào UI để demo
    }

    // Luôn thêm vào logs để giao diện cập nhật ngay
    setLogs((prev) => [newFood, ...prev]);

    setShowModal(false);
    setFoodName("");
    setCalories("");
  };

  const handleDeleteFood = (id: number) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const calPercent = Math.min((stats.currentCal / stats.maxCal) * 100, 100);
  const proteinPercent = Math.min((stats.protein / 150) * 100, 100);
  const carbsPercent = Math.min((stats.carbs / 300) * 100, 100);
  const fatPercent = Math.min((stats.fat / 70) * 100, 100);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* CỘT TRÁI: TIẾN ĐỘ HÔM NAY */}
        <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <span className="text-emerald-400">🍎</span> Tiến độ hôm nay
          </h2>

          <div className="flex justify-center mb-8 relative">
            <div className="w-40 h-40 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
              <div
                className="absolute inset-0 rounded-full border-8 border-cyan-400 border-t-transparent border-l-transparent transform -rotate-45"
                style={{
                  opacity: calPercent > 0 ? 1 : 0.15,
                }}
              ></div>
              <div className="text-center">
                <p className="text-3xl font-black text-white">
                  {stats.currentCal}
                </p>
                <p className="text-xs text-slate-500">
                  / {stats.maxCal} kcal
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Protein (Đạm)</span>
                <span className="text-slate-500">
                  {stats.protein} / 150g
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${proteinPercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Carbs (Tinh bột)</span>
                <span className="text-slate-500">
                  {stats.carbs} / 300g
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${carbsPercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Fat (Chất béo)</span>
                <span className="text-slate-500">
                  {stats.fat} / 70g
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${fatPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: NHẬT KÝ */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Nhật ký ăn uống</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Plus size={18} /> Thêm món
            </button>
          </div>

          {loading ? (
            <p className="text-slate-400">Đang tải dữ liệu...</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl flex justify-between items-center hover:bg-slate-800 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {log.foodName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      P: {log.protein || 0}g • C: {log.carbs || 0}g • F:{" "}
                      {log.fat || 0}g
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xl font-black text-cyan-400">
                      {log.calories} kcal
                    </div>
                    <button
                      onClick={() => handleDeleteFood(log.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POPUP THÊM MÓN ĂN */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Utensils className="text-cyan-400" /> Thêm món mới
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddFood} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Tên món ăn
                </label>
                <input
                  required
                  autoFocus
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="VD: Phở bò"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Lượng Calories (kcal)
                </label>
                <input
                  required
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="VD: 450"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-colors mt-2"
              >
                Lưu vào nhật ký
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}