'use client';

import { useState, type FormEvent } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ContextAspect,
  ContextAspectType,
} from '@/services/sgsi-scope/context.service';
import styles from './EtapaContextoForm.module.css';

async function postAspect(
  projectId: string,
  type: ContextAspectType,
  title: string,
  description: string,
): Promise<ContextAspect> {
  const response = await fetch(
    `/api/projects/${projectId}/sgsi-scope/context/aspects`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        title,
        description: description || null,
      }),
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(data?.message ?? 'Nao foi possivel salvar a questao.');
  }

  return (await response.json()) as ContextAspect;
}

async function deleteAspect(projectId: string, aspectId: string): Promise<void> {
  await fetch(
    `/api/projects/${projectId}/sgsi-scope/context/aspects/${aspectId}`,
    { method: 'DELETE' },
  );
}

export function AspectList({
  projectId,
  type,
  title,
  initialAspects,
}: {
  projectId: string;
  type: ContextAspectType;
  title: string;
  initialAspects: ContextAspect[];
}) {
  const [aspects, setAspects] = useState(initialAspects);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!newTitle.trim()) {
      setError('Titulo e obrigatorio.');

      return;
    }

    setIsSubmitting(true);

    try {
      const created = await postAspect(
        projectId,
        type,
        newTitle.trim(),
        newDescription.trim(),
      );

      setAspects((current) => [...current, created]);
      setNewTitle('');
      setNewDescription('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel salvar a questao.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(aspectId: string) {
    setAspects((current) => current.filter((aspect) => aspect.id !== aspectId));

    await deleteAspect(projectId, aspectId);
  }

  return (
    <div>
      <h3>{title}</h3>
      <ul className={styles.list}>
        {aspects.map((aspect) => (
          <li key={aspect.id} className={styles.aspectCard}>
            <div className={styles.aspectHeader}>
              <p className={styles.aspectTitle}>{aspect.title}</p>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => void handleRemove(aspect.id)}
              >
                Remover
              </button>
            </div>
            {aspect.description ? (
              <p className={styles.aspectMeta}>{aspect.description}</p>
            ) : null}
          </li>
        ))}
      </ul>

      <form className={styles.addForm} onSubmit={handleSubmit}>
        <Field label="Titulo" htmlFor={`${type}-title`}>
          <input
            className={fieldStyles.input}
            id={`${type}-title`}
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </Field>
        <Field label="Descricao" htmlFor={`${type}-description`}>
          <textarea
            className={fieldStyles.textarea}
            id={`${type}-description`}
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
          />
        </Field>
        {error ? <p className={styles.formError}>{error}</p> : null}
        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adicionando...' : 'Adicionar'}
        </button>
      </form>
    </div>
  );
}
