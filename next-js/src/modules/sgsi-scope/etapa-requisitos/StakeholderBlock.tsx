'use client';

import { useState, type FormEvent } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type { Stakeholder } from '@/services/sgsi-scope/requirements.service';
import styles from './EtapaRequisitosForm.module.css';

async function postStakeholder(
  projectId: string,
  name: string,
  requirements: string,
  needs: string,
  expectations: string,
  observations: string,
): Promise<Stakeholder> {
  const response = await fetch(
    `/api/projects/${projectId}/sgsi-scope/stakeholders`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        requirements: requirements || null,
        needs: needs || null,
        expectations: expectations || null,
        observations: observations || null,
      }),
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(data?.message ?? 'Nao foi possivel salvar a parte interessada.');
  }

  return (await response.json()) as Stakeholder;
}

export function StakeholderBlock({
  projectId,
  initialStakeholders,
}: {
  projectId: string;
  initialStakeholders: Stakeholder[];
}) {
  const [stakeholders, setStakeholders] = useState(initialStakeholders);
  const [name, setName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [needs, setNeeds] = useState('');
  const [expectations, setExpectations] = useState('');
  const [observations, setObservations] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Parte interessada e obrigatoria.');

      return;
    }

    setIsSubmitting(true);

    try {
      const created = await postStakeholder(
        projectId,
        name.trim(),
        requirements,
        needs,
        expectations,
        observations,
      );

      setStakeholders((current) => [...current, created]);
      setName('');
      setRequirements('');
      setNeeds('');
      setExpectations('');
      setObservations('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel salvar a parte interessada.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(stakeholderId: string) {
    setStakeholders((current) =>
      current.filter((stakeholder) => stakeholder.id !== stakeholderId),
    );

    await fetch(
      `/api/projects/${projectId}/sgsi-scope/stakeholders/${stakeholderId}`,
      { method: 'DELETE' },
    );
  }

  return (
    <div>
      <ul className={styles.list}>
        {stakeholders.map((stakeholder) => (
          <li key={stakeholder.id} className={styles.itemCard}>
            <div className={styles.itemHeader}>
              <p className={styles.itemTitle}>{stakeholder.name}</p>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => void handleRemove(stakeholder.id)}
              >
                Remover
              </button>
            </div>
            {stakeholder.requirements ? (
              <p className={styles.itemMeta}>
                Requisitos: {stakeholder.requirements}
              </p>
            ) : null}
            {stakeholder.needs ? (
              <p className={styles.itemMeta}>Necessidades: {stakeholder.needs}</p>
            ) : null}
            {stakeholder.expectations ? (
              <p className={styles.itemMeta}>
                Expectativas: {stakeholder.expectations}
              </p>
            ) : null}
            {stakeholder.observations ? (
              <p className={styles.itemMeta}>
                Observacoes: {stakeholder.observations}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <form className={styles.addForm} onSubmit={handleSubmit}>
        <Field label="Parte interessada" htmlFor="stakeholder-name">
          <input
            className={fieldStyles.input}
            id="stakeholder-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>
        <Field label="Requisitos" htmlFor="stakeholder-requirements">
          <textarea
            className={fieldStyles.textarea}
            id="stakeholder-requirements"
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
          />
        </Field>
        <Field label="Necessidades" htmlFor="stakeholder-needs">
          <textarea
            className={fieldStyles.textarea}
            id="stakeholder-needs"
            value={needs}
            onChange={(event) => setNeeds(event.target.value)}
          />
        </Field>
        <Field label="Expectativas" htmlFor="stakeholder-expectations">
          <textarea
            className={fieldStyles.textarea}
            id="stakeholder-expectations"
            value={expectations}
            onChange={(event) => setExpectations(event.target.value)}
          />
        </Field>
        <Field label="Observacoes" htmlFor="stakeholder-observations">
          <textarea
            className={fieldStyles.textarea}
            id="stakeholder-observations"
            value={observations}
            onChange={(event) => setObservations(event.target.value)}
          />
        </Field>
        {error ? <p className={styles.formError}>{error}</p> : null}
        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adicionando...' : 'Adicionar parte interessada'}
        </button>
      </form>
    </div>
  );
}
