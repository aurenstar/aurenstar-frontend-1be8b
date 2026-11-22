// OpenAI "batch" mode: send many requests in one file, get the answers back within 24 hours at about half the price.
// The story robot runs once a day, so waiting a day for the answers costs nothing. fetch is passed in so tests can fake it.
const API = process.env.OPENAI_BASE || 'https://api.openai.com/v1';
export interface BatchItem { id: string; prompt: string }
export interface BatchAnswer { json: any; promptTokens: number; outputTokens: number }
type F = typeof fetch;
const auth = (key: string) => ({ Authorization: `Bearer ${key}` });

/** Sends the requests as one batch and returns the batch id. */
export async function submitBatch(key: string, model: string, items: BatchItem[], temperature: number, f: F = fetch): Promise<string> {
  const jsonl = items.map((i) => JSON.stringify({ custom_id: i.id, method: 'POST', url: '/v1/chat/completions', body: { model, response_format: { type: 'json_object' }, temperature, messages: [{ role: 'user', content: i.prompt }] } })).join('\n');
  const form = new FormData();
  form.append('purpose', 'batch');
  form.append('file', new Blob([jsonl], { type: 'application/jsonl' }), 'stories.jsonl');
  const up = await f(`${API}/files`, { method: 'POST', headers: auth(key), body: form });
  if (!up.ok) throw new Error(`batch file upload failed (${up.status})`);
  const file: any = await up.json();
  const b = await f(`${API}/batches`, { method: 'POST', headers: { ...auth(key), 'Content-Type': 'application/json' }, body: JSON.stringify({ input_file_id: file.id, endpoint: '/v1/chat/completions', completion_window: '24h' }) });
  if (!b.ok) throw new Error(`batch create failed (${b.status})`);
  return String(((await b.json()) as any).id);
}

/** waiting = still running; done = answers ready (maybe none); dead = failed, expired or cancelled. */
export async function readBatch(key: string, id: string, f: F = fetch): Promise<{ state: 'waiting' | 'done' | 'dead'; answers: Map<string, BatchAnswer> }> {
  const answers = new Map<string, BatchAnswer>();
  const r = await f(`${API}/batches/${encodeURIComponent(id)}`, { headers: auth(key) });
  if (!r.ok) throw new Error(`batch status failed (${r.status})`);
  const b: any = await r.json();
  if (['failed', 'expired', 'cancelled'].includes(b.status)) return { state: 'dead', answers };
  if (b.status !== 'completed') return { state: 'waiting', answers };
  if (b.output_file_id) {
    const o = await f(`${API}/files/${encodeURIComponent(b.output_file_id)}/content`, { headers: auth(key) });
    if (!o.ok) throw new Error(`batch answers download failed (${o.status})`);
    for (const line of (await o.text()).split('\n').filter(Boolean)) {
      try {
        const l = JSON.parse(line);
        if (l.response?.status_code !== 200) continue;
        const body = l.response.body;
        answers.set(String(l.custom_id), { json: JSON.parse(String(body?.choices?.[0]?.message?.content || '{}')), promptTokens: body?.usage?.prompt_tokens || 0, outputTokens: body?.usage?.completion_tokens || 0 });
      } catch { /* one bad line does not stop the others */ }
    }
  }
  return { state: 'done', answers };
}
