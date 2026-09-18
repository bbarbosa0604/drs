'use client';

import { useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ScopeEmployeeGroup,
  ScopeEmployeeGroupInput,
} from '@/services/sgsi-scope/limits.service';
import {
  scopeClassificationLabel,
  SCOPE_CLASSIFICATION_OPTIONS,
} from '../scope-engine-options';
import styles from './EntityRow.module.css';

export function ScopeEmployeeGroupRow({
  group,
  onSave,
  onRemove,
}: {
  group: ScopeEmployeeGroup;
  onSave: (patch: Partial<ScopeEmployeeGroupInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<ScopeEmployeeGroupInput>({
    areaOrGroup: group.areaOrGroup,
    quantity: group.quantity,
    description: group.description,
    classification: group.classification,
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
          <p className={styles.name}>{group.areaOrGroup}</p>
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
          {group.quantity !== null ? <span>{group.quantity} pessoas</span> : null}
          <span className={styles.badge}>
            {scopeClassificationLabel(group.classification)}
          </span>
        </div>
        {group.description ? (
          <p className={styles.description}>{group.description}</p>
        ) : null}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.editGrid}>
        <Field label="Area/grupo" htmlFor={`group-area-${group.id}`}>
          <input
            className={fieldStyles.input}
            id={`group-area-${group.id}`}
            value={draft.areaOrGroup}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                areaOrGroup: event.target.value,
              }))
            }
          />
        </Field>
        <Field label="Quantidade" htmlFor={`group-quantity-${group.id}`}>
          <input
            className={fieldStyles.input}
            id={`group-quantity-${group.id}`}
            type="number"
            min={0}
            value={draft.quantity ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                quantity: event.target.value === '' ? null : Number(event.target.value),
              }))
            }
          />
        </Field>
        <Field
          label="Classificacao de escopo"
          htmlFor={`group-classification-${group.id}`}
        >
          <select
            className={fieldStyles.select}
            id={`group-classification-${group.id}`}
            value={draft.classification ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                classification:
                  (event.target.value as ScopeEmployeeGroupInput['classification']) ||
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
      <Field label="Descricao" htmlFor={`group-description-${group.id}`}>
        <textarea
          className={fieldStyles.textarea}
          id={`group-description-${group.id}`}
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
          disabled={isSaving || !draft.areaOrGroup.trim()}
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
