'use client';

import { useState } from 'react';

import type {
  GeneratedDocument,
  GeneratedDocumentKind,
} from '@/services/sgsi-scope/documents.service';
import styles from './DocumentGenerationButtons.module.css';

const DOCUMENTS: Array<{ kind: GeneratedDocumentKind; label: string; path: string }> =
  [
    {
      kind: 'SCOPE_DECLARATION',
      label: 'Gerar Declaracao de Escopo (DOCX)',
      path: 'scope-declaration',
    },
    {
      kind: 'APPROVAL_PROPOSAL',
      label: 'Gerar Proposta de Aprovacao (DOCX)',
      path: 'approval-proposal',
    },
    {
      kind: 'APPROVAL_PRESENTATION',
      label: 'Gerar Apresentacao para Aprovacao (PPTX)',
      path: 'approval-presentation',
    },
  ];

type RowState =
  | { status: 'idle' }
  | { status: 'generating' }
  | { status: 'done'; document: GeneratedDocument }
  | { status: 'error'; message: string };

/**
 * Geracao dos 3 documentos do MVP (PRD secao 17). A validacao real e no
 * backend (Task 026) - esta UI so bloqueia com mensagem clara em caso de
 * erro, nunca fica num spinner infinito (PRD - Task 025, casos de erro).
 */
export function DocumentGenerationButtons({ projectId }: { projectId: string }) {
  const [states, setStates] = useState<Record<GeneratedDocumentKind, RowState>>({
    SCOPE_DECLARATION: { status: 'idle' },
    APPROVAL_PROPOSAL: { status: 'idle' },
    APPROVAL_PRESENTATION: { status: 'idle' },
  });

  async function handleGenerate(kind: GeneratedDocumentKind, path: string) {
    setStates((current) => ({ ...current, [kind]: { status: 'generating' } }));

    try {
      const response = await fetch(
        `/api/projects/${projectId}/sgsi-scope/documents/${path}`,
        { method: 'POST' },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(data?.message ?? 'Nao foi possivel gerar o documento.');
      }

      const document = (await response.json()) as GeneratedDocument;

      setStates((current) => ({ ...current, [kind]: { status: 'done', document } }));
    } catch (error) {
      setStates((current) => ({
        ...current,
        [kind]: {
          status: 'error',
          message:
            error instanceof Error ? error.message : 'Nao foi possivel gerar o documento.',
        },
      }));
    }
  }

  return (
    <div className={styles.list}>
      {DOCUMENTS.map(({ kind, label, path }) => {
        const state = states[kind];

        return (
          <div key={kind} className={styles.row}>
            <button
              type="button"
              className={styles.button}
              disabled={state.status === 'generating'}
              onClick={() => void handleGenerate(kind, path)}
            >
              {label}
            </button>
            {state.status === 'generating' ? (
              <span className={styles.status}>Gerando...</span>
            ) : null}
            {state.status === 'done' ? (
              <a
                className={styles.link}
                href={`/api/projects/${projectId}/sgsi-scope/documents/${state.document.id}/download`}
              >
                Baixar {state.document.fileName}
              </a>
            ) : null}
            {state.status === 'error' ? (
              <span className={styles.error} role="alert">
                {state.message}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
