import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Send } from 'lucide-react';

interface PlanSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: string;
  lang: 'pt' | 'en';
}

export const PlanSelectModal: React.FC<PlanSelectModalProps> = ({
  isOpen,
  onClose,
  planName,
  price,
  lang,
}) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#d2f829] flex items-center justify-center mx-auto text-black mb-4 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Recebemos sua mensagem!
            </h3>
            <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Um dos nossos consultores vai chamar você com carinho para entender tudo e dar os primeiros passos.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-black text-white font-bold text-xs uppercase"
            >
              Concluir
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#d2f829]" />
              <span>Plano Selecionado</span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-extrabold text-slate-900">
                {planName}
              </h3>
              <span className="text-lg font-black text-blue-600">{price}</span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Preencha rapidinho para falarmos com você sem nenhum compromisso.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Seu Nome
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  WhatsApp ou E-mail
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: (11) 99999-9999 ou seu@email.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Qual é o seu negócio? (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Tenho uma loja física e quero vender online..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase bg-[#d2f829] hover:bg-[#beea21] text-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Quero Conversar com a Equipe</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
