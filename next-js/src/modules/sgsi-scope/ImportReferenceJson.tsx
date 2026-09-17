'use client';

import { useState, type ChangeEvent } from 'react';

import styles from './ImportReferenceJson.module.css';

/**
 * PRD secao 8.3/31: importacao de referencia. So exibe o conteudo para
 * consulta — nunca preenche a declaracao de escopo automaticamente. Nao ha
 * endpoint de backend para isso (nenhuma task ainda criou um), entao esta
 * etapa e inteiramente client-side, sem persistencia.
 */
export function ImportReferenceJson() {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setError(null);
    setPreview(null);

    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);

      setPreview(JSON.stringify(parsed, null, 2));
    } catch {
      setError('Arquivo JSON invalido. Verifique o formato e tente novamente.');
    }
  }

  return (
    <div className={styles.wrapper}>
      <input type="file" accept="application/json" onChange={handleFileChange} />
      {preview ? (
        <>
          <p className={styles.banner}>
            Informacoes importadas servem apenas como referencia e nao definem
            o escopo automaticamente. Revise e preencha os campos manualmente.
          </p>
          <pre className={styles.preview}>{preview}</pre>
        </>
      ) : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
