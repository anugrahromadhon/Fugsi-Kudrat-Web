"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Download, Eraser, Trash2, RefreshCw, Pencil, CheckCircle, XCircle } from 'lucide-react';

type Question = {
  title: string;
  label: string;
  description: React.ReactNode;
  hint: string;
  hasOptions?: boolean;
  options?: { label: string; value: string; correct: boolean }[];
  drawGraph: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
};

function drawAxesAndGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  ox: number,
  oy: number,
  scx: number,
  scy: number,
  xMax: number,
  yMax: number
) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // grid
  ctx.strokeStyle = '#e8edf2';
  ctx.lineWidth = 0.8;
  for (let i = 0; i * scx <= w - ox; i++) {
    const gx = ox + i * scx;
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
  }
  for (let i = 0; i * scy <= oy; i++) {
    const gy = oy - i * scy;
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
  }

  // axes
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();

  // axis labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px ui-monospace, monospace';
  ctx.textAlign = 'center';
  for (let i = 2; i * scx + ox <= w - 10; i += 2) {
    ctx.fillText(String(i), ox + i * scx, oy + 14);
  }
  ctx.textAlign = 'right';
  for (let i = 1; oy - i * scy >= 10; i++) {
    ctx.fillText(String(i), ox - 5, oy - i * scy + 4);
  }

  // axis arrows & labels
  ctx.fillStyle = '#64748b';
  ctx.font = '12px ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('x', w - 14, oy + 4);
  ctx.textAlign = 'center';
  ctx.fillText('y', ox, 10);
}

const questions: Question[] = [
  {
    title: 'Soal 1',
    label: 'Ketinggian Peluru',
    description: (
      <span>
        Seorang pegawai pembuatan senjata mencoba mencari tau berapa ketinggian (meter) maksimal yang bisa
        dicapai peluru menggunakan Chronograph, diperoleh persamaan pergerakannya:
        <br /><br />
        <span style={{ display: 'block', textAlign: 'center', fontSize: '1.15rem', fontWeight: 600, color: '#1e40af', fontFamily: 'Georgia, serif' }}>
          f(x) = &minus;&frac14;x&sup2; + 2x &minus; 2
        </span>
        <br />
        Setelah gambar diperoleh, diketahui bahwa peluru melesat diluar jangkauan radar. Melalui persamaan
        yang diperoleh selidikilah berapa ketinggian yang dicapai peluru tersebut!
        <br /><br />
        <img
          src="gambar/soalfk1.png"
          alt="Referensi Soal 1"
          style={{ width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
      </span>
    ),
    hint: 'Gunakan rumus titik puncak: x = −b/(2a). Dengan a = −¼ dan b = 2, maka x = 4. Substitusi x=4 ke f(x) untuk mendapatkan tinggi maksimum = 2 meter.',
    drawGraph: (ctx, w, h) => {
      // Soal 1: canvas putih kosong sepenuhnya
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    title: 'Soal 2',
    label: 'Dua Roket',
    description: (
      <span>
        Dua buah roket mainan ditembakkan secara bersamaan dari titik awal yang sama. Grafik di bawah
        menggambarkan sebagian lintasan parabola dari kedua roket tersebut.
        <br /><br />
        Berdasarkan potongan grafik tersebut, roket manakah yang diprediksi akan jatuh menyentuh tanah
        yang <strong>lebih jauh</strong> dari titik tembak?
        <br /><br />
        <img
          src="gambar/soalfk2.png"
          alt="Referensi Soal 2"
          style={{ width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
      </span>
    ),
    hint: 'Perhatikan titik nol (x-intercept) masing-masing parabola. f(x) = −½x²+5/2·x → nol di x=5 (titik jatuh). g(x) = −x²+4x → nol di x=4. Karena 5 > 4, roket f(x) mendarat lebih jauh.',
    hasOptions: true,
    options: [
      { label: 'f(x)', value: 'fx', correct: true },
      { label: 'g(x)', value: 'gx', correct: false },
    ],
    drawGraph: (ctx, w, h) => {
      // Soal 2: f(x) = -½x² + 5/2·x  (0 ≤ x ≤ 2.5)  → kuning/oranye
      //         g(x) = -x²  + 4x      (0 ≤ x ≤ 2)    → merah muda
      // Skala: x 0–5, y 0–4.5
      // Grafik diperkecil ke pojok kiri atas, sisanya ruang menulis
      const ox = 45, oy = Math.floor(h * 0.52), scx = (w * 0.48) / 5, scy = (oy - 20) / 4.5;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // grid halus
      ctx.strokeStyle = '#dde3ea';
      ctx.lineWidth = 0.8;
      for (let i = 0; i <= 10; i++) {
        const gx = ox + i * scx * 0.5;
        ctx.beginPath(); ctx.moveTo(gx, 20); ctx.lineTo(gx, oy); ctx.stroke();
      }
      for (let i = 0; i <= 9; i++) {
        const gy = oy - i * scy * 0.5;
        ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(w - 20, gy); ctx.stroke();
      }

      // sumbu
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox, oy + 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox - 15, oy); ctx.lineTo(w - 10, oy); ctx.stroke();

      // label sumbu x
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px ui-monospace, monospace';
      ctx.textAlign = 'center';
      for (let i = 0; i <= 10; i++) {
        ctx.fillText(String(i * 0.5), ox + i * scx * 0.5, oy + 14);
      }
      // label sumbu y
      ctx.textAlign = 'right';
      for (let i = 1; i <= 9; i++) {
        ctx.fillText(String((i * 0.5).toFixed(1)), ox - 5, oy - i * scy * 0.5 + 4);
      }
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.fillText('0', ox - 5, oy + 13);

      // ── f(x) = -0.5x² + 2.5x, x: 0→2.5 (kuning/oranye) ──
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      let started = false;
      for (let px = ox; px <= ox + 2.5 * scx; px++) {
        const x = (px - ox) / scx;
        const fx = -0.5 * x * x + 2.5 * x;
        const py = oy - fx * scy;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // ── g(x) = -x² + 4x, x: 0→2 (merah muda) ──
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      started = false;
      for (let px = ox; px <= ox + 2 * scx; px++) {
        const x = (px - ox) / scx;
        const fx = -x * x + 4 * x;
        const py = oy - fx * scy;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // ── Titik koordinat f(x) kuning ──
      // f(1) = -0.5+2.5 = 2, f(2) = -2+5 = 3, f(2.5) = -3.125+6.25 = 3.125
      const fPts: [number, number, string][] = [
        [1,   2,     '(1, 2)'],
        [2.5, 3.125, '(2.5, 3.125)'],
      ];
      fPts.forEach(([xv, yv, lbl]) => {
        const px = ox + xv * scx, py = oy - yv * scy;
        ctx.fillStyle = '#b45309';
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#b45309';
        ctx.font = '11px ui-monospace, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(lbl, px + 7, py - 4);
      });

      // ── Titik koordinat g(x) merah ──
      // g(1) = -1+4 = 3, g(2) = -4+8 = 4
      const gPts: [number, number, string][] = [
        [1, 3, '(1, 3)'],
        [2, 4, '(2, 4)'],
      ];
      gPts.forEach(([xv, yv, lbl]) => {
        const px = ox + xv * scx, py = oy - yv * scy;
        ctx.fillStyle = '#9f1239';
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#9f1239';
        ctx.font = '11px ui-monospace, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(lbl, px + 7, py - 4);
      });

      // ── Legend ──
      ctx.fillStyle = '#d97706';
      ctx.fillRect(ox + 8, 22, 18, 3);
      ctx.fillStyle = '#b45309';
      ctx.font = '11px ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('f(x) = −½x² + 5/2·x', ox + 30, 27);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(ox + 8, 35, 18, 3);
      ctx.fillStyle = '#9f1239';
      ctx.fillText('g(x) = −x² + 4x', ox + 30, 40);

      // ── Garis pemisah & label area kerja ──
      const sepY = oy + 28;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(16, sepY); ctx.lineTo(w - 16, sepY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('✏️  Ruang penghitungan', 16, sepY + 16);
    },
  },
];

export default function DrawingApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState<string>('#1e293b');
  const [brushSize, setBrushSize] = useState<number>(4);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const q = questions[currentQuestion];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth || 600;
    const h = canvas.offsetHeight || 500;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    q.drawGraph(ctx, w, h);
  }, [currentQuestion, q]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width / dpr),
      y: (e.clientY - rect.top) * (canvas.height / rect.height / dpr),
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try { (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId); } catch (_) {}
    canvas.getContext('2d')?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    q.drawGraph(ctx, w, h);
  }, [q]);

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `jawaban-soal-${currentQuestion + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToQuestion = (idx: number) => {
    setCurrentQuestion(idx);
    setSelectedOption(null);
    setShowHint(false);
  };

  const handleOptionSelect = (value: string) => {
    if (selectedOption) return;
    setSelectedOption(value);
  };

  const colors = [
    '#1e293b', '#ef4444', '#3b82f6', '#16a34a',
    '#f97316', '#8b5cf6', '#ec4899', '#0891b2',
  ];

  const correctAnswer = q.options?.find(o => o.correct)?.value;
  const isCorrect = selectedOption === correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-4 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
            📐 Papan Gambar Digital
          </h1>
          <p className="text-blue-600 text-sm mt-1 font-medium">Fungsi Kuadrat — Matematika Interaktif</p>
        </div>

        {/* Question Tabs */}
        <div className="flex justify-center gap-3 mb-5">
          {questions.map((qs, i) => (
            <button
              key={i}
              onClick={() => goToQuestion(i)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                currentQuestion === i
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              {qs.title}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

          {/* ── Left: Soal Panel ── */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 h-full">

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{q.title}</span>
                <h2 className="text-lg font-bold text-gray-800 mt-0.5">{q.label}</h2>
              </div>
              <button
                onClick={() => goToQuestion((currentQuestion + 1) % questions.length)}
                className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition"
                title="Soal Berikutnya"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed">
              {q.description}
            </div>

            {/* Multiple Choice Options */}
            {q.hasOptions && q.options && (
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Pilih Jawaban:</p>
                <div className="flex gap-3">
                  {q.options.map(opt => {
                    let btnClass = 'flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ';
                    if (!selectedOption) {
                      btnClass += opt.value === 'fx'
                        ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                        : 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100';
                    } else if (opt.value === correctAnswer) {
                      btnClass += 'bg-green-100 border-green-500 text-green-800';
                    } else if (opt.value === selectedOption) {
                      btnClass += 'bg-red-100 border-red-400 text-red-700';
                    } else {
                      btnClass += 'bg-gray-50 border-gray-200 text-gray-400';
                    }
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionSelect(opt.value)}
                        disabled={!!selectedOption}
                        className={btnClass}
                      >
                        {opt.label}
                        {selectedOption && opt.value === correctAnswer && (
                          <span className="ml-1">✓</span>
                        )}
                        {selectedOption && opt.value === selectedOption && !opt.correct && (
                          <span className="ml-1">✗</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption && (
                  <div className={`flex items-start gap-2 text-sm p-3 rounded-xl mt-1 ${
                    isCorrect ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {isCorrect
                      ? <CheckCircle size={16} className="mt-0.5 shrink-0" />
                      : <XCircle size={16} className="mt-0.5 shrink-0" />}
                    <span>
                      {isCorrect
                        ? 'Benar! f(x) = −½x²+5/2·x memotong sumbu-x di x=5, sedangkan g(x) di x=4. Jadi roket f(x) mendarat lebih jauh.'
                        : 'Belum tepat. Jawaban yang benar adalah f(x) — titik nol f(x) ada di x=5, lebih jauh dari g(x) yang nol di x=4.'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Hint */}
            <div className="mt-auto">
              <button
                onClick={() => setShowHint(v => !v)}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium underline underline-offset-2 transition"
              >
                {showHint ? 'Sembunyikan petunjuk' : '💡 Tampilkan petunjuk'}
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg text-sm text-amber-800 leading-relaxed">
                  {q.hint}
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700 border border-blue-100">
              {currentQuestion === 0
                ? <>✏️ <strong>Tips:</strong> Gambar grafik f(x) dan tentukan titik puncaknya di kanvas kanan!</>
                : <>✏️ <strong>Tips:</strong> Perhatikan grafik di kanvas kanan, lalu tentukan roket mana yang mendarat lebih jauh!</>
              }
            </div>
          </div>

          {/* ── Right: Canvas Panel ── */}
          <div className="flex flex-col gap-2">

            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-md px-3 py-2 flex flex-wrap items-center gap-3">

              {/* Tool toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setTool('pen')}
                  className={`p-1.5 rounded-lg transition ${tool === 'pen' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Pena"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`p-1.5 rounded-lg transition ${tool === 'eraser' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Penghapus"
                >
                  <Eraser size={18} />
                </button>
              </div>

              {/* Color picker */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(v => !v)}
                  className="w-7 h-7 rounded-full border-2 border-gray-200 shadow-sm transition hover:scale-110"
                  style={{ backgroundColor: color }}
                  title="Pilih Warna"
                />
                {showColorPicker && (
                  <div className="absolute top-9 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-20 grid grid-cols-4 gap-1.5 w-36">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => { setColor(c); setShowColorPicker(false); }}
                        className={`w-6 h-6 rounded-full border transition hover:scale-110 ${color === c ? 'border-gray-700 scale-110' : 'border-gray-200'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Brush size */}
              <div className="flex items-center gap-2 flex-1 min-w-[100px]">
                <span className="text-xs text-gray-400">Ukuran</span>
                <input
                  type="range" min="1" max="20" value={brushSize} step="1"
                  onChange={e => setBrushSize(Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full cursor-pointer accent-blue-500"
                />
                <span className="text-xs text-gray-500 w-4">{brushSize}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={clearCanvas}
                  className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition"
                  title="Bersihkan (pertahankan grafik)"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={exportImage}
                  className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                  title="Unduh Gambar"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="bg-white rounded-2xl shadow-md p-2 flex-1">
              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className="w-full rounded-xl border border-gray-200 cursor-crosshair touch-none"
                style={{ height: '500px' }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
