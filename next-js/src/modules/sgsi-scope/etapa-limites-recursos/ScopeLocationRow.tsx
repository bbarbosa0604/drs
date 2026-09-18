'use client';

import { useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ScopeLocation,
  ScopeLocationInput,
} from '@/services/sgsi-scope/limits.service';
import {
  scopeClassificationLabel,
  SCOPE_CLASSIFICATION_OPTIONS,
} from '../scope-engine-options';
import styles from './EntityRow.module.css';

export function ScopeLocationRow({
  location,
  onSave,
  onRemove,
}: {
  location: ScopeLocation;
  onSave: (patch: Partial<ScopeLocationInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<ScopeLocationInput>({
    name: location.name,
    address: location.address,
    description: location.description,
    classification: location.classification,
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
          <p className={styles.name}>{location.name}</p>
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
          {location.address ? <span>{location.address}</span> : null}
          <span className={styles.badge}>
            {scopeClassificationLabel(location.classification)}
          </span>
        </div>
        {location.description ? (
          <p className={styles.description}>{location.description}</p>
        ) : null}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.editGrid}>
        <Field label="Nome" htmlFor={`location-name-${location.id}`}>
          <input
            className={fieldStyles.input}
            id={`location-name-${location.id}`}
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
          />
        </Field>
        <Field label="Endereco/localizacao" htmlFor={`location-address-${location.id}`}>
          <input
            className={fieldStyles.input}
            id={`location-address-${location.id}`}
            value={draft.address ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                address: event.target.value || null,
              }))
            }
          />
        </Field>
        <Field
          label="Classificacao de escopo"
          htmlFor={`location-classification-${location.id}`}
        >
          <select
            className={fieldStyles.select}
            id={`location-classification-${location.id}`}
            value={draft.classification ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                classification:
                  (event.target.value as ScopeLocationInput['classification']) ||
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
      <Field label="Descricao" htmlFor={`location-description-${location.id}`}>
        <textarea
          className={fieldStyles.textarea}
          id={`location-description-${location.id}`}
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
