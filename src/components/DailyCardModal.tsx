import React, { useState } from 'react';
import { X, Sparkles, RotateCcw, Star, Check } from 'lucide-react';

interface DailyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const CARDS = [
  {
    sign: 'Áries ♈',
    title: 'A Centelha da Coragem',
    color: 'Ouro Radiante ☀️',
    luckyNumber: '7',
    energy: '96%',
    message: 'Hoje a sua energia é contagiante! Dê o primeiro passo naquele plano que estava na sua gaveta. O universo recompensa quem age com o coração sincero.',
    advice: 'Sorria para a primeira pessoa que encontrar e sinta a leveza voltar para você.',
  },
  {
    sign: 'Touro ♉',
    title: 'A Paz da Estabilidade',
    color: 'Verde Esmeralda 🌿',
    luckyNumber: '6',
    energy: '94%',
    message: 'As coisas boas levam tempo para florescer. Mantenha a calma, valorize o que você já conquistou e cuide do seu bem-estar hoje.',
    advice: 'Tome um café ou chá com calma, apreciando o momento sem pressa.',
  },
  {
    sign: 'Gêmeos ♊',
    title: 'O Vento das Boas Ideias',
    color: 'Azul Celeste 🪽',
    luckyNumber: '5',
    energy: '95%',
    message: 'Uma conversa despretensiosa vai trazer uma resposta que você procurava. Mantenha a mente aberta e o bom humor lá no alto.',
    advice: 'Envie uma mensagem de carinho para um amigo de longa data.',
  },
  {
    sign: 'Câncer ♋',
    title: 'O Abraço do Cuidado',
    color: 'Prata Pérola 🌙',
    luckyNumber: '2',
    energy: '93%',
    message: 'Sua intuição está muito apurada hoje. Se o seu coração disser que é o momento certo para desacelerar, respeite o seu ritmo.',
    advice: 'Crie um cantinho aconchegante em casa para relaxar no final da tarde.',
  },
  {
    sign: 'Leão ♌',
    title: 'O Brilho da Generosidade',
    color: 'Âmbar Solar 🦁',
    luckyNumber: '1',
    energy: '98%',
    message: 'Você nasceu para iluminar por onde passa. Seja generoso com seus elogios e espalhe otimismo para quem está ao seu lado.',
    advice: 'Celebre uma pequena vitória sua de hoje, você merece o reconhecimento.',
  },
  {
    sign: 'Virgem ♍',
    title: 'A Clareza da Simplicidade',
    color: 'Verde Menta 🌱',
    luckyNumber: '8',
    energy: '92%',
    message: 'Organizar um pequeno detalhe vai tirar um peso enorme das suas costas. Lembre-se: feito com carinho é melhor do que perfeito.',
    advice: 'Resolva logo a tarefa mais simples da sua lista para sentir alívio imediato.',
  },
  {
    sign: 'Libra ♎',
    title: 'A Harmonia dos Encontros',
    color: 'Rosa Quartzo 🌸',
    luckyNumber: '11',
    energy: '95%',
    message: 'O dia traz paz e boas conciliações. Qualquer mal-entendido recente pode ser resolvido com uma palavra mansa e um sorriso.',
    advice: 'Coloque uma música tranquila para tocar enquanto realiza suas tarefas.',
  },
  {
    sign: 'Escorpião ♏',
    title: 'A Força da Transformação',
    color: 'Ametista Profundo 🔮',
    luckyNumber: '9',
    energy: '94%',
    message: 'Deixe ir o que não faz mais sentido e abra espaço para novidades. A sua determinação silenciosa move montanhas hoje.',
    advice: 'Evite discussões bobas e foque toda a sua energia nos seus próprios objetivos.',
  },
  {
    sign: 'Sagitário ♐',
    title: 'A Jornada da Alegria',
    color: 'Laranja Pôr do Sol 🍊',
    luckyNumber: '3',
    energy: '97%',
    message: 'O riso solto é o melhor remédio para qualquer cansaço. Encare os desafios de hoje como uma aventura leve e cheia de aprendizados.',
    advice: 'Descubra algo novo hoje: pode ser uma música, uma receita ou uma curiosidade.',
  },
  {
    sign: 'Capricórnio ♑',
    title: 'A Conquista Passo a Passo',
    color: 'Azul Marinho ⚓',
    luckyNumber: '10',
    energy: '93%',
    message: 'Tudo o que é construído com paciência dura mais. Confie no seu esforço contínuo, você está mais perto do que imagina.',
    advice: 'Lembre-se de descansar a mente no final do dia; o descanso também faz parte do sucesso.',
  },
  {
    sign: 'Aquário ♒',
    title: 'A Inspiração do Futuro',
    color: 'Turquesa Elétrico ⚡',
    luckyNumber: '4',
    energy: '96%',
    message: 'O seu jeito único de pensar é o seu maior tesouro. Não tenha medo de sugerir uma ideia diferente e criativa para o seu grupo.',
    advice: 'Faça algo fora da rotina hoje, mesmo que seja mudar o caminho de volta para casa.',
  },
  {
    sign: 'Peixes ♓',
    title: 'O Mar de Empatia',
    color: 'Verde Oceano 🌊',
    luckyNumber: '12',
    energy: '95%',
    message: 'A sua bondade sincera cria pontes onde antes existiam muros. Confie nos seus pressentimentos e acolha quem precisa de carinho.',
    advice: 'Dedique alguns minutos para respirar fundo e contemplar o céu ou a natureza.',
  },
];

export const DailyCardModal: React.FC<DailyCardModalProps> = ({
  isOpen,
  onClose,
  initialIndex = 0,
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialIndex);
  const [isFlipping, setIsFlipping] = useState(false);

  React.useEffect(() => {
    if (initialIndex !== undefined) {
      setCurrentIdx(initialIndex);
    }
  }, [initialIndex, isOpen]);

  if (!isOpen) return null;

  const currentCard = CARDS[currentIdx];

  const handleDrawAnother = () => {
    setIsFlipping(true);
    setTimeout(() => {
      let next = Math.floor(Math.random() * CARDS.length);
      if (next === currentIdx) {
        next = (currentIdx + 1) % CARDS.length;
      }
      setCurrentIdx(next);
      setIsFlipping(false);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#17366F]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-3xl shadow-xl overflow-hidden border border-[#D9E8F8] text-[#172B4D] animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[#D9E8F8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E4F1FF] border border-[#D9E8F8] flex items-center justify-center text-[#3982C8]">
              <Sparkles className="w-4 h-4 text-[#3982C8]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#172B4D] leading-tight">
                Carta Astrológica do Dia
              </h3>
              <p className="text-[11px] text-[#647DA5]">
                Sua orientação simples, clara e positiva
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E4F1FF] hover:bg-[#FBE1EB] text-[#647DA5] hover:text-[#172B4D] border border-[#D9E8F8] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div
            className={`transition-all duration-300 transform ${
              isFlipping ? 'scale-95 opacity-50 rotate-y-90' : 'scale-100 opacity-100 rotate-y-0'
            }`}
          >
            {/* Elegant Card Banner in Secondary Background */}
            <div className="p-6 rounded-2xl bg-[#E4F1FF] border border-[#D9E8F8] shadow-xs relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D9E8F8] text-[#3982C8] text-[11px] font-black uppercase tracking-wider mb-2">
                <Star className="w-3 h-3 text-[#3982C8] fill-[#3982C8]" />
                <span>{currentCard.sign}</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black tracking-tight text-[#172B4D]">
                {currentCard.title}
              </h4>

              <p className="mt-2 text-xs sm:text-sm text-[#647DA5] leading-relaxed font-medium">
                "{currentCard.message}"
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#D9E8F8] text-center">
                <span className="text-[10px] font-bold uppercase text-[#647DA5] block">
                  Energia
                </span>
                <span className="text-sm font-black text-[#3982C8] mt-0.5 block">
                  {currentCard.energy}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#D9E8F8] text-center">
                <span className="text-[10px] font-bold uppercase text-[#647DA5] block">
                  Cor da Sorte
                </span>
                <span className="text-xs font-black text-[#172B4D] mt-1 block">
                  {currentCard.color}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#D9E8F8] text-center">
                <span className="text-[10px] font-bold uppercase text-[#647DA5] block">
                  Nº da Sorte
                </span>
                <span className="text-sm font-black text-[#3982C8] mt-0.5 block">
                  {currentCard.luckyNumber}
                </span>
              </div>
            </div>

            {/* Gentle Advice */}
            <div className="mt-4 p-4 rounded-2xl bg-[#FBE1EB]/50 border border-[#FBE1EB] flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#E73578] text-[#FFFFFF] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <Check className="w-3.5 h-3.5 text-[#FFFFFF]" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E73578] block">
                  Conselho Simples para Hoje:
                </span>
                <p className="text-xs text-[#172B4D] font-medium mt-0.5 leading-relaxed">
                  {currentCard.advice}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-[#D9E8F8]">
            <button
              onClick={handleDrawAnother}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#E4F1FF] text-[#172B4D] hover:text-[#3982C8] border border-[#D9E8F8] hover:border-[#3982C8] text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-102"
            >
              <RotateCcw className="w-4 h-4 text-[#3982C8]" />
              <span>Tirar Outra Carta 🎴</span>
            </button>

            <button
              onClick={onClose}
              className="py-3 px-6 rounded-2xl bg-[#3982C8] hover:bg-[#17366F] text-[#FFFFFF] text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:scale-102"
            >
              Entendido ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
