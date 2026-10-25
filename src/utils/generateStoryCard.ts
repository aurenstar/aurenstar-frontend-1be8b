/**
 * Generates a viral Tweet / Social Post card (image)
 * styled exactly like a Twitter/X post from @aurenstar
 * for Instagram Stories, WhatsApp Status & Feed.
 */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export interface StoryCardData {
  userName: string;
  signName: string;
  signSymbol: string;
  signTheme: string;
  title?: string;
  affirmation: string;
  message: string;
  advice: string;
  dateStr?: string;
  lang?: 'pt' | 'en' | 'es';
}

function measureWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number = 20
): number {
  if (!text) return 0;
  const paragraphs = text.split('\n');
  let linesCount = 0;

  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p].trim();
    if (!paragraph) continue;
    const words = paragraph.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        line = words[n] + ' ';
        linesCount++;
        if (linesCount >= maxLines) return linesCount;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) linesCount++;
  }
  return linesCount;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 20
): number {
  if (!text) return y;
  const paragraphs = text.split('\n');
  let currentY = y;
  let linesDrawn = 0;

  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p].trim();
    if (!paragraph) {
      currentY += lineHeight * 0.4;
      continue;
    }
    const words = paragraph.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        linesDrawn++;
        if (linesDrawn >= maxLines) {
          ctx.fillText(line.trim() + '...', x, currentY);
          return currentY + lineHeight;
        }
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), x, currentY);
      currentY += lineHeight;
      linesDrawn++;
    }
    if (p < paragraphs.length - 1 && linesDrawn < maxLines) {
      currentY += lineHeight * 0.35;
    }
  }
  return currentY;
}

export async function createStoryCardCanvas(data: StoryCardData): Promise<HTMLCanvasElement> {
  const width = 1080;
  const cardX = 40;
  const cardY = 40;
  const cardW = width - 80;
  const maxTextW = cardW - 100;
  const avatarY = cardY + 50;
  const avatarR = 45;

  // Mede com precisão a altura necessária para evitar qualquer espaço em branco exagerado
  const testCanvas = document.createElement('canvas');
  testCanvas.width = width;
  testCanvas.height = 100;
  const testCtx = testCanvas.getContext('2d')!;

  const messageTitle = (data.title || data.signTheme || data.affirmation || '').trim();

  // 1. Altura do Título da Mensagem
  let titleHeight = 0;
  if (messageTitle) {
    testCtx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    const lines = measureWrappedLines(testCtx, messageTitle, maxTextW, 3);
    titleHeight = lines * 48 + 20;
  }

  // 2. Altura do Texto da Mensagem
  testCtx.font = 'normal 31px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  const messageLines = measureWrappedLines(testCtx, data.message || '', maxTextW, 16);
  const messageHeight = messageLines * 46;

  // Cabeçalho até início do texto
  const headerHeight = (avatarY + avatarR * 2 + 45) - cardY;
  const footerSpacing = 35;
  const footerHeight = 28;
  const bottomPadding = 45;

  // Altura do card proporcional e ajustada exatamente ao conteúdo
  const cardH = headerHeight + titleHeight + messageHeight + footerSpacing + footerHeight + bottomPadding;
  const height = Math.round(cardH + 80);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');

  // Background
  ctx.fillStyle = '#C9E5FF';
  ctx.fillRect(0, 0, width, height);

  // White Card Container
  const cardRadius = 32;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
  } else {
    ctx.rect(cardX, cardY, cardW, cardH);
  }
  ctx.fill();

  // Subtle Card Border
  ctx.strokeStyle = '#D9E8F8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 1. Profile Avatar (supplied Aurenstar logo)
  const avatarX = cardX + 50;
  const avatarImage = await loadImage('/aurenstar-avatar.png');

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(avatarImage, avatarX, avatarY, avatarR * 2, avatarR * 2);
  ctx.restore();

  // 2. Profile Name & Verified Badge
  const nameX = avatarX + avatarR * 2 + 25;
  const nameY = avatarY + 38;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#172B4D';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillText('Aurenstar', nameX, nameY);

  // Verified Badge (Orkut modern blue circle with white checkmark)
  const nameWidth = ctx.measureText('Aurenstar').width;
  const badgeX = nameX + nameWidth + 14;
  const badgeY = nameY - 12;
  const badgeR = 14;

  ctx.fillStyle = '#2878D0';
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(badgeX - 6, badgeY);
  ctx.lineTo(badgeX - 1, badgeY + 5);
  ctx.lineTo(badgeX + 7, badgeY - 6);
  ctx.stroke();

  // 3. Profile Handle & Address: @aurenstar • aurenstar.com
  ctx.textAlign = 'left';
  ctx.fillStyle = '#647DA5';
  ctx.font = 'normal 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillText('@aurenstar  ·  aurenstar.com', nameX, nameY + 38);

  // 4. Three dots icon on top right
  ctx.fillStyle = '#647DA5';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('···', cardX + cardW - 50, avatarY + 35);

  // 5. Tweet Body Content
  const textX = cardX + 50;
  let currentY = avatarY + avatarR * 2 + 45;

  // Título da Mensagem em Azul Orkut Moderno
  if (messageTitle) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#2878D0';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    currentY = wrapCanvasText(ctx, messageTitle, textX, currentY, maxTextW, 48, 3);
    currentY += 20;
  }

  // Mensagem Principal do Dia
  ctx.textAlign = 'left';
  ctx.fillStyle = '#172B4D';
  ctx.font = 'normal 31px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  currentY = wrapCanvasText(ctx, data.message, textX, currentY, maxTextW, 46, 16);

  // 6. Linha de Data, Horário e Site
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthName = monthNames[now.getMonth()];
  const yearShort = String(now.getFullYear()).slice(-2);
  const timeString = `${hours}:${minutes} · ${day} ${monthName} ${yearShort} · aurenstar.com`;

  currentY += footerSpacing;
  ctx.fillStyle = '#647DA5';
  ctx.font = 'normal 25px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillText(timeString, textX, currentY);

  return canvas;
}

export async function createVerticalStoryCardCanvas(data: StoryCardData): Promise<HTMLCanvasElement> {
  const source = await createStoryCardCanvas(data);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');
  ctx.fillStyle = '#C9E5FF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const maxWidth = 1000;
  const scale = Math.min(maxWidth / source.width, 1);
  const drawWidth = Math.round(source.width * scale);
  const drawHeight = Math.round(source.height * scale);
  const x = Math.round((canvas.width - drawWidth) / 2);
  const y = Math.round((canvas.height - drawHeight) / 2);
  ctx.drawImage(source, x, y, drawWidth, drawHeight);
  return canvas;
}

export async function downloadVerticalStoryCard(data: StoryCardData): Promise<void> {
  const canvas = await createVerticalStoryCardCanvas(data);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (data.userName || 'andriel').toLowerCase().replace(/[^a-z0-9]/g, '-');
      a.href = url;
      a.download = `aurenstar-story-vertical-${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}

export async function downloadStoryCard(data: StoryCardData): Promise<void> {
  const canvas = await createStoryCardCanvas(data);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (data.userName || 'andriel').toLowerCase().replace(/[^a-z0-9]/g, '-');
      a.href = url;
      a.download = `aurenstar-tweet-${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}

export async function shareStoryCardImage(data: StoryCardData): Promise<boolean> {
  const canvas = await createStoryCardCanvas(data);
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve(false);
      const safeName = (data.userName || 'andriel').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const file = new File([blob], `aurenstar-tweet-${safeName}.png`, {
        type: 'image/png',
      });

      if (
        typeof navigator !== 'undefined' &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: `Leitura diária de ${data.userName || 'Andriel'} • Aurenstar`,
            text: `✨ Leitura diária de ${data.userName || 'Andriel'} (${data.signName}) no @aurenstar: "${data.affirmation}" Acesse aurenstar.com`,
            files: [file],
          });
          resolve(true);
          return;
        } catch {
          // User cancelled
        }
      }

      // Fallback: download the file
      await downloadStoryCard(data);
      resolve(true);
    }, 'image/png');
  });
}
