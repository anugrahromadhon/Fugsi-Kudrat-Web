"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Download, Eraser, Trash2, Palette, RefreshCw, Pencil } from 'lucide-react';

export default function DrawingApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [tool, setTool] = useState('pen');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      title: "Soal 1: Gambar Damar Kurung",
      description: "Pak Ali membuat gambar di kertas damar kurung. Gambar pasar tradisional menutupi ⅓ bagian kertas. Gambar perahu menutupi ⅙ bagian kertas. Berapakah bagian kertas yang sudah terisi gambar seluruhnya?",
      hint: "Total = ⅓ + ⅙ = 2/6 + 1/6 = 3/6 = ½ (setengah kertas)",
      image: "gambar/soal2.png"
    },
    {
      title: "Soal 2: Lentera Damar Kurung",
      description: "Damar Kurung menggunakan lampu sebagai sumber cahaya, dimana cahaya tersebut merambat lurus dan menembus kertas, sehingga gambar di kertas tampak bersinar. Di festival Damar Kurung, terdapat 10 lentera yang terbuat dari kertas bergambar. Setengah (½) dari banyaknya lentera itu sudah menyala. Berapakah jumlah lentera yang lampunya sudah menyala?",
      hint: "½ × 10 = 5 lentera",
      image: "gambar/soal3.png"
    },
    {
      title: "Soal 3: Kertas Damar Kurung Rusak",
      description: "Pengrajin telah melukis 4/5 bagian kertas dengan berbagai motif. Dalam proses pengeringan, sayangnya 1/5 bagian lukisan itu rusak karena terciprat air. Berapakah sisa pecahan bagian kertas Damar Kurung yang lukisannya masih utuh?",
      hint: "4/5 - 1/5 = 3/5 (tiga per lima masih utuh)",
      image: "gambar/soal1.png"
    }
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FF8800', '#8B4513'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const width = canvas.offsetWidth || 800;
    // Tinggi canvas tetap 750px sesuai request sebelumnya
    const height = canvas.offsetHeight || 750;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color || '#000000';
    ctx.lineWidth = brushSize || 5;
    ctx.scale(dpr, dpr);

    return () => {};
  }, [color, brushSize]);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    (e.target as HTMLCanvasElement).setPointerCapture?.(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    (e.target as HTMLCanvasElement).releasePointerCapture?.(e.pointerId);
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = (typeof window !== "undefined" ? window.devicePixelRatio : 1) || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
  };

  const exportImage = (format: "png" | "jpeg" = "png") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mime = format === "jpeg" ? "image/jpeg" : "image/png";
    const title = (questions && questions[currentQuestion]?.title) || "drawing";
    const safeTitle = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const filename = `gambar-${safeTitle}.${format}`;
    const dataUrl = canvas.toDataURL(mime);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
    clearCanvas();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🎨 Papan Gambar Digital - Damar Kurung
        </h1>

        {/* Layout Grid 2 Kolom dengan tinggi yang sama */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          
          {/* Panel Soal - Kiri */}
          <div className="lg:col-span-1">
            {/* UBAH: Ditambahkan 'h-full flex flex-col' agar tinggi panel ini memenuhi kolom grid */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  📝 Soal {currentQuestion + 1}/{questions.length}
                </h2>
                <button
                  onClick={nextQuestion}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  title="Soal Berikutnya"
                >
                  <RefreshCw size={20} />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {questions[currentQuestion].title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  {questions[currentQuestion].description}
                </p>
                {questions[currentQuestion].hint && (
                  <div className="p-2 bg-green-50 border-l-4 border-green-400 rounded mb-3">
                    <p className="text-sm text-green-800">
                      💡 <strong>Petunjuk:</strong> {questions[currentQuestion].hint}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">
                  Contoh Gambar:
                </h4>
                <div className="flex justify-center items-center bg-white p-4 rounded">
                  <img 
                    src={questions[currentQuestion].image} 
                    alt={questions[currentQuestion].title}
                    className="w-full h-auto max-w-md rounded shadow-sm"
                  />
                </div>
              </div>

              {/* UBAH: Ditambahkan 'mt-auto' agar tips ini terdorong ke paling bawah */}
              <div className="mt-auto p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Tips:</strong> Lihat contoh gambar di atas sebagai referensi, lalu coba gambar versi kamu sendiri!
                </p>
              </div>
            </div>
          </div>

          {/* Panel Gambar - Kanan */}
          <div className="lg:col-span-1 flex flex-col">
            
            {/* Toolbar Tipis */}
            <div className="bg-white rounded-lg shadow-lg p-2 mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setTool('pen')}
                    className={`p-2 rounded-md transition ${
                      tool === 'pen' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Pena"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded-md transition ${
                      tool === 'eraser' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Penghapus"
                  >
                    <Eraser size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">
                  <input
                    type="range" min="1" max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    title="Ukuran Kuas"
                  />
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-7 h-7 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    {showColorPicker && (
                      <div className="absolute top-10 right-0 bg-white rounded-lg shadow-xl p-2 z-10 grid grid-cols-5 gap-1 w-40">
                        {colors.map((c) => (
                          <button
                            key={c}
                            onClick={() => { setColor(c); setShowColorPicker(false); }}
                            className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={clearCanvas}
                    className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition"
                    title="Bersihkan Kanvas"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() => exportImage('png')}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                    title="Download Gambar"
                  >
                    <Download size={20} />
                  </button>
                </div>
            </div>

            {/* Canvas Tinggi */}
            <div className="bg-white rounded-lg shadow-lg p-2 h-full">
              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className="w-full border-2 border-gray-300 rounded cursor-crosshair touch-none"
                style={{ height: '750px' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
