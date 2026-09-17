'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Field, fieldStyles } from '@/components/forms/Field';
import type { Organization } from '@/services/organizations/organizations.service';
import type { Project } from '@/services/projects/projects.service';
import {
  PROJECT_STATUS_OPTIONS,
  projectSchema,
  type ProjectFormValues,
} from './project-schema';
import styles from './ProjectForm.module.css';

function toDefaultValues(project?: Project): ProjectFormValues {
  return {
    name: project?.name ?? '',
    organizationId: project?.organizationId ?? '',
    description: project?.description ?? '',
    startDate: project?.startDate ?? '',
    expectedEndDate: project?.expectedEndDate ?? '',
    status: project?.status,
  };
}

export function ProjectForm({
  project,
  organizations,
  currentUserId,
}: {
  project?: Project;
  organizations: Organization[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: toDefaultValues(project),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const payload = {
      name: values.name,
      organizationId: values.organizationId,
      responsibleUserId: project?.responsibleUserId ?? currentUserId,
      description: values.description || null,
      startDate: values.startDate || null,
      expectedEndDate: values.expectedEndDate || null,
      ...(project && values.status ? { status: values.status } : {}),
    };

    const url = project ? `/api/projects/${project.id}` : '/api/projects';
    const response = await fetch(url, {
      method: project ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      setFormError(data?.message ?? 'Nao foi possivel salvar o projeto.');

      return;
    }

    const saved = (await response.json()) as Project;

    router.push(`/projects/${saved.id}`);
    router.refresh();
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Field label="Nome" htmlFor="name" error={errors.name?.message}>
        <input className={fieldStyles.input} id="name" {...register('name')} />
      </Field>

      <Field
        label="Organizacao"
        htmlFor="organizationId"
        error={errors.organizationId?.message}
      >
        <select
          className={fieldStyles.select}
          id="organizationId"
          {...register('organizationId')}
          disabled={Boolean(project)}
        >
          <option value="">Selecione...</option>
          {organizations.map((organization) => (
            <option key={organization.id} value={organization.id}>
              {organization.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Descricao" htmlFor="description">
        <textarea
          className={fieldStyles.textarea}
          id="description"
          {...register('description')}
        />
      </Field>

      <div className={styles.row}>
        <Field label="Data de inicio" htmlFor="startDate">
          <input
            className={fieldStyles.input}
            id="startDate"
            type="date"
            {...register('startDate')}
          />
        </Field>
        <Field label="Previsao de termino" htmlFor="expectedEndDate">
          <input
            className={fieldStyles.input}
            id="expectedEndDate"
            type="date"
            {...register('expectedEndDate')}
          />
        </Field>
      </div>

      {project ? (
        <Field label="Status" htmlFor="status">
          <select className={fieldStyles.select} id="status" {...register('status')}>
            {PROJECT_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      {formError ? <p className={styles.formError}>{formError}</p> : null}

      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar projeto'}
      </button>
    </form>
  );
}
