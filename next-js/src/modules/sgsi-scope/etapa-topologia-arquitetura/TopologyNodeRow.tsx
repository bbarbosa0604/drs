'use client';

import { useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  TopologyNode,
  TopologyNodeInput,
} from '@/services/sgsi-scope/scope-engine.service';
import {
  scopeClassificationLabel,
  SCOPE_CLASSIFICATION_OPTIONS,
  topologyNodeTypeLabel,
  TOPOLOGY_NODE_TYPE_OPTIONS,
} from '../scope-engine-options';
import styles from './EntityRow.module.css';

export function TopologyNodeRow({
  node,
  onSave,
  onRemove,
}: {
  node: TopologyNode;
  onSave: (patch: Partial<TopologyNodeInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<TopologyNodeInput>({
    name: node.name,
    type: node.type,
    description: node.description,
    classification: node.classification,
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
          <p className={styles.name}>{node.name}</p>
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
          <span className={styles.badge}>{topologyNodeTypeLabel(node.type)}</span>
          <span className={styles.badge}>
            {scopeClassificationLabel(node.classification)}
          </span>
        </div>
        {node.description ? (
          <p className={styles.description}>{node.description}</p>
        ) : null}
        {error ? <p role="alert">{error}</p> : null}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.editGrid}>
        <Field label="Nome" htmlFor={`node-name-${node.id}`}>
          <input
            className={fieldStyles.input}
            id={`node-name-${node.id}`}
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
          />
        </Field>
        <Field label="Tipo" htmlFor={`node-type-${node.id}`}>
          <select
            className={fieldStyles.select}
            id={`node-type-${node.id}`}
            value={draft.type}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                type: event.target.value as TopologyNodeInput['type'],
              }))
            }
          >
            {TOPOLOGY_NODE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Classificacao de escopo" htmlFor={`node-classification-${node.id}`}>
          <select
            className={fieldStyles.select}
            id={`node-classification-${node.id}`}
            value={draft.classification ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                classification:
                  (event.target.value as TopologyNodeInput['classification']) || null,
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
      <Field label="Descricao" htmlFor={`node-description-${node.id}`}>
        <textarea
          className={fieldStyles.textarea}
          id={`node-description-${node.id}`}
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
