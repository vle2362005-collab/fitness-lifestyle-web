"use client";
import React, { useEffect, useState } from 'react';
import apiClient from '@/services/api';
import { Dumbbell, Trash2, Edit, Save, X } from 'lucide-react';

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [aiConfig, setAiConfig] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchExercises = async () => {
    try {
      const res = await apiClient.get('/Exercise');
      setExercises(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchExercises(); }, []);

  const resetForm = () => { setName(''); setCalories(''); setAiConfig(''); setImageFile(null); setIsEditing(false); setEditId(null); };

  const handleEditClick = (ex: any) => {
    setName(ex.name); setCalories(ex.caloriesPerMinute.toString()); setAiConfig(ex.aiConfig || ''); setImageFile(null);
    setIsEditing(true); setEditId(ex.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('CaloriesPerMinute', calories);
    formData.append('AiConfig', aiConfig);
    if (imageFile) formData.append('ImageFile', imageFile);

    try {
      if (isEditing && editId) await apiClient.put(`/Exercise/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      else await apiClient.post('/Exercise', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      alert("Lưu thành công!"); resetForm(); fetchExercises();
    } catch (error) { alert("Lỗi khi lưu dữ liệu!"); }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Chắc chắn xóa?")) { await apiClient.delete(`/Exercise/${id}`); fetchExercises(); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <Dumbbell className="text-emerald-400" size={32} />
        <h1 className="text-3xl font-bold text-white">Quản lý Bài tập</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Sửa bài tập' : 'Thêm bài tập mới'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm text-slate-400">Tên bài tập</label><input required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="text-sm text-slate-400">Calories/Phút</label><input required type="number" value={calories} onChange={e=>setCalories(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="text-sm text-slate-400">Cấu hình AI</label><input value={aiConfig} onChange={e=>setAiConfig(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="text-sm text-slate-400">Hình ảnh</label><input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-emerald-500/20 file:text-emerald-400" /></div>
          <div className="col-span-full flex gap-3 mt-2">
            <button type="submit" className="bg-emerald-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Save size={18}/> Lưu</button>
            {isEditing && <button type="button" onClick={resetForm} className="bg-slate-800 px-6 py-3 rounded-xl font-bold"><X size={18}/> Hủy</button>}
          </div>
        </form>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400"><tr><th className="p-4">Ảnh</th><th className="p-4">Tên bài</th><th className="p-4">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-slate-800">
            {exercises.map(ex => (
              <tr key={ex.id} className="hover:bg-slate-800/50">
                <td className="p-4">{ex.imageUrl ? <img src={ex.imageUrl} className="w-16 h-12 object-cover rounded-lg"/> : '-'}</td>
                <td className="p-4 font-bold">{ex.name}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEditClick(ex)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(ex.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}