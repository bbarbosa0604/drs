'use client';

import { useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ArchitectureComponent,
  ArchitectureComponentInput,
} from '@/services/sgsi-scope/scope-engine.service';
import {
  scopeClassificationLabel,
  SCOPE_CLASSIFICATION_OPTIONS,
} from '../scope-engine-options';
import styles from './EntityRow.module.css';

export function ArchitectureComponentRow({
  component,
  onSave,
  onRemove,
}: {
  component: ArchitectureComponent;
  onSave: (patch: Partial<ArchitectureComponentInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ArchitectureComponentInput>({
    name: component.name,
    layer: component.layer,
    description: component.description,
    classification: component.classification,
  });

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    try {
      await onSave(draft);
      setIsEditing(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : 'Nao foi possivel salvar.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemove() {
    setError(null);

    try {
      await onRemove();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : 'Nao foi possivel remover.',
      );
    }
  }

  if (!isEditing) {
    return (
      <li className={styles.row}>
        <div className={styles.header}>
          <p className={styles.name}>{component.name}</p>
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
              onClick={() => void handleRemove()}
            >
              Remover
            </button>
          </div>
        </div>
        <div className={styles.meta}>
          {component.layer ? (
            <span className={styles.badge}>{component.layer}</span>
          ) : null}
          <span className={styles.badge}>
            {scopeClassificationLabel(component.classification)}
          </span>
        </div>
        {component.description ? (
          <p className={styles.description}>{component.description}</p>
        ) : null}
        {error ? <p role="alert">{error}</p> : null}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.editGrid}>
        <Field label="Nome" htmlFor={`component-name-${component.id}`}>
          <input
            className={fieldStyles.input}
            id={`component-name-${component.id}`}
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
          />
        </Field>
        <Field label="Camada" htmlFor={`component-layer-${component.id}`}>
          <input
            className={fieldStyles.input}
            id={`component-layer-${component.id}`}
            value={draft.layer ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                layer: event.target.value || null,
              }))
            }
          />
        </Field>
        <Field
          label="Classificacao de escopo"
          htmlFor={`component-classification-${component.id}`}
        >
          <select
            className={fieldStyles.select}
            id={`component-classification-${component.id}`}
            value={draft.classification ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                classification:
                  (event.target
                    .value as ArchitectureComponentInput['classification']) || null,
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
      <Field label="Descricao" htmlFor={`component-description-${component.id}`}>
        <textarea
          className={fieldStyles.textarea}
          id={`component-description-${component.id}`}
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
      {error ? <p role="alert">{error}</p> : null}
    </li>
  );
}
