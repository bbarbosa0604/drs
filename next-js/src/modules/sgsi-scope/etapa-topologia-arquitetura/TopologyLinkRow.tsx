'use client';

import { useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  TopologyLink,
  TopologyLinkInput,
  TopologyNode,
} from '@/services/sgsi-scope/scope-engine.service';
import styles from './EntityRow.module.css';

function nodeName(nodes: TopologyNode[], nodeId: string): string {
  return nodes.find((node) => node.id === nodeId)?.name ?? 'No removido';
}

export function TopologyLinkRow({
  link,
  nodes,
  onSave,
  onRemove,
}: {
  link: TopologyLink;
  nodes: TopologyNode[];
  onSave: (patch: Partial<TopologyLinkInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<TopologyLinkInput>({
    fromNodeId: link.fromNodeId,
    toNodeId: link.toNodeId,
    description: link.description,
    linkType: link.linkType,
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
          <p className={styles.name}>
            {nodeName(nodes, link.fromNodeId)} → {nodeName(nodes, link.toNodeId)}
          </p>
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
        {link.linkType ? <span className={styles.badge}>{link.linkType}</span> : null}
        {link.description ? (
          <p className={styles.description}>{link.description}</p>
        ) : null}
        {error ? <p role="alert">{error}</p> : null}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.editGrid}>
        <Field label="Origem" htmlFor={`link-from-${link.id}`}>
          <select
            className={fieldStyles.select}
            id={`link-from-${link.id}`}
            value={draft.fromNodeId}
            onChange={(event) =>
              setDraft((current) => ({ ...current, fromNodeId: event.target.value }))
            }
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Destino" htmlFor={`link-to-${link.id}`}>
          <select
            className={fieldStyles.select}
            id={`link-to-${link.id}`}
            value={draft.toNodeId}
            onChange={(event) =>
              setDraft((current) => ({ ...current, toNodeId: event.target.value }))
            }
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tipo/relacao" htmlFor={`link-type-${link.id}`}>
          <input
            className={fieldStyles.input}
            id={`link-type-${link.id}`}
            value={draft.linkType ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                linkType: event.target.value || null,
              }))
            }
          />
        </Field>
      </div>
      <Field label="Descricao" htmlFor={`link-description-${link.id}`}>
        <textarea
          className={fieldStyles.textarea}
          id={`link-description-${link.id}`}
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
          disabled={isSaving}
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
