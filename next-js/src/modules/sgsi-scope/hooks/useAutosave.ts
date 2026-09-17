'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Autosave com debounce (PRD secao 19): o usuario nunca depende so de um
 * botao "Salvar" manual. `save` deve fazer o PATCH parcial (so os campos que
 * mudaram); o hook so cuida do debounce e do estado visual
 * Salvando.../Salvo/Erro ao salvar.
 */
export function useAutosave<T>(save: (value: T) => Promise<void>, delayMs = 800) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSave = useRef(save);
  latestSave.current = save;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const schedule = useCallback(
    (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setStatus('saving');

        latestSave
          .current(value)
          .then(() => setStatus('saved'))
          .catch(() => setStatus('error'));
      }, delayMs);
    },
    [delayMs],
  );

  return { status, schedule };
}
