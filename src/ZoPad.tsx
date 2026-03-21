import { useState, useEffect, useRef } from 'react';
import { Plus, X, Edit2, Download, Upload } from 'lucide-react';

const ZoPegasus = ({ className }: { className?: string }) => (
  <img src="/pegasus.png" alt="Zo" className={className} />
);

const MilkyWayField = () => {
  const milkyWayStars = Array.from({ length: 200 }, (_, i) => ({
    id: `mw-${i}`,
    size: Math.random() * 2 + 0.5,
    x: Math.random() * 100,
    y: 30 + Math.random() * 40,
    opacity: Math.random() * 0.8 + 0.2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 3
  }));

  const bgStars = Array.from({ length: 150 }, (_, i) => ({
    id: `bg-${i}`,
    size: Math.random() * 1.5 + 0.3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.4 + 0.1,
    duration: Math.random() * 5 + 3,
    delay: Math.random() * 5
  }));

  const nebulae = [
    { x: 20, y: 45, size: 300, color: 'purple', opacity: 0.15 },
    { x: 60, y: 55, size: 250, color: 'blue', opacity: 0.12 },
    { x: 80, y: 40, size: 200, color: 'cyan', opacity: 0.1 },
    { x: 40, y: 60, size: 180, color: 'violet', opacity: 0.08 }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, transparent 0%, rgba(100, 150, 255, 0.03) 30%, rgba(150, 100, 200, 0.05) 45%, rgba(100, 150, 255, 0.03) 55%, transparent 100%)'
      }} />

      {nebulae.map((n, i) => (
        <div
          key={`nebula-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: n.size,
            height: n.size * 0.6,
            transform: 'translate(-50%, -50%)',
            background: n.color === 'purple' ? 'radial-gradient(ellipse, rgba(147, 51, 234, 0.4), transparent)' :
                       n.color === 'blue' ? 'radial-gradient(ellipse, rgba(59, 130, 246, 0.3), transparent)' :
                       n.color === 'cyan' ? 'radial-gradient(ellipse, rgba(34, 211, 238, 0.3), transparent)' :
                       'radial-gradient(ellipse, rgba(139, 92, 246, 0.3), transparent)',
            opacity: n.opacity
          }}
        />
      ))}

      {milkyWayStars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 2}px ${s.size}px rgba(255, 255, 255, 0.5)`,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`
          }}
        />
      ))}

      {bgStars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`
          }}
        />
      ))}

      <div className="absolute w-1 h-1 bg-white rounded-full" style={{
        top: '15%', left: '80%',
        boxShadow: '0 0 6px 2px rgba(255,255,255,0.8), -80px 0 20px 2px rgba(255,255,255,0.4), -160px 0 40px 1px rgba(255,255,255,0.2)',
        animation: 'shooting 8s linear infinite', animationDelay: '2s'
      }} />
      <div className="absolute w-1 h-1 bg-white rounded-full" style={{
        top: '25%', left: '60%',
        boxShadow: '0 0 6px 2px rgba(255,255,255,0.8), -60px 0 15px 2px rgba(255,255,255,0.4), -120px 0 30px 1px rgba(255,255,255,0.2)',
        animation: 'shooting 12s linear infinite', animationDelay: '5s'
      }} />
      <div className="absolute w-1 h-1 bg-white rounded-full" style={{
        top: '70%', left: '90%',
        boxShadow: '0 0 6px 2px rgba(255,255,255,0.8), -50px 0 12px 2px rgba(255,255,255,0.4)',
        animation: 'shooting 15s linear infinite', animationDelay: '8s'
      }} />
    </div>
  );
};

interface Card {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
}

const COLORS: Record<string, { bg: string; border: string }> = {
  yellow: { bg: 'bg-yellow-200', border: 'border-yellow-400' },
  cyan: { bg: 'bg-cyan-200', border: 'border-cyan-400' },
  teal: { bg: 'bg-teal-200', border: 'border-teal-400' },
  green: { bg: 'bg-emerald-200', border: 'border-emerald-400' },
  blue: { bg: 'bg-sky-200', border: 'border-sky-400' },
  ocean: { bg: 'bg-blue-200', border: 'border-blue-400' },
  electric: { bg: 'bg-indigo-200', border: 'border-indigo-400' },
  purple: { bg: 'bg-violet-200', border: 'border-violet-400' }
};

export default function ZoPad() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('zopad-cards');
    if (saved) {
      setCards(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('zopad-cards', JSON.stringify(cards));
    }
  }, [cards, mounted]);

  const createCard = () => {
    if (!newTitle.trim()) return;
    const card: Card = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      color: selectedColor,
      createdAt: new Date().toLocaleDateString()
    };
    setCards([card, ...cards]);
    setNewTitle('');
    setNewContent('');
    setSelectedColor('yellow');
    setIsCreating(false);
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const startEdit = (card: Card) => {
    setEditingCardId(card.id);
    setNewTitle(card.title);
    setNewContent(card.content);
    setSelectedColor(card.color);
    setIsCreating(true);
  };

  const saveEdit = () => {
    if (!editingCardId || !newTitle.trim()) return;
    setCards(cards.map(c => c.id === editingCardId ? { ...c, title: newTitle, content: newContent, color: selectedColor } : c));
    setNewTitle('');
    setNewContent('');
    setSelectedColor('yellow');
    setEditingCardId(null);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setNewTitle('');
    setNewContent('');
    setSelectedColor('yellow');
    setEditingCardId(null);
    setIsCreating(false);
  };

  const exportCards = () => {
    const data = JSON.stringify(cards, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zopad-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCards = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported: Card[] = JSON.parse(ev.target?.result as string);
        if (Array.isArray(imported)) {
          const existingIds = new Set(cards.map(c => c.id));
          const newCards = imported.filter(c => !existingIds.has(c.id));
          setCards([...newCards, ...cards]);
        }
      } catch { /* ignore bad files */ }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getCardColor = (color: string) => {
    return COLORS[color] || COLORS.yellow;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-6 relative overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes shooting {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(-400px) translateY(200px); opacity: 0; }
        }
      `}</style>

      <MilkyWayField />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-lg flex items-center justify-center border-2 border-yellow-400 hover:scale-110 transition-transform">
              <ZoPegasus className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">ZoPad</h1>
              <p className="text-sm text-cyan-600">{cards.length} notes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importCards}
              className="hidden"
            />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-cyan-400 hover:bg-cyan-900/30 rounded-lg transition-colors" title="Import">
              <Upload className="w-5 h-5" />
            </button>
            <button onClick={exportCards} className="p-2 text-cyan-400 hover:bg-cyan-900/30 rounded-lg transition-colors" title="Export">
              <Download className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg text-white font-medium hover:from-cyan-500 hover:to-teal-500 transition-all hover:scale-105">
              <Plus className="w-5 h-5" />
              New Note
            </button>
          </div>
        </div>

        {isCreating && (
          <div className="mb-6 bg-slate-800/80 backdrop-blur rounded-xl p-6 border border-cyan-500/30">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">{editingCardId ? 'Edit Note' : 'Create New Note'}</h3>
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mb-3 px-4 py-2 bg-slate-700 rounded-lg border border-cyan-500/30 text-white placeholder-cyan-700 focus:outline-none focus:border-cyan-400"
            />
            <textarea
              placeholder="Content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full mb-3 px-4 py-2 bg-slate-700 rounded-lg border border-cyan-500/30 text-white placeholder-cyan-700 focus:outline-none focus:border-cyan-400 h-24 resize-none"
            />
            <div className="flex items-center gap-2 mb-4">
              {Object.keys(COLORS).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${getCardColor(color).bg} ${selectedColor === color ? 'border-white ring-2 ring-cyan-400 scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={editingCardId ? saveEdit : createCard}
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg text-white font-medium hover:from-cyan-500 hover:to-teal-500 transition-all"
              >
                {editingCardId ? 'Save Changes' : 'Create'}
              </button>
              <button
                onClick={cancelEdit}
                className="px-6 py-2 bg-slate-600 rounded-lg text-white font-medium hover:bg-slate-500 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {cards.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl shadow-xl flex items-center justify-center border-2 border-yellow-400 hover:scale-110 transition-transform">
              <ZoPegasus className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">No sticky notes yet</h3>
            <p className="text-cyan-600">Create your first note to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`${getCardColor(card.color).bg} ${getCardColor(card.color).border} border-2 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all group relative`}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => startEdit(card)}
                    className="p-1.5 bg-white/80 rounded hover:bg-white transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-slate-700" />
                  </button>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-1.5 bg-white/80 rounded hover:bg-white transition-colors"
                    title="Delete"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 pr-16">{card.title}</h3>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{card.content}</p>
                <p className="text-slate-500 text-xs mt-3">{card.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
