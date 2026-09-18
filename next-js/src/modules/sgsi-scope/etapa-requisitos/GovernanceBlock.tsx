'use client';

import { useState, type FormEvent } from 'react';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  GovernanceCommittee,
  GovernanceMember,
} from '@/services/sgsi-scope/requirements.service';
import { AutosaveIndicator } from '../AutosaveIndicator';
import { useAutosave } from '../hooks/useAutosave';
import styles from './EtapaRequisitosForm.module.css';

async function saveCommittee(
  projectId: string,
  input: Partial<GovernanceCommittee>,
): Promise<void> {
  const response = await fetch(
    `/api/projects/${projectId}/sgsi-scope/governance`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to save governance committee.');
  }
}

async function postMember(
  projectId: string,
  name: string,
  jobRole: string,
  area: string,
  committeeRole: string,
): Promise<GovernanceMember> {
  const response = await fetch(
    `/api/projects/${projectId}/sgsi-scope/governance/members`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        jobRole,
        area: area || undefined,
        committeeRole: committeeRole || undefined,
      }),
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(data?.message ?? 'Nao foi possivel adicionar o membro.');
  }

  return (await response.json()) as GovernanceMember;
}

export function GovernanceBlock({
  projectId,
  committee,
  initialMembers,
}: {
  projectId: string;
  committee: GovernanceCommittee | null;
  initialMembers: GovernanceMember[];
}) {
  const [members, setMembers] = useState(initialMembers);
  const [name, setName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [area, setArea] = useState('');
  const [committeeRole, setCommitteeRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const committeeAutosave = useAutosave<Partial<GovernanceCommittee>>(
    (value) => saveCommittee(projectId, value),
  );

  async function handleAddMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !jobRole.trim()) {
      setError('Nome e funcao sao obrigatorios.');

      return;
    }

    setIsSubmitting(true);

    try {
      const created = await postMember(
        projectId,
        name.trim(),
        jobRole.trim(),
        area.trim(),
        committeeRole.trim(),
      );

      setMembers((current) => [...current, created]);
      setName('');
      setJobRole('');
      setArea('');
      setCommitteeRole('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel adicionar o membro.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemoveMember(memberId: string) {
    setMembers((current) => current.filter((member) => member.id !== memberId));

    await fetch(
      `/api/projects/${projectId}/sgsi-scope/governance/members/${memberId}`,
      { method: 'DELETE' },
    );
  }

  return (
    <div>
      <div className={styles.autosaveRow}>
        <AutosaveIndicator status={committeeAutosave.status} />
      </div>
      <div className={styles.addForm}>
        <Field label="Nome do comite" htmlFor="committee-name">
          <input
            className={fieldStyles.input}
            id="committee-name"
            defaultValue={committee?.name ?? ''}
            onChange={(event) =>
              committeeAutosave.schedule({ name: event.target.value || null })
            }
          />
        </Field>
        <Field label="Objetivo" htmlFor="committee-objective">
          <textarea
            className={fieldStyles.textarea}
            id="committee-objective"
            defaultValue={committee?.objective ?? ''}
            onChange={(event) =>
              committeeAutosave.schedule({
                objective: event.target.value || null,
              })
            }
          />
        </Field>
        <Field label="Responsabilidades" htmlFor="committee-responsibilities">
          <textarea
            className={fieldStyles.textarea}
            id="committee-responsibilities"
            defaultValue={committee?.responsibilities ?? ''}
            onChange={(event) =>
              committeeAutosave.schedule({
                responsibilities: event.target.value || null,
              })
            }
          />
        </Field>
        <Field label="Observacoes" htmlFor="committee-observations">
          <textarea
            className={fieldStyles.textarea}
            id="committee-observations"
            defaultValue={committee?.observations ?? ''}
            onChange={(event) =>
              committeeAutosave.schedule({
                observations: event.target.value || null,
              })
            }
          />
        </Field>
      </div>

      <h3 className={styles.subheading}>Membros</h3>
      {members.length === 0 ? (
        <EmptyState message="Nenhum membro cadastrado ainda." />
      ) : (
        <ul className={styles.list}>
          {members.map((member) => (
            <li key={member.id} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <p className={styles.itemTitle}>{member.name}</p>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => void handleRemoveMember(member.id)}
                >
                  Remover
                </button>
              </div>
              <p className={styles.itemMeta}>
                {member.jobRole}
                {member.area ? ` · ${member.area}` : ''}
                {member.committeeRole ? ` · ${member.committeeRole}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form className={styles.addForm} onSubmit={handleAddMember}>
        <div className={styles.inlineForm}>
          <input
            className={fieldStyles.input}
            placeholder="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className={fieldStyles.input}
            placeholder="Funcao"
            value={jobRole}
            onChange={(event) => setJobRole(event.target.value)}
          />
          <input
            className={fieldStyles.input}
            placeholder="Area (opcional)"
            value={area}
            onChange={(event) => setArea(event.target.value)}
          />
          <input
            className={fieldStyles.input}
            placeholder="Papel no comite (opcional)"
            value={committeeRole}
            onChange={(event) => setCommitteeRole(event.target.value)}
          />
          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting}
          >
            Adicionar membro
          </button>
        </div>
        {error ? <p className={styles.formError}>{error}</p> : null}
      </form>
    </div>
  );
}
