import React, { useState } from 'react';
import { ArrowUpRight, Clock, BookOpen, X } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  lang: 'pt' | 'en';
}

export const BlogSection: React.FC<BlogSectionProps> = ({ lang }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const t = {
    pt: {
      tag: 'BLOG E ARTIGOS',
      title: 'Dicas práticas e novidades que importam',
      sub: 'Textos curtos e fáceis de ler para você aprender a melhorar seu negócio sem dor de cabeça.',
      viewAll: 'VER TODOS',
      readMore: 'Ler artigo',
      posts: [
        {
          id: '1',
          title: 'Transformando anotações em vendas: O poder da organização',
          category: 'Estratégia Simples',
          readTime: '3 min de leitura',
          image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
          summary:
            'Descubra como pequenos gráficos visuais ajudam você a enxergar qual produto vende mais e onde está sobrando dinheiro.',
          content: `Você não precisa ser um gênio da matemática para entender suas finanças. 
          
O segredo está em três passos práticos:
1. Anotar tudo o que entra e o que sai no mesmo horário todo dia.
2. Descobrir os 2 produtos ou serviços que mais trazem alegria e lucro.
3. Repetir o que deu certo com novas pessoas.

Quando você simplifica seus números, sobra tempo para focar no que você realmente gosta de fazer!`,
        },
        {
          id: '2',
          title: '5 Maneiras fáceis de usar automação no seu atendimento',
          category: 'Produtividade',
          readTime: '4 min de leitura',
          image:
            'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
          summary:
            'Como responder mensagens comuns na hora certa sem precisar ficar grudado na tela do celular o dia todo.',
          content: `Seus clientes adoram respostas rápidas. Quando alguém pergunta preço, horário ou endereço e recebe uma resposta amigável em menos de 1 minuto, a chance de comprar multiplica!
          
Dicas de ouro:
- Crie mensagens automáticas no WhatsApp para cumprimentar e tirar as dúvidas mais repetitivas.
- Mantenha um link com catálogo simples de fotos e valores.
- Deixe o horário da noite para descanso merecido enquanto o sistema acolhe o visitante.`,
        },
        {
          id: '3',
          title: 'Gente de verdade + Tecnologia: O par perfeito',
          category: 'Crescimento',
          readTime: '3 min de leitura',
          image:
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
          summary:
            'A tecnologia cuida da repetição pesada, e você coloca carinho, empatia e atenção que nenhum robô consegue copiar.',
          content: `Muitas pessoas têm medo de que a tecnologia afaste os clientes. Mas quando você usa do jeito certo, acontece o oposto!
          
A inteligência artificial ajuda a organizar o estoque, enviar confirmações e prever demandas. Com isso, sobra energia limpa para você conversar com calma, dar um sorriso e construir amizades duradouras com seus clientes.`,
        },
      ],
    },
    en: {
      tag: 'BLOG AND ARTICLES',
      title: 'Latest insights and trends',
      sub: 'Whether you are optimizing today or building for tomorrow, we help you move faster with confidence.',
      viewAll: 'VIEW ALL',
      readMore: 'Read post',
      posts: [
        {
          id: '1',
          title: 'Turning Data into Strategy: The Power of Analytics',
          category: 'Strategy',
          readTime: '3 min read',
          image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
          summary:
            'Learn how intuitive visual dashboards reveal your most profitable products and free up valuable time.',
          content: `You don’t need an engineering degree to read your numbers clearly. When metrics are intuitive and visual, decisions become natural and confidence skyrockets.`,
        },
        {
          id: '2',
          title: '5 Ways AI Can Streamline Business Operations',
          category: 'Productivity',
          readTime: '4 min read',
          image:
            'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
          summary:
            'How to answer everyday customer questions on autopilot while maintaining warmth and high satisfaction.',
          content: `Automating common FAQs and order triage lets your team focus on high-value human relationships that drive revenue.`,
        },
        {
          id: '3',
          title: 'Human + Machine: Finding the Perfect Balance',
          category: 'Growth',
          readTime: '3 min read',
          image:
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
          summary:
            'Technology takes care of repetitive chores so you can bring genuine empathy and creativity to the forefront.',
          content: `Automation never replaces human connection; it liberates people to do their most impactful, creative work.`,
        },
      ],
    },
  }[lang];

  return (
    <section id="blog" className="py-20 lg:py-28 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              <span>{t.tag}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              {t.title}
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-600">
              {t.sub}
            </p>
          </div>

          <button
            onClick={() => setSelectedPost(t.posts[0])}
            className="self-start md:self-auto shrink-0 px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-black transition-colors cursor-pointer"
          >
            {t.viewAll}
          </button>
        </div>

        {/* 3 Articles Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {t.posts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer bg-slate-50 hover:bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="h-52 rounded-2xl overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-slate-800">
                    {post.category}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                </div>

                <h3 className="mt-2.5 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-black">
                <span>{t.readMore}</span>
                <div className="w-7 h-7 rounded-full bg-slate-200 group-hover:bg-[#d2f829] flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-slate-800" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {selectedPost.category} • {selectedPost.readTime}
            </div>

            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {selectedPost.title}
            </h3>

            <div className="mt-6 rounded-2xl overflow-hidden h-64">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6 text-slate-700 whitespace-pre-line text-base leading-relaxed">
              {selectedPost.content}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 bg-black hover:bg-slate-800 text-white font-bold rounded-full text-xs uppercase"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
