'use client';

import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { Field, fieldStyles } from '@/components/forms/Field';
import { ValueChainDiagram, type DiagramData } from '@/modules/sgsi-scope/diagrams';
import type {
  ValueChainBlock,
  ValueChainBlockInput,
} from '@/services/sgsi-scope/scope-engine.service';
import pageStyles from '../etapa-empresa/EtapaEmpresaForm.module.css';
import {
  SCOPE_CLASSIFICATION_OPTIONS,
  toDiagramClassification,
  VALUE_CHAIN_CATEGORY_OPTIONS,
} from '../scope-engine-options';
import { StepNav } from '../StepNav';
import styles from './EtapaCadeiaValorForm.module.css';
import { ValueChainBlockRow } from './ValueChainBlockRow';

const CATEGORY_ORDER: ValueChainBlockInput['category'][] = [
  'INPUT',
  'PRIMARY_PROCESS',
  'SUPPORT_PROCESS',
  'OUTPUT',
];

const EMPTY_DRAFT: ValueChainBlockInput = {
  name: '',
  description: null,
  responsibleArea: null,
  category: 'PRIMARY_PROCESS',
  classification: null,
};

function toDiagramData(blocks: ValueChainBlock[]): DiagramData {
  const sorted = [...blocks].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category),
  );

  return {
    nodes: sorted.map((block) => ({
      id: block.id,
      label: block.name,
      classification: toDiagramClassification(block.classification),
      group: block.category,
    })),
    connections: [],
  };
}

export function EtapaCadeiaValorForm({
  projectId,
  initialBlocks,
}: {
  projectId: string;
  initialBlocks: ValueChainBlock[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [draft, setDraft] = useState<ValueChainBlockInput>(EMPTY_DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const diagramData = useMemo(() => toDiagramData(blocks), [blocks]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!draft.name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/sgsi-scope/value-chain/blocks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(data?.message ?? 'Nao foi possivel criar o bloco.');
      }

      const created = (await response.json()) as ValueChainBlock;

      setBlocks((current) => [...current, created]);
      setDraft(EMPTY_DRAFT);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel criar o bloco.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(
    blockId: string,
    patch: Partial<ValueChainBlockInput>,
  ) {
    const response = await fetch(
      `/api/projects/${projectId}/sgsi-scope/value-chain/blocks/${blockId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      },
    );

    if (!response.ok) {
      throw new Error('Nao foi possivel salvar o bloco.');
    }

    const updated = (await response.json()) as ValueChainBlock;

    setBlocks((current) =>
      current.map((block) => (block.id === blockId ? updated : block)),
    );
  }

  async function handleRemove(blockId: string) {
    setBlocks((current) => current.filter((block) => block.id !== blockId));

    await fetch(
      `/api/projects/${projectId}/sgsi-scope/value-chain/blocks/${blockId}`,
      { method: 'DELETE' },
    );
  }

  return (
    <div className={styles.page}>
      <StepNav projectId={projectId} activeStep={5} />

      <section className={pageStyles.card} aria-labelledby="value-chain-diagram-title">
        <h2 className={pageStyles.cardTitle} id="value-chain-diagram-title">
          Diagrama da cadeia de valor
        </h2>
        <div className={styles.diagramWrapper}>
          <ValueChainDiagram data={diagramData} />
        </div>
      </section>

      <section className={pageStyles.card} aria-labelledby="value-chain-blocks-title">
        <h2 className={pageStyles.cardTitle} id="value-chain-blocks-title">
          Blocos da cadeia de valor
        </h2>

        {blocks.length === 0 ? (
          <EmptyState message="Nenhum bloco cadastrado ainda." />
        ) : (
          <ul className={styles.list}>
            {blocks.map((block) => (
              <ValueChainBlockRow
                key={block.id}
                block={block}
                onSave={(patch) => handleUpdate(block.id, patch)}
                onRemove={() => handleRemove(block.id)}
              />
            ))}
          </ul>
        )}

        <form className={styles.form} onSubmit={handleCreate}>
          <div className={styles.row}>
            <Field label="Nome" htmlFor="new-block-name">
              <input
                className={fieldStyles.input}
                id="new-block-name"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
            </Field>
            <Field label="Categoria" htmlFor="new-block-category">
              <select
                className={fieldStyles.select}
                id="new-block-category"
                value={draft.category}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    category: event.target.value as ValueChainBlockInput['category'],
                  }))
                }
              >
                {VALUE_CHAIN_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Area responsavel" htmlFor="new-block-area">
              <input
                className={fieldStyles.input}
                id="new-block-area"
                value={draft.responsibleArea ?? ''}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    responsibleArea: event.target.value || null,
                  }))
                }
              />
            </Field>
            <Field label="Classificacao de escopo" htmlFor="new-block-classification">
              <select
                className={fieldStyles.select}
                id="new-block-classification"
                value={draft.classification ?? ''}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    classification:
                      (event.target.value as ValueChainBlockInput['classification']) ||
                      null,
                  }))
                }
              >
                <option value="">Nao classificado</option>
                {SCOPE_CLASSIFICATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Descricao" htmlFor="new-block-description">
            <textarea
              className={fieldStyles.textarea}
              id="new-block-description"
              value={draft.description ?? ''}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  description: event.target.value || null,
                }))
              }
            />
          </Field>
          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            Adicionar bloco
          </button>
          {error ? <p role="alert">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}
