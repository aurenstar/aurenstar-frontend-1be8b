import { useCallback, useEffect, useState } from 'react';

/**
 * Owner-only panel (address /admin): read the comments people left and approve or hide them with one click.
 * Not linked anywhere, not indexed, and every action needs the password that the owner set in Cloudflare.
 */
type Status = 'pending' | 'approved' | 'hidden';
interface Row { id: number; name: string; message: string; stars: number | null; sign: string; lang: string; country?: string | null; moderated_by?: string | null; moderation_note?: string | null; status: Status; created_at: string }

const KEY = 'aurenstar_admin_pw';
const AI_PROMPT =
  'Anexei uma planilha com comentários reais de visitantes do site Aurenstar (colunas: data, país, idioma, estrelas, signo, nome, mensagem). ' +
  'Leia tudo e me diga, em português simples: 1) o que as pessoas mais elogiam; 2) as reclamações e dificuldades; 3) pedidos de novas ferramentas ou melhorias; ' +
  '4) diferenças por país ou idioma; 5) as 5 melhorias mais importantes para eu fazer primeiro no site. Ignore spam.';
const TABS: { id: Status; label: string }[] = [
  { id: 'pending', label: 'Esperando' },
  { id: 'approved', label: 'Publicados' },
  { id: 'hidden', label: 'Escondidos' },
];

async function api(body: Record<string, unknown>): Promise<{ status: number; data: any }> {
  try {
    const res = await fetch('/api/admin-comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return { status: res.status, data: await res.json().catch(() => ({})) };
  } catch {
    return { status: 0, data: {} };
  }
}

export function AdminPage({ onBackToHome }: { onBackToHome: () => void }) {
  const [typed, setTyped] = useState('');
  const [password, setPassword] = useState('');
  const [rows, setRows] = useState<Row[] | null>(null);
  const [aiOn, setAiOn] = useState<boolean | null>(null);
  const [emails, setEmails] = useState<{ tshirts: number; newsletter: number } | null>(null);
  const [tab, setTab] = useState<Status>('pending');
  const [error, setError] = useState('');
  const [missing, setMissing] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<{ csv: string; count: number; files: { name: string; url: string }[] } | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async (pw: string) => {
    setBusy(true);
    setError('');
    const { status, data } = await api({ password: pw, action: 'list' });
    setBusy(false);
    if (status === 200 && data.ok) {
      setPassword(pw);
      setRows(data.comments);
      setEmails(data.emails);
      setAiOn(typeof data.ai === 'boolean' ? data.ai : null);
      try { sessionStorage.setItem(KEY, pw); } catch { /* storage blocked */ }
    } else {
      try { sessionStorage.removeItem(KEY); } catch { /* storage blocked */ }
      setRows(null);
      if (status === 503) { setMissing(data.missing || []); setError('config'); }
      else if (status === 401) setError('Senha incorreta.');
      else if (status === 429) setError('Muitas tentativas. Espere um pouco e tente de novo.');
      else setError('Não consegui falar com o servidor. Tente de novo.');
    }
  }, []);

  useEffect(() => {
    let saved = '';
    try { saved = sessionStorage.getItem(KEY) || ''; } catch { /* storage blocked */ }
    if (saved) void load(saved);
  }, [load]);

  const setStatus = async (id: number, status: Status) => {
    setBusy(true);
    const { data } = await api({ password, action: 'set', id, status });
    setBusy(false);
    if (data.ok) setRows((r) => r && r.map((x) => (x.id === id ? { ...x, status } : x)));
    else setError('Não deu certo. Tente de novo.');
  };

  const makeReport = async () => {
    setBusy(true);
    setCopied(false);
    const { data } = await api({ password, action: 'report' });
    setBusy(false);
    if (data.ok) setReport({ csv: data.csv, count: data.count, files: data.files || [] });
    else setError('Não consegui preparar o relatório. Tente de novo.');
  };
  const downloadEmails = async (list: 'tshirts' | 'newsletter') => {
    setBusy(true);
    const { data } = await api({ password, action: 'emails' });
    setBusy(false);
    if (data.ok) downloadCsv(data[list].csv, list === 'tshirts' ? 'emails-camisetas' : 'emails-newsletter');
    else setError('Não consegui preparar os e-mails. Tente de novo.');
  };
  const downloadCsv = (csv: string, base = 'comentarios-aurenstar') => {
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${base}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shown = (rows || []).filter((r) => r.status === tab);
  const count = (s: Status) => (rows || []).filter((r) => r.status === s).length;

  return (
    <div className="min-h-screen w-full bg-[#C9E5FF] px-4 pb-20 pt-24 text-[#172B4D] sm:pt-28">
      <div className="mx-auto w-full max-w-3xl">
        <button type="button" onClick={onBackToHome} className="mb-4 text-xs font-bold text-[#647DA5] hover:text-[#172B4D] sm:text-sm">← Voltar ao site</button>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Painel da Aurenstar</h1>
        <p className="mt-1 text-sm text-[#647DA5]">Só você vê esta página. Leia os comentários e escolha o que aparece no site.</p>

        {error === 'config' && (
          <div className="mt-6 rounded-2xl border border-[#D9E8F8] bg-white p-5 text-sm leading-relaxed">
            <p className="font-extrabold">Falta um passo para o painel funcionar 🔧</p>
            <p className="mt-2">No Cloudflare (Settings → Variables and Secrets), crie {missing.length ? 'estes itens' : 'os itens'}:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {(missing.length ? missing : ['ADMIN_PASSWORD', 'SUPABASE_SERVICE_KEY']).map((m) => (
                <li key={m}>
                  <b>{m}</b> — {m === 'ADMIN_PASSWORD' ? 'a senha que você vai digitar aqui (invente uma longa)' : 'a "secret key" do Supabase (Project Settings → API Keys)'}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[#647DA5]">Depois é só esperar o site atualizar e recarregar esta página.</p>
          </div>
        )}

        {!rows && error !== 'config' && (
          <form
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#D9E8F8] bg-white p-5 sm:flex-row"
            onSubmit={(e) => { e.preventDefault(); if (typed) void load(typed); }}
          >
            <input
              type="password"
              autoComplete="current-password"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Sua senha"
              className="min-w-0 flex-1 rounded-xl border border-[#D9E8F8] bg-[#F4F9FF] px-4 py-3 text-sm outline-none focus:border-[#3982C8]"
            />
            <button type="submit" disabled={busy || !typed} className="rounded-xl bg-[#E73578] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#D0306C] disabled:opacity-60">
              {busy ? 'Entrando…' : 'Entrar'}
            </button>
            {error && <p className="text-sm font-bold text-[#E73578] sm:self-center">{error}</p>}
          </form>
        )}

        {rows && (
          <>
            {aiOn !== null && (
              <p className={`mt-4 rounded-xl px-4 py-2 text-xs font-bold sm:text-sm ${aiOn ? 'bg-white/70 text-[#3982C8]' : 'bg-[#FDE8F0] text-[#E73578]'}`}>
                {aiOn ? '🤖 IA que confere os comentários: ligada ✅' : '🤖 IA que confere os comentários: DESLIGADA ❌ (falta a chave OPENAI_API_KEY nesta versão do site; os comentários ficam esperando você)'}
              </p>
            )}
            {emails && (
              <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-xs font-bold text-[#647DA5] sm:text-sm">
                <p>📧 E-mails guardados (quem saiu da lista não conta):</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => void downloadEmails('tshirts')} className="rounded-full border border-[#D9E8F8] bg-white px-4 py-2 font-extrabold text-[#3982C8] hover:bg-[#E4F1FF] disabled:opacity-60">
                    ⬇️ Camisetas ({emails.tshirts})
                  </button>
                  <button type="button" disabled={busy} onClick={() => void downloadEmails('newsletter')} className="rounded-full border border-[#D9E8F8] bg-white px-4 py-2 font-extrabold text-[#3982C8] hover:bg-[#E4F1FF] disabled:opacity-60">
                    ⬇️ Newsletter ({emails.newsletter})
                  </button>
                </div>
              </div>
            )}
            <div className="mt-5 flex gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-extrabold sm:text-sm ${tab === t.id ? 'bg-[#3982C8] text-white' : 'bg-white text-[#3982C8]'}`}
                >
                  {t.label} ({count(t.id)})
                </button>
              ))}
            </div>
            {error && <p className="mt-3 text-sm font-bold text-[#E73578]">{error}</p>}

            <div className="mt-4 space-y-3">
              {shown.length === 0 && (
                <p className="rounded-2xl border border-[#D9E8F8] bg-white p-6 text-center text-sm text-[#647DA5]">
                  {tab === 'pending' ? 'Nenhum comentário esperando 🎉' : 'Nada por aqui ainda.'}
                </p>
              )}
              {shown.map((r) => (
                <article key={r.id} className="rounded-2xl border border-[#D9E8F8] bg-white p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#647DA5]">
                    <b className="text-sm text-[#172B4D]">{r.name || 'Sem nome'}</b>
                    {r.stars ? <span className="text-[#E73578]">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span> : null}
                    {r.sign && <span>{r.sign}</span>}
                    <span className="uppercase">{r.lang}</span>
                    {r.country && <img src={`/flags/${r.country.toLowerCase()}.svg`} alt={r.country} title={r.country} className="h-3.5 w-5 rounded-[2px] object-cover" />}
                    <span>{new Date(r.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{r.message}</p>
                  {r.moderated_by === 'ai' && (
                    <p className="mt-2 rounded-lg bg-[#E4F1FF] px-3 py-1.5 text-xs font-bold text-[#3982C8]">
                      🤖 IA: {r.status === 'approved' ? 'publicou' : r.status === 'hidden' ? 'escondeu' : 'deixou para você decidir'}{r.moderation_note ? ` — ${r.moderation_note}` : ''}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.status !== 'approved' && (
                      <button type="button" disabled={busy} onClick={() => setStatus(r.id, 'approved')} className="rounded-full bg-[#3982C8] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#17366F] disabled:opacity-60">
                        ✅ Publicar no site
                      </button>
                    )}
                    {r.status !== 'hidden' && (
                      <button type="button" disabled={busy} onClick={() => setStatus(r.id, 'hidden')} className="rounded-full border border-[#D9E8F8] bg-white px-4 py-2 text-xs font-extrabold text-[#E73578] hover:bg-[#FDE8F0] disabled:opacity-60">
                        {r.status === 'approved' ? 'Tirar do site' : '🚫 Esconder'}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <section className="mt-6 rounded-2xl border border-[#D9E8F8] bg-white p-4 sm:p-5">
              <p className="text-sm font-extrabold">📥 Relatório para a IA analisar</p>
              <p className="mt-1 text-xs leading-relaxed text-[#647DA5]">
                Todo mês os comentários antigos viram uma planilha guardada fora do banco (não pesa nada). Aqui você baixa tudo para mandar a uma IA ver o que as pessoas pensam.
              </p>
              <button type="button" disabled={busy} onClick={() => void makeReport()} className="mt-3 rounded-full bg-[#E73578] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#D0306C] disabled:opacity-60">
                Preparar relatório
              </button>
              {report && (
                <div className="mt-3 space-y-2 text-xs">
                  <button type="button" onClick={() => downloadCsv(report.csv)} className="block rounded-full border border-[#D9E8F8] bg-[#F4F9FF] px-4 py-2 font-extrabold text-[#3982C8] hover:bg-[#E4F1FF]">
                    ⬇️ Baixar comentários de agora ({report.count})
                  </button>
                  {report.files.map((f) => (
                    <a key={f.name} href={f.url} className="block rounded-full border border-[#D9E8F8] bg-[#F4F9FF] px-4 py-2 font-extrabold text-[#3982C8] hover:bg-[#E4F1FF]">
                      ⬇️ Arquivo guardado: {f.name}
                    </a>
                  ))}
                  {report.files.length === 0 && <p className="text-[#647DA5]">Ainda não há arquivos mensais (o primeiro nasce quando existirem comentários com mais de 30 dias).</p>}
                  <button type="button" onClick={() => { void navigator.clipboard?.writeText(AI_PROMPT); setCopied(true); }} className="block rounded-full border border-[#D9E8F8] bg-white px-4 py-2 font-extrabold text-[#647DA5] hover:text-[#172B4D]">
                    {copied ? '✅ Pedido copiado!' : '📋 Copiar o pedido pronto para colar na IA'}
                  </button>
                </div>
              )}
            </section>

            <div className="mt-6 flex gap-4 text-xs font-bold text-[#647DA5]">
              <button type="button" onClick={() => void load(password)} className="hover:text-[#172B4D]">↻ Atualizar</button>
              <button type="button" onClick={() => { try { sessionStorage.removeItem(KEY); } catch { /* */ } setRows(null); setPassword(''); setTyped(''); }} className="hover:text-[#172B4D]">Sair</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
