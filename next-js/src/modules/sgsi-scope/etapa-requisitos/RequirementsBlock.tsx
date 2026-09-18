'use client';

import { useMemo, useState, type FormEvent } from 'react';

import { fieldStyles } from '@/components/forms/Field';
import { EmptyState } from '@/components/dashboard/EmptyState';
import type {
  ProjectRequirement,
  Requirement,
} from '@/services/sgsi-scope/requirements.service';
import styles from './EtapaRequisitosForm.module.css';

async function postProjectRequirement(
  projectId: string,
  input: { requirementId?: string; title?: string },
): Promise<ProjectRequirement> {
  const response = await fetch(
    `/api/projects/${projectId}/sgsi-scope/requirements`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(data?.message ?? 'Nao foi possivel aplicar o requisito.');
  }

  return (await response.json()) as ProjectRequirement;
}

export function RequirementsBlock({
  projectId,
  library,
  initialSelected,
}: {
  projectId: string;
  library: Requirement[];
  initialSelected: ProjectRequirement[];
}) {
  const [selected, setSelected] = useState(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredLibrary = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return library;
    }

    return library.filter((requirement) =>
      requirement.title.toLowerCase().includes(term),
    );
  }, [library, searchTerm]);

  async function handleAddFromLibrary(requirementId: string) {
    setError(null);
    setIsSubmitting(true);

    try {
      const created = await postProjectRequirement(projectId, {
        requirementId,
      });

      setSelected((current) => [...current, created]);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel aplicar o requisito.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddCustom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!customTitle.trim()) {
      setError('Titulo do requisito e obrigatorio.');

      return;
    }

    setIsSubmitting(true);

    try {
      const created = await postProjectRequirement(projectId, {
        title: customTitle.trim(),
      });

      setSelected((current) => [...current, created]);
      setCustomTitle('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel aplicar o requisito.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(projectRequirementId: string) {
    setSelected((current) =>
      current.filter((item) => item.id !== projectRequirementId),
    );

    await fetch(
      `/api/projects/${projectId}/sgsi-scope/requirements/${projectRequirementId}`,
      { method: 'DELETE' },
    );
  }

  return (
    <div>
      <h3 className={styles.subheading}>Requisitos aplicados ao projeto</h3>
      {selected.length === 0 ? (
        <EmptyState message="Nenhum requisito aplicado ainda." />
      ) : (
        <ul className={styles.list}>
          {selected.map((item) => (
            <li key={item.id} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <p className={styles.itemTitle}>{item.title}</p>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => void handleRemove(item.id)}
                >
                  Remover
                </button>
              </div>
              <p className={styles.itemMeta}>{item.category}</p>
            </li>
          ))}
        </ul>
      )}

      <h3 className={styles.subheading}>Buscar na biblioteca</h3>
      {library.length === 0 ? (
        <EmptyState message="A biblioteca de requisitos ainda nao foi preenchida." />
      ) : (
        <>
          <input
            className={fieldStyles.input}
            placeholder="Buscar requisito (ex.: LGPD)"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <ul className={styles.list}>
            {filteredLibrary.map((requirement) => (
              <li key={requirement.id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <p className={styles.itemTitle}>{requirement.title}</p>
                  <button
                    type="button"
                    className={styles.removeButton}
                    disabled={isSubmitting}
                    onClick={() => void handleAddFromLibrary(requirement.id)}
                  >
                    Adicionar
                  </button>
                </div>
                {requirement.description ? (
                  <p className={styles.itemMeta}>{requirement.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className={styles.subheading}>Requisito customizado</h3>
      <form className={styles.inlineForm} onSubmit={handleAddCustom}>
        <input
          className={fieldStyles.input}
          placeholder="Titulo do requisito customizado"
          value={customTitle}
          onChange={(event) => setCustomTitle(event.target.value)}
        />
        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          Adicionar
        </button>
      </form>
      {error ? <p className={styles.formError}>{error}</p> : null}
    </div>
  );
}
