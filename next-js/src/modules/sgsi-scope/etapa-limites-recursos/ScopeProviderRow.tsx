'use client';

import { useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ScopeProvider,
  ScopeProviderInput,
} from '@/services/sgsi-scope/limits.service';
import {
  scopeClassificationLabel,
  SCOPE_CLASSIFICATION_OPTIONS,
} from '../scope-engine-options';
import styles from './EntityRow.module.css';

export function ScopeProviderRow({
  provider,
  onSave,
  onRemove,
}: {
  provider: ScopeProvider;
  onSave: (patch: Partial<ScopeProviderInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<ScopeProviderInput>({
    providerName: provider.providerName,
    service: provider.service,
    description: provider.description,
    classification: provider.classification,
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
          <p className={styles.name}>{provider.providerName}</p>
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
          {provider.service ? (
            <span className={styles.badge}>{provider.service}</span>
          ) : null}
          <span className={styles.badge}>
            {scopeClassificationLabel(provider.classification)}
          </span>
        </div>
        {provider.description ? (
          <p className={styles.description}>{provider.description}</p>
        ) : null}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.editGrid}>
        <Field label="Prestador" htmlFor={`provider-name-${provider.id}`}>
          <input
            className={fieldStyles.input}
            id={`provider-name-${provider.id}`}
            value={draft.providerName}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                providerName: event.target.value,
              }))
            }
          />
        </Field>
        <Field label="Servico" htmlFor={`provider-service-${provider.id}`}>
          <input
            className={fieldStyles.input}
            id={`provider-service-${provider.id}`}
            value={draft.service ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                service: event.target.value || null,
              }))
            }
          />
        </Field>
        <Field
          label="Classificacao de escopo"
          htmlFor={`provider-classification-${provider.id}`}
        >
          <select
            className={fieldStyles.select}
            id={`provider-classification-${provider.id}`}
            value={draft.classification ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                classification:
                  (event.target.value as ScopeProviderInput['classification']) ||
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
      <Field label="Descricao" htmlFor={`provider-description-${provider.id}`}>
        <textarea
          className={fieldStyles.textarea}
          id={`provider-description-${provider.id}`}
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
          disabled={isSaving || !draft.providerName.trim()}
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
