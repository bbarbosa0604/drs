import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizacao de conteudo rico (PRD secao 30): allowlist estrita de tags de
 * formatacao basica, sem script/style/iframe/on* handlers, sem `javascript:`
 * em href. Usado antes de persistir qualquer HTML vindo do editor de texto
 * rico (Etapa 2 - Historico, PRD secao 9.1).
 */
export function sanitizeRichTextHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'blockquote',
      'a',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}
