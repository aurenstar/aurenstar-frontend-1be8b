import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Sun, Moon, Star, Compass, ArrowRight, RotateCcw, BrainCircuit, Check, ShieldCheck } from 'lucide-react';

interface ZodiacData {
  sign: string;
  dailyMessage: string;
  thinkingProcess: string;
  energyLevel: number;
  luckyNumber: string;
  luckyColor: string;
  bestMatch: string;
  threeSimpleAdvices: {
    title: string;
    desc: string;
  }[];
  affirmation: string;
}

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire', color: 'from-amber-500 to-red-500' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth', color: 'from-emerald-500 to-green-600' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air', color: 'from-cyan-400 to-blue-500' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water', color: 'from-blue-400 to-indigo-500' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire', color: 'from-amber-400 to-orange-500' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth', color: 'from-teal-400 to-emerald-500' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air', color: 'from-pink-400 to-rose-500' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water', color: 'from-purple-500 to-indigo-600' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire', color: 'from-orange-500 to-amber-500' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth', color: 'from-slate-600 to-zinc-800' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air', color: 'from-sky-400 to-cyan-500' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water', color: 'from-violet-400 to-purple-500' },
];

const FOCUS_OPTIONS = [
  { id: 'general', label: '✨ Daily Message', desc: 'Overall mood & flow' },
  { id: 'love', label: '💖 Love & Heart', desc: 'Kindness & relationships' },
  { id: 'projects', label: '🌟 Joy & Goals', desc: 'Creativity & practical steps' },
  { id: 'peace', label: '🌿 Calm & Energy', desc: 'Rest & peaceful mindset' },
];

export const ZodiacGuidance: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState(ZODIAC_SIGNS[0]);
  const [selectedFocus, setSelectedFocus] = useState(FOCUS_OPTIONS[0]);
  const [reading, setReading] = useState<ZodiacData | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Automatically fetch initial reading or when user clicks
  const fetchReading = async (sign = selectedSign, focus = selectedFocus) => {
    setLoading(true);
    setReading(null);
    setCompletedSteps([]);

    try {
      const res = await fetch('/api/zodiac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sign: sign.name,
          element: sign.element,
          focus: focus.label,
          date: 'Today',
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setReading(json.data);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      setReading({
        sign: sign.name,
        dailyMessage: `Today is filled with bright possibilities for ${sign.name}! Keep things light, breathe deeply, and smile. Small, kind actions will create huge waves of happiness.`,
        thinkingProcess: `We tuned into ${sign.name}'s peaceful star alignment today. The guidance encourages staying calm and enjoying every conversation.`,
        energyLevel: 95,
        luckyNumber: '7',
        luckyColor: 'Sunny Gold ☀️',
        bestMatch: 'Leo ♌',
        threeSimpleAdvices: [
          {
            title: 'Take 5 minutes just for you',
            desc: 'Sip a warm drink and look out the window to relax your eyes and mind.',
          },
          {
            title: 'Say a kind word to someone',
            desc: 'A simple compliment will make both of your days brighter.',
          },
          {
            title: 'Trust your good instincts',
            desc: 'You know what feels right. Keep your choices simple and honest.',
          },
        ],
        affirmation: 'I welcome peace, kindness, and joy into my day.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReading(selectedSign, selectedFocus);
  }, []);

  const handleSelectSign = (sign: typeof ZODIAC_SIGNS[0]) => {
    setSelectedSign(sign);
    fetchReading(sign, selectedFocus);
  };

  const handleSelectFocus = (focus: typeof FOCUS_OPTIONS[0]) => {
    setSelectedFocus(focus);
    fetchReading(selectedSign, focus);
  };

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((i) => i !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  return (
    <div id="zodiac-experience" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 12 Signs Carousel / Grid */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
          <span>Select Your Star Sign</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Pick your sign to receive today’s guidance
        </h2>
      </div>

      {/* Signs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {ZODIAC_SIGNS.map((sign) => {
          const isSelected = selectedSign.name === sign.name;
          return (
            <button
              key={sign.name}
              onClick={() => handleSelectSign(sign)}
              className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer group hover:-translate-y-1 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-102'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <div
                className={`text-2xl mb-1 transition-transform group-hover:scale-110 ${
                  isSelected ? 'text-[#d2f829]' : 'text-slate-700'
                }`}
              >
                {sign.symbol}
              </div>
              <div className="text-xs font-extrabold">{sign.name}</div>
              <div
                className={`text-[10px] mt-0.5 ${
                  isSelected ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                {sign.dates}
              </div>
            </button>
          );
        })}
      </div>

      {/* Focus of the Day Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {FOCUS_OPTIONS.map((f) => (
          <button
            key={f.id}
            onClick={() => handleSelectFocus(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedFocus.id === f.id
                ? 'bg-[#d2f829] text-black shadow-md font-extrabold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reading Result Stage */}
      <div className="mt-10">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xl max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 animate-spin">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Consulting the Stars for {selectedSign.name}...
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Gathering clear, peaceful thoughts and warm guidance for you today.
            </p>
          </div>
        ) : reading ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xl max-w-4xl mx-auto">
            {/* Top Sign Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-black text-[#d2f829] flex items-center justify-center text-3xl font-black shadow-md">
                  {selectedSign.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900">
                      {selectedSign.name}
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {selectedSign.element} Element
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {selectedSign.dates} • Today’s Reading
                  </div>
                </div>
              </div>

              {/* Energy Level Pill */}
              <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Daily Energy
                  </div>
                  <div className="text-xl font-black text-emerald-600">
                    {reading.energyLevel}%
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Sun className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Main Daily Message */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 rounded-3xl p-6 sm:p-8 text-center sm:text-left">
              <div className="text-xs font-black tracking-widest uppercase text-blue-600 mb-2 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Today's Message</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed">
                “{reading.dailyMessage}”
              </p>

              {/* Gemini Thinking Insight */}
              <div className="mt-4 pt-4 border-t border-blue-200/50 text-xs text-blue-900/80 flex items-start gap-2">
                <BrainCircuit className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Stellar Insight:</strong> {reading.thinkingProcess}
                </span>
              </div>
            </div>

            {/* 3 Quick Simple Metrics (Lucky Color, Lucky Number, Best Match) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Lucky Color
                </div>
                <div className="text-sm font-black text-slate-800 mt-1">
                  {reading.luckyColor}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Lucky Number
                </div>
                <div className="text-sm font-black text-blue-600 mt-1">
                  {reading.luckyNumber}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Best Match Today
                </div>
                <div className="text-sm font-black text-slate-800 mt-1">
                  {reading.bestMatch}
                </div>
              </div>
            </div>

            {/* 3 Simple Actionable Advices */}
            <div className="mt-8">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                3 Gentle Advices for Your Day (Click to mark done):
              </div>
              <div className="space-y-3">
                {reading.threeSimpleAdvices.map((advice, idx) => {
                  const isDone = completedSteps.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div
                          className={`text-sm font-bold ${
                            isDone ? 'line-through text-emerald-800' : 'text-slate-900'
                          }`}
                        >
                          {advice.title}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                          {advice.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Affirmation Card */}
            <div className="mt-8 p-5 rounded-2xl bg-[#d2f829]/20 border border-[#d2f829] flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Daily Affirmation:
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  “{reading.affirmation}”
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => fetchReading(selectedSign, selectedFocus)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refresh Guidance</span>
              </button>

              <span className="text-xs text-slate-400">
                Updated for today with calm thinking
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
