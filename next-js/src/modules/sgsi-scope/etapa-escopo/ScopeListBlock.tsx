'use client';

import { useState, type FormEvent } from 'react';

import { fieldStyles } from '@/components/forms/Field';
import { EmptyState } from '@/components/dashboard/EmptyState';
import type { ScopeListItem } from '@/services/sgsi-scope/scope-definition.service';
import styles from './EtapaEscopoForm.module.css';

/** Reutilizado por caracteristicas (4.4) e beneficios (4.5) — mesma forma. */
export function ScopeListBlock({
  projectId,
  kind,
  initialItems,
  emptyMessage,
  placeholder,
}: {
  projectId: string;
  kind: 'characteristics' | 'benefits';
  initialItems: ScopeListItem[];
  emptyMessage: string;
  placeholder: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!description.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/sgsi-scope/scope-definition/${kind}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: description.trim() }),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(data?.message ?? 'Nao foi possivel adicionar o item.');
      }

      const created = (await response.json()) as ScopeListItem;

      setItems((current) => [...current, created]);
      setDescription('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel adicionar o item.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(itemId: string) {
    setItems((current) => current.filter((item) => item.id !== itemId));

    await fetch(
      `/api/projects/${projectId}/sgsi-scope/scope-definition/${kind}/${itemId}`,
      { method: 'DELETE' },
    );
  }

  return (
    <div>
      {items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.itemCard}>
              <p className={styles.itemText}>{item.description}</p>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => void handleRemove(item.id)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className={styles.inlineForm} onSubmit={handleSubmit}>
        <input
          className={fieldStyles.input}
          placeholder={placeholder}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          Adicionar
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
