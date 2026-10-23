import React, { useState } from 'react';
import { X, Sparkles, Trophy, Lightbulb, CheckCircle2, ArrowRight, RotateCcw, BrainCircuit, Heart, Star, Check } from 'lucide-react';
import { SimResult } from '../types';

interface StrategyGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
  lang: 'pt' | 'en';
}

export const StrategyGameModal: React.FC<StrategyGameModalProps> = ({
  isOpen,
  onClose,
  onGetStarted,
  lang,
}) => {
  const [businessName, setBusinessName] = useState('Minha Cafeteria Aconchegante');
  const [businessType, setBusinessType] = useState('Alimentação e Café');
  const [goal, setGoal] = useState('Conquistar mais clientes fiéis que voltam sempre');
  const [challenge, setChallenge] = useState('Falta tempo para organizar pedidos e responder mensagens');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quickPresets = [
    { name: '☕ Cafeteria Aconchegante', type: 'Alimentação e Bebidas', goal: 'Atrair vizinhos e clientes fiéis todo dia' },
    { name: '👗 Loja de Moda e Roupas', type: 'Moda e Varejo', goal: 'Vender mais pela internet e no bairro' },
    { name: '✂️ Salão de Beleza e Estética', type: 'Serviços e Cuidados', goal: 'Preencher a agenda da semana sem cancelamentos' },
    { name: '💻 Aulas & Cursos Online', type: 'Educação', goal: 'Ter alunos apaixonados que indicam amigos' },
    { name: '🍰 Doceria & Bolos Caseiros', type: 'Confeitaria', goal: 'Organizar encomendas e aumentar o lucro' },
  ];

  const goalsList = [
    'Conquistar mais clientes fiéis que voltam sempre',
    'Economizar tempo e ter uma rotina sem estresse',
    'Vender mais sem precisar gastar rios de dinheiro em anúncios',
  ];

  const challengesList = [
    'Falta tempo para organizar pedidos e responder mensagens',
    'Dúvidas sobre como divulgar de um jeito simples e bonito',
    'Dificuldade em saber o preço certo para sobrar dinheiro no bolso',
  ];

  const handlePlayGame = async () => {
    setLoading(true);
    setResult(null);
    setCheckedSteps([]);

    try {
      const response = await fetch('/api/sim-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          businessType,
          goal,
          audience: 'Pessoas do dia a dia',
          challenge,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        throw new Error('Falha');
      }
    } catch (e) {
      // Fallback
      setResult({
        score: 93,
        levelName: 'Estrategista Nato 🌟',
        simpleSummary:
          'Seu projeto tem uma força incrível! A melhor jogada é focar em encantar quem já te conhece e deixar o atendimento rápido como um estalar de dedos.',
        thinkingProcess:
          'Pensamos com carinho em como você pode crescer sem gastar muito nem perder noites de sono. O segredo está em simplificar os passos.',
        steps: [
          {
            title: '1. Fale de coração com quem já gosta de você',
            desc: 'Pergunte aos seus 3 melhores clientes o que eles mais amam no que você faz e anote as palavras exatas.',
          },
          {
            title: '2. Deixe respostas prontas no celular',
            desc: 'Crie atalhos no WhatsApp para responder preços, horários e fotos em segundos.',
          },
          {
            title: '3. Teste uma novidade simples essa semana',
            desc: 'Crie uma condição especial para quem trouxer um amigo e comemore o resultado!',
          },
        ],
        goldenTip:
          'Quem atende com carinho e rapidez ganha a confiança do cliente muito antes de qualquer concorrente.',
        rewardBadge: '🏆 Troféu de Clareza & Sucesso',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (idx: number) => {
    if (checkedSteps.includes(idx)) {
      setCheckedSteps(checkedSteps.filter((i) => i !== idx));
    } else {
      setCheckedSteps([...checkedSteps, idx]);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Meu Plano no Jogo do Negócio Aeline:
${result.levelName} (Nota: ${result.score}/100)
${result.simpleSummary}

Dica de Ouro: ${result.goldenTip}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d2f829]" />
            <span>O Jogo do Negócio Descomplicado</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Teste sua ideia com inteligência e bom senso
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-blue-100 font-normal">
            Palavras fáceis, conselhos práticos e zero complicação técnica.
          </p>
        </div>

        {/* Game Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {!result && !loading && (
            <div className="space-y-6">
              {/* Presets */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                  Escolha um exemplo rápido ou monte o seu:
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickPresets.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        setBusinessName(preset.name);
                        setBusinessType(preset.type);
                        setGoal(preset.goal);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        businessName === preset.name
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Name Input */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
                  1. Nome ou Tipo do seu Projeto:
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ex: Minha Loja de Doces, Ateliê de Costura..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Goal Selection */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
                  2. O que você mais deseja conquistar primeiro?
                </label>
                <div className="space-y-2">
                  {goalsList.map((g, gIdx) => (
                    <div
                      key={gIdx}
                      onClick={() => setGoal(g)}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all flex items-center justify-between ${
                        goal === g
                          ? 'border-blue-500 bg-blue-50/80 text-blue-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{g}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          goal === g
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {goal === g && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge Selection */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
                  3. Onde o sapato mais aperta no dia a dia?
                </label>
                <div className="space-y-2">
                  {challengesList.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      onClick={() => setChallenge(c)}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all flex items-center justify-between ${
                        challenge === c
                          ? 'border-blue-500 bg-blue-50/80 text-blue-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{c}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          challenge === c
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {challenge === c && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePlayGame}
                className="w-full py-4 rounded-2xl font-black text-sm tracking-wider uppercase bg-[#d2f829] hover:bg-[#beea21] text-black shadow-lg shadow-black/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                <BrainCircuit className="w-5 h-5 text-black" />
                <span>Analisar com Sabedoria & Pensamento Profundo</span>
              </button>
            </div>
          )}

          {/* Loading Thinking State */}
          {loading && (
            <div className="py-14 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                <div className="absolute inset-2 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <BrainCircuit className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <h4 className="text-lg font-bold text-slate-900">
                Pensando profundamente na sua estratégia...
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Estamos usando raciocínio com calma para transformar sua ideia em 3 passos
                simples de executar, sem palavras difíceis!
              </p>
            </div>
          )}

          {/* Result View */}
          {result && !loading && (
            <div className="space-y-6">
              {/* Score & Badge Banner */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black tracking-widest uppercase text-[#d2f829]">
                    {result.rewardBadge}
                  </div>
                  <h4 className="text-2xl font-extrabold mt-1">{result.levelName}</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm">
                    {result.simpleSummary}
                  </p>
                </div>

                <div className="text-center bg-white/10 px-6 py-3 rounded-2xl border border-white/20 shrink-0">
                  <div className="text-3xl sm:text-4xl font-black text-[#d2f829]">
                    {result.score}/100
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    Potencial de Sucesso
                  </div>
                </div>
              </div>

              {/* Thinking Process explanation in simple words */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-extrabold text-blue-800 uppercase tracking-wider mb-1">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span>Como o Mentor Pensou:</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-900 leading-relaxed font-normal">
                  {result.thinkingProcess}
                </p>
              </div>

              {/* 3 Simple Actionable Steps */}
              <div>
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  3 Passos Simples para Você Fazer Essa Semana (Clique para marcar):
                </h5>

                <div className="space-y-3">
                  {result.steps.map((step, idx) => {
                    const isDone = checkedSteps.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
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
                            {step.title}
                          </div>
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Golden Tip */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 fill-amber-400" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Dica de Ouro:
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 font-medium mt-0.5">
                    “{result.goldenTip}”
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Jogar Outra Ideia</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copied ? 'Copiado!' : 'Copiar Dicas'}
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onGetStarted();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#d2f829] hover:bg-[#beea21] text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Quero Essa Ajuda</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
