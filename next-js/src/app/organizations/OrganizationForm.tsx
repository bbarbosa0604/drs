'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Field, fieldStyles } from '@/components/forms/Field';
import type { Organization } from '@/services/organizations/organizations.service';
import {
  organizationSchema,
  parseValuesText,
  type OrganizationFormValues,
} from './organization-schema';
import styles from './OrganizationForm.module.css';

function toDefaultValues(
  organization?: Organization,
): OrganizationFormValues {
  return {
    name: organization?.name ?? '',
    segment: organization?.segment ?? '',
    employeeCount: organization?.employeeCount ?? '',
    geographicScope: organization?.geographicScope ?? '',
    productsServices: organization?.productsServices ?? '',
    logoUrl: organization?.logoUrl ?? '',
    institutionalHistory: organization?.institutionalHistory ?? '',
    business: organization?.business ?? '',
    mission: organization?.mission ?? '',
    vision: organization?.vision ?? '',
    valuesText: organization?.values?.join('\n') ?? '',
  };
}

export function OrganizationForm({
  organization,
}: {
  organization?: Organization;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: toDefaultValues(organization),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const payload = {
      name: values.name,
      segment: values.segment || null,
      employeeCount: values.employeeCount || null,
      geographicScope: values.geographicScope || null,
      productsServices: values.productsServices || null,
      logoUrl: values.logoUrl || null,
      institutionalHistory: values.institutionalHistory || null,
      business: values.business || null,
      mission: values.mission || null,
      vision: values.vision || null,
      values: parseValuesText(values.valuesText),
    };

    const url = organization
      ? `/api/organizations/${organization.id}`
      : '/api/organizations';
    const response = await fetch(url, {
      method: organization ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      setFormError(data?.message ?? 'Nao foi possivel salvar a organizacao.');

      return;
    }

    const saved = (await response.json()) as Organization;

    router.push(`/organizations/${saved.id}`);
    router.refresh();
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Field label="Razao social" htmlFor="name" error={errors.name?.message}>
        <input className={fieldStyles.input} id="name" {...register('name')} />
      </Field>

      <div className={styles.row}>
        <Field label="Segmento" htmlFor="segment">
          <input
            className={fieldStyles.input}
            id="segment"
            {...register('segment')}
          />
        </Field>
        <Field label="Numero de colaboradores" htmlFor="employeeCount">
          <input
            className={fieldStyles.input}
            id="employeeCount"
            {...register('employeeCount')}
          />
        </Field>
      </div>

      <Field label="Abrangencia geografica" htmlFor="geographicScope">
        <input
          className={fieldStyles.input}
          id="geographicScope"
          {...register('geographicScope')}
        />
      </Field>

      <Field label="Produtos e servicos" htmlFor="productsServices">
        <textarea
          className={fieldStyles.textarea}
          id="productsServices"
          {...register('productsServices')}
        />
      </Field>

      <Field
        label="URL do logotipo"
        htmlFor="logoUrl"
        hint="Storage definitivo sera tratado numa task futura (026)."
      >
        <input
          className={fieldStyles.input}
          id="logoUrl"
          {...register('logoUrl')}
        />
      </Field>

      <Field label="Historico institucional" htmlFor="institutionalHistory">
        <textarea
          className={fieldStyles.textarea}
          id="institutionalHistory"
          {...register('institutionalHistory')}
        />
      </Field>

      <Field label="Negocio" htmlFor="business">
        <textarea
          className={fieldStyles.textarea}
          id="business"
          {...register('business')}
        />
      </Field>

      <div className={styles.row}>
        <Field label="Missao" htmlFor="mission">
          <textarea
            className={fieldStyles.textarea}
            id="mission"
            {...register('mission')}
          />
        </Field>
        <Field label="Visao" htmlFor="vision">
          <textarea
            className={fieldStyles.textarea}
            id="vision"
            {...register('vision')}
          />
        </Field>
      </div>

      <Field
        label="Valores"
        htmlFor="valuesText"
        hint="Um valor por linha."
      >
        <textarea
          className={fieldStyles.textarea}
          id="valuesText"
          {...register('valuesText')}
        />
      </Field>

      {formError ? <p className={styles.formError}>{formError}</p> : null}

      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar organizacao'}
      </button>
    </form>
  );
}
