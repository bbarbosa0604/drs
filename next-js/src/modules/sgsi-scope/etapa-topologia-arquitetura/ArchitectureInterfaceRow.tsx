'use client';

import { useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ArchitectureComponent,
  ArchitectureInterface,
  ArchitectureInterfaceInput,
} from '@/services/sgsi-scope/scope-engine.service';
import styles from './EntityRow.module.css';

function componentName(components: ArchitectureComponent[], componentId: string): string {
  return (
    components.find((component) => component.id === componentId)?.name ??
    'Componente removido'
  );
}

export function ArchitectureInterfaceRow({
  architectureInterface,
  components,
  onSave,
  onRemove,
}: {
  architectureInterface: ArchitectureInterface;
  components: ArchitectureComponent[];
  onSave: (patch: Partial<ArchitectureInterfaceInput>) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ArchitectureInterfaceInput>({
    fromComponentId: architectureInterface.fromComponentId,
    toComponentId: architectureInterface.toComponentId,
    description: architectureInterface.description,
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
            {componentName(components, architectureInterface.fromComponentId)} →{' '}
            {componentName(components, architectureInterface.toComponentId)}
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
        {architectureInterface.description ? (
          <p className={styles.description}>{architectureInterface.description}</p>
        ) : null}
        {error ? <p role="alert">{error}</p> : null}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.editGrid}>
        <Field label="Origem" htmlFor={`interface-from-${architectureInterface.id}`}>
          <select
            className={fieldStyles.select}
            id={`interface-from-${architectureInterface.id}`}
            value={draft.fromComponentId}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                fromComponentId: event.target.value,
              }))
            }
          >
            {components.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Destino" htmlFor={`interface-to-${architectureInterface.id}`}>
          <select
            className={fieldStyles.select}
            id={`interface-to-${architectureInterface.id}`}
            value={draft.toComponentId}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                toComponentId: event.target.value,
              }))
            }
          >
            {components.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field
        label="Descricao"
        htmlFor={`interface-description-${architectureInterface.id}`}
      >
        <textarea
          className={fieldStyles.textarea}
          id={`interface-description-${architectureInterface.id}`}
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
