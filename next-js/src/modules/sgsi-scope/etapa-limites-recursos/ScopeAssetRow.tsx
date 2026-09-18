'use client';

import { useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ScopeAsset,
  ScopeAssetInput,
} from '@/services/sgsi-scope/limits.service';
import {
  scopeClassificationLabel,
  SCOPE_CLASSIFICATION_OPTIONS,
} from '../scope-engine-options';
import styles from './EntityRow.module.css';

export function ScopeAssetRow({
  asset,
  onSave,
  onRemove,
}: {
  asset: ScopeAsset;
  onSave: (patch: Partial<ScopeAssetInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<ScopeAssetInput>({
    assetName: asset.assetName,
    category: asset.category,
    description: asset.description,
    responsible: asset.responsible,
    classification: asset.classification,
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
          <p className={styles.name}>{asset.assetName}</p>
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
          {asset.category ? <span className={styles.badge}>{asset.category}</span> : null}
          {asset.responsible ? <span>{asset.responsible}</span> : null}
          <span className={styles.badge}>
            {scopeClassificationLabel(asset.classification)}
          </span>
        </div>
        {asset.description ? (
          <p className={styles.description}>{asset.description}</p>
        ) : null}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.editGrid}>
        <Field label="Ativo" htmlFor={`asset-name-${asset.id}`}>
          <input
            className={fieldStyles.input}
            id={`asset-name-${asset.id}`}
            value={draft.assetName}
            onChange={(event) =>
              setDraft((current) => ({ ...current, assetName: event.target.value }))
            }
          />
        </Field>
        <Field label="Categoria" htmlFor={`asset-category-${asset.id}`}>
          <input
            className={fieldStyles.input}
            id={`asset-category-${asset.id}`}
            value={draft.category ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                category: event.target.value || null,
              }))
            }
          />
        </Field>
        <Field label="Responsavel" htmlFor={`asset-responsible-${asset.id}`}>
          <input
            className={fieldStyles.input}
            id={`asset-responsible-${asset.id}`}
            value={draft.responsible ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                responsible: event.target.value || null,
              }))
            }
          />
        </Field>
        <Field
          label="Classificacao de escopo"
          htmlFor={`asset-classification-${asset.id}`}
        >
          <select
            className={fieldStyles.select}
            id={`asset-classification-${asset.id}`}
            value={draft.classification ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                classification:
                  (event.target.value as ScopeAssetInput['classification']) || null,
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
      <Field label="Descricao" htmlFor={`asset-description-${asset.id}`}>
        <textarea
          className={fieldStyles.textarea}
          id={`asset-description-${asset.id}`}
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
          disabled={isSaving || !draft.assetName.trim()}
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
