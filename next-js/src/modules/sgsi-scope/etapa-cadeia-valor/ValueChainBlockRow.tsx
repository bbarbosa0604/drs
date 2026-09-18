'use client';

import { useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ValueChainBlock,
  ValueChainBlockInput,
} from '@/services/sgsi-scope/scope-engine.service';
import {
  scopeClassificationLabel,
  SCOPE_CLASSIFICATION_OPTIONS,
  valueChainCategoryLabel,
  VALUE_CHAIN_CATEGORY_OPTIONS,
} from '../scope-engine-options';
import styles from './ValueChainBlockRow.module.css';

export function ValueChainBlockRow({
  block,
  onSave,
  onRemove,
}: {
  block: ValueChainBlock;
  onSave: (patch: Partial<ValueChainBlockInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<ValueChainBlockInput>({
    name: block.name,
    description: block.description,
    responsibleArea: block.responsibleArea,
    category: block.category,
    classification: block.classification,
  });

  async function handleSave() {
    setIsSaving(true);

    try {
      await onSave(draft);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }

  if (!isEditing) {
    return (
      <li className={styles.row}>
        <div className={styles.header}>
          <p className={styles.name}>{block.name}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.removeButton}`}
              onClick={() => void onRemove()}
            >
              Remover
            </button>
          </div>
        </div>
        <div className={styles.meta}>
          <span className={styles.badge}>
            {valueChainCategoryLabel(block.category)}
          </span>
          <span className={styles.badge}>
            {scopeClassificationLabel(block.classification)}
          </span>
          {block.responsibleArea ? <span>{block.responsibleArea}</span> : null}
        </div>
        {block.description ? (
          <p className={styles.description}>{block.description}</p>
        ) : null}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.editGrid}>
        <Field label="Nome" htmlFor={`name-${block.id}`}>
          <input
            className={fieldStyles.input}
            id={`name-${block.id}`}
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
          />
        </Field>
        <Field label="Categoria" htmlFor={`category-${block.id}`}>
          <select
            className={fieldStyles.select}
            id={`category-${block.id}`}
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
        <Field label="Classificacao de escopo" htmlFor={`classification-${block.id}`}>
          <select
            className={fieldStyles.select}
            id={`classification-${block.id}`}
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
        <Field label="Area responsavel" htmlFor={`area-${block.id}`}>
          <input
            className={fieldStyles.input}
            id={`area-${block.id}`}
            value={draft.responsibleArea ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                responsibleArea: event.target.value || null,
              }))
            }
          />
        </Field>
      </div>
      <Field label="Descricao" htmlFor={`description-${block.id}`}>
        <textarea
          className={fieldStyles.textarea}
          id={`description-${block.id}`}
          value={draft.description ?? ''}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              description: event.target.value || null,
            }))
          }
        />
      </Field>
      <div className={styles.editActions}>
        <button
          type="button"
          className={styles.saveButton}
          disabled={isSaving || !draft.name.trim()}
          onClick={() => void handleSave()}
        >
          Salvar
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => setIsEditing(false)}
        >
          Cancelar
        </button>
      </div>
    </li>
  );
}
