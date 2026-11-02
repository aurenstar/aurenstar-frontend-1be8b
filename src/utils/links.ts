import type { MouseEvent } from 'react';

/**
 * Real links for crawlers, SPA navigation for visitors.
 *
 * Every clickable item that opens another page is rendered as <a href="/real/url">, so Google can
 * follow it and "open in new tab" works. A normal left click is intercepted and handled in-app
 * (same tab, no reload, URL changes). Ctrl/Cmd/Shift/middle-click keep the browser default.
 */
export function isPlainLeftClick(event: MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function onPlainClick(handler: () => void) {
  return (event: MouseEvent) => {
    if (!isPlainLeftClick(event)) return;
    event.preventDefault();
    handler();
  };
}

/**
 * For a real <a> that sits inside a card whose own onClick already opens the page.
 * Plain click: stop the browser's full-page load and let the card handler navigate in-app.
 * Ctrl/Cmd/Shift/middle-click: let the browser open the link, and keep the card from also navigating.
 */
export function cardLinkClick(event: MouseEvent) {
  if (isPlainLeftClick(event)) event.preventDefault();
  else event.stopPropagation();
}
