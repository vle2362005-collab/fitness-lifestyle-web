"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Activity, CheckCircle2, Play, Square, Trophy } from 'lucide-react';
import apiClient from '@/services/api';

export default function TrueFormCoachPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [feedback, setFeedback] = useState("Đang tải lõi AI từ Cloud...");
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedEx, setSelectedEx] = useState<any>(null);
  
  const [workoutState, setWorkoutState] = useState<'idle' | 'tracking' | 'summary'>('idle');
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [accuracyScores, setAccuracyScores] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  
  const requestRef = useRef<number>();
  const movementPhase = useRef<'up' | 'down'>('up');
  const lastY = useRef<number>(0);
  const REPS_PER_SET = 12;

  useEffect(() => {
    apiClient.get('/Exercise').then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setExercises(data);
      if(data.length > 0) setSelectedEx(data[0]);
    }).catch(() => setFeedback("Không lấy được dữ liệu bài tập."));
  }, []);

  // HÀM TOÁN HỌC: TÍNH GÓC GIỮA 3 ĐIỂM XƯƠNG (VD: Vai - Khuỷu tay - Cổ tay)
  const calculateAngle = (a: any, b: any, c: any) => {
    let radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  useEffect(() => {
    let detector: any;
    const loadScript = (src: string) => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      const script = document.createElement('script'); script.src = src; script.async = true;
      script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
    });

    const setupAI = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
        await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection");
        const tf = (window as any).tf;
        const poseDetection = (window as any).poseDetection;
        await tf.ready();
        detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING });
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              setIsReady(true);
              setFeedback("AI Đã Sẵn Sàng!");
              detectPose();
            };
          }
        }
      } catch (err) { setFeedback("Lỗi Camera!"); }
    };

    const detectPose = async () => {
      if (videoRef.current && canvasRef.current && detector) {
        const poses = await detector.estimatePoses(videoRef.current);
        drawSkeleton(poses);
        if (workoutState === 'tracking') analyzePose(poses);
        requestRef.current = requestAnimationFrame(detectPose);
      }
    };

    const drawSkeleton = (poses: any[]) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || poses.length === 0) return;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      poses[0].keypoints.forEach((kp: any) => {
        if (kp.score && kp.score > 0.3) {
          ctx.beginPath(); ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = '#06b6d4'; ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.stroke();
        }
      });
    };

    // THUẬT TOÁN ĐẾM REP SIÊU THÔNG MINH DỰA TRÊN CẤU HÌNH AI (JSON)
    const analyzePose = (poses: any[]) => {
      if (poses.length === 0) return;
      const keypoints = poses[0].keypoints;
      const avgScore = keypoints.reduce((sum: number, kp: any) => sum + kp.score, 0) / keypoints.length;
      if (avgScore < 0.3) { setFeedback("Đứng xa ra để AI nhìn rõ toàn thân!"); return; }

      // 1. Phân tích Cấu hình AI từ Admin (JSON)
      let aiConfig: any = {};
      try {
        if (selectedEx?.aiConfig) aiConfig = JSON.parse(selectedEx.aiConfig);
      } catch (e) { console.error("Lỗi parse JSON cấu hình AI"); }

      // 2. LOGIC TÍNH REP THEO TỪNG BÀI TẬP
      if (aiConfig.type === 'pushup') {
        // --- BÀI HÍT ĐẤT (Tính góc KHUỶU TAY) ---
        const shoulder = keypoints.find((k:any) => k.name === 'left_shoulder');
        const elbow = keypoints.find((k:any) => k.name === 'left_elbow');
        const wrist = keypoints.find((k:any) => k.name === 'left_wrist');
        const targetAngle = aiConfig.targetAngle || 90; 

        if (shoulder && elbow && wrist && shoulder.score > 0.4 && elbow.score > 0.4) {
          const angle = calculateAngle(shoulder, elbow, wrist);
          
          if (angle > 150 && movementPhase.current === 'down') {
            // Đẩy lên thẳng tay -> TÍNH 1 REP
            movementPhase.current = 'up';
            countRep(avgScore);
          } else if (angle < targetAngle) {
            // Gập tay xuống < 90 độ
            movementPhase.current = 'down';
            setFeedback("Góc đẹp! Đẩy mạnh lên!");
          } else {
            setFeedback(`Hạ khuỷu tay xuống nữa! (Góc: ${Math.round(angle)}°)`);
          }
        } else {
          setFeedback("Vui lòng quay ngang người để AI thấy cánh tay!");
        }

      } else if (aiConfig.type === 'squat') {
        // --- BÀI SQUAT (Tính góc ĐẦU GỐI) ---
        const hip = keypoints.find((k:any) => k.name === 'left_hip');
        const knee = keypoints.find((k:any) => k.name === 'left_knee');
        const ankle = keypoints.find((k:any) => k.name === 'left_ankle');
        const targetAngle = aiConfig.targetAngle || 100;

        if (hip && knee && ankle && hip.score > 0.4 && knee.score > 0.4) {
          const angle = calculateAngle(hip, knee, ankle);
          
          if (angle > 160 && movementPhase.current === 'down') {
            movementPhase.current = 'up';
            countRep(avgScore);
          } else if (angle < targetAngle) {
            movementPhase.current = 'down';
            setFeedback("Đùi đã song song! Đứng lên!");
          } else {
            setFeedback(`Ngồi sâu xuống nữa! (Góc: ${Math.round(angle)}°)`);
          }
        }

      } else {
        // --- BÀI TỰ DO (Tính theo trục Y của mũi - mặc định cũ) ---
        const nose = keypoints.find((k: any) => k.name === 'nose');
        if (nose && nose.score > 0.5) {
          if (lastY.current === 0) lastY.current = nose.y;
          if (movementPhase.current === 'up' && nose.y > lastY.current + 40) {
            movementPhase.current = 'down'; lastY.current = nose.y;
          } 
          else if (movementPhase.current === 'down' && nose.y < lastY.current - 40) {
            movementPhase.current = 'up'; lastY.current = nose.y;
            countRep(avgScore);
          }
        }
      }
    };

    const countRep = (score: number) => {
      setReps(prevReps => {
        const newReps = prevReps + 1;
        setAccuracyScores(prev => [...prev, Math.min(100, Math.round(score * 100) + 15)]);
        if (newReps >= REPS_PER_SET) {
          setSets(s => s + 1);
          setFeedback(`Hoàn thành Set! Chờ 3s nghỉ ngơi.`);
          return 0; 
        }
        setFeedback(`Tốt lắm! Đếm: ${newReps}/${REPS_PER_SET}`);
        return newReps;
      });
    };

    setupAI();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [workoutState, selectedEx]);

  const startWorkout = () => { setWorkoutState('tracking'); setReps(0); setSets(0); setAccuracyScores([]); setStartTime(Date.now()); setFeedback("Bắt đầu!"); };
  const stopWorkout = async () => { 
    setFeedback("Đang lưu...");
    const durationMinutes = Math.max(1, Math.ceil((Date.now() - startTime) / 60000)); 
    try {
      await apiClient.post('/Workout', {
        exerciseId: selectedEx?.id || 1, 
        durationMinutes: durationMinutes,
        caloriesBurned: durationMinutes * (selectedEx?.caloriesPerMinute || 8)
      });
    } catch (error) { console.error(error); }
    setWorkoutState('summary'); 
  };
  
  const finalAccuracy = accuracyScores.length > 0 ? Math.round(accuracyScores.reduce((a,b)=>a+b,0) / accuracyScores.length) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-10">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-cyan-400" size={32} />
        <h1 className="text-3xl font-bold">TrueForm AI Camera</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT CAMERA & KẾT QUẢ */}
        <div className="lg:col-span-2 relative bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.1)] h-[550px] flex items-center justify-center">
          {workoutState !== 'summary' ? (
            <>
              {!isReady && <div className="absolute z-20 flex flex-col items-center text-cyan-400 font-bold animate-pulse"><RefreshCw className="animate-spin mb-4" size={40}/> {feedback}</div>}
              <video ref={videoRef} className="absolute w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
              <canvas ref={canvasRef} className="absolute w-full h-full object-cover transform scale-x-[-1] z-10" width={640} height={480} />
              
              {isReady && (
                <div className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur-md border border-slate-700 p-4 rounded-2xl flex gap-6">
                  <div className="text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Reps</p>
                    <p className="text-3xl font-black text-white">{reps}<span className="text-lg text-slate-500">/{REPS_PER_SET}</span></p>
                  </div>
                  <div className="w-px bg-slate-700"></div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Sets</p>
                    <p className="text-3xl font-black text-cyan-400">{sets}</p>
                  </div>
                </div>
              )}
              {isReady && workoutState === 'tracking' && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-cyan-600/90 backdrop-blur-md px-8 py-3 rounded-full text-white font-bold tracking-wide z-20 shadow-xl transition-all whitespace-nowrap">
                  {feedback}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-slate-900 z-30 p-10 flex flex-col items-center justify-center animate-in zoom-in-95">
              <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
              <h2 className="text-4xl font-black text-white mb-2">HOÀN THÀNH XUẤT SẮC!</h2>
              <p className="text-slate-400 mb-10 text-lg">Bài tập: {selectedEx?.name}</p>
              <div className="flex gap-8 mb-10">
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl text-center w-40">
                  <p className="text-slate-400 text-sm mb-2">Tổng Sets</p>
                  <p className="text-4xl font-black text-cyan-400">{sets}</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl text-center w-40">
                  <p className="text-slate-400 text-sm mb-2">Tổng Reps</p>
                  <p className="text-4xl font-black text-blue-400">{sets * REPS_PER_SET + reps}</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl text-center w-40 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                  <p className="text-slate-400 text-sm mb-2">Độ chính xác</p>
                  <p className="text-4xl font-black text-emerald-400">{finalAccuracy > 0 ? finalAccuracy : 0}%</p>
                </div>
              </div>
              <button onClick={() => setWorkoutState('idle')} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-10 rounded-full border border-slate-600 transition-all">
                Tập bài khác
              </button>
            </div>
          )}
        </div>

        {/* CỘT ĐIỀU KHIỂN & CHỌN BÀI TẬP */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[550px] flex flex-col">
          <div className="mb-8">
            {workoutState === 'idle' && (
              <button disabled={!isReady} onClick={startWorkout} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                <Play fill="currentColor" size={24}/> BẮT ĐẦU TẬP
              </button>
            )}
            {workoutState === 'tracking' && (
              <button onClick={stopWorkout} className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all animate-pulse">
                <Square fill="currentColor" size={24}/> KẾT THÚC BÀI TẬP
              </button>
            )}
            {workoutState === 'summary' && (
              <div className="w-full bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3">
                <CheckCircle2 size={24}/> ĐÃ LƯU KẾT QUẢ
              </div>
            )}
          </div>

          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Camera className="text-slate-400" size={20}/> Chọn bài tập</h2>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {exercises.map(ex => (
              <button
                key={ex.id}
                disabled={workoutState === 'tracking'} 
                onClick={() => setSelectedEx(ex)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${selectedEx?.id === ex.id ? 'bg-cyan-500/10 border border-cyan-500 text-cyan-400' : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent text-slate-300'}`}
              >
                <div className="font-bold text-lg">{ex.name}</div>
                <div className="text-xs mt-1 text-slate-500">Cấu hình AI: {ex.aiConfig || 'Mặc định (Nhịp thở)'}</div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}