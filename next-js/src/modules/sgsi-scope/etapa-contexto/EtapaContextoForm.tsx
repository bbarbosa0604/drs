'use client';

import { useCallback, useState } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type { Organization } from '@/services/organizations/organizations.service';
import type {
  ContextAspect,
  OrganizationContext,
} from '@/services/sgsi-scope/context.service';
import { AutosaveIndicator } from '../AutosaveIndicator';
import { useAutosave } from '../hooks/useAutosave';
import { RichTextEditor } from '../RichTextEditor';
import { StepNav } from '../StepNav';
import pageStyles from '../etapa-empresa/EtapaEmpresaForm.module.css';
import { AspectList } from './AspectList';
import styles from './EtapaContextoForm.module.css';

async function saveHistory(projectId: string, html: string): Promise<void> {
  const response = await fetch(
    `/api/projects/${projectId}/sgsi-scope/context/history`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historyHtml: html }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to save history.');
  }
}

type DirecionadoresField = 'business' | 'mission' | 'vision' | 'valuesText';

async function saveOrganization(
  organization: Organization,
): Promise<void> {
  const response = await fetch(`/api/organizations/${organization.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: organization.name,
      segment: organization.segment,
      employeeCount: organization.employeeCount,
      geographicScope: organization.geographicScope,
      productsServices: organization.productsServices,
      logoUrl: organization.logoUrl,
      institutionalHistory: organization.institutionalHistory,
      business: organization.business,
      mission: organization.mission,
      vision: organization.vision,
      values: organization.values,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save organization.');
  }
}

export function EtapaContextoForm({
  projectId,
  organization: initialOrganization,
  organizationContext,
  aspects,
}: {
  projectId: string;
  organization: Organization;
  organizationContext: OrganizationContext | null;
  aspects: ContextAspect[];
}) {
  const [organization, setOrganization] = useState(initialOrganization);

  const historyAutosave = useAutosave<string>((html) =>
    saveHistory(projectId, html),
  );
  const direcionadoresAutosave = useAutosave<Organization>((value) =>
    saveOrganization(value),
  );

  const handleDirecionadorChange = useCallback(
    (field: DirecionadoresField, rawValue: string) => {
      setOrganization((current) => {
        const next: Organization =
          field === 'valuesText'
            ? {
                ...current,
                values: rawValue
                  .split('\n')
                  .map((value) => value.trim())
                  .filter((value) => value.length > 0),
              }
            : { ...current, [field]: rawValue || null };

        direcionadoresAutosave.schedule(next);

        return next;
      });
    },
    [direcionadoresAutosave],
  );

  const externalAspects = aspects.filter(
    (aspect) => aspect.type === 'EXTERNAL',
  );
  const internalAspects = aspects.filter(
    (aspect) => aspect.type === 'INTERNAL',
  );

  return (
    <div className={pageStyles.page}>
      <StepNav projectId={projectId} activeStep={2} />

      <section className={pageStyles.card} aria-labelledby="historico-title">
        <div className={pageStyles.cardHeader}>
          <h2 className={pageStyles.cardTitle} id="historico-title">
            Historico
          </h2>
          <AutosaveIndicator status={historyAutosave.status} />
        </div>
        <RichTextEditor
          initialHtml={organizationContext?.history?.html ?? ''}
          onChangeHtml={(html) => historyAutosave.schedule(html)}
        />
      </section>

      <section className={pageStyles.card} aria-labelledby="direcionadores-title">
        <div className={pageStyles.cardHeader}>
          <h2 className={pageStyles.cardTitle} id="direcionadores-title">
            Direcionadores
          </h2>
          <AutosaveIndicator status={direcionadoresAutosave.status} />
        </div>
        <div className={pageStyles.row}>
          <Field label="Negocio" htmlFor="business">
            <textarea
              className={fieldStyles.textarea}
              id="business"
              defaultValue={organization.business ?? ''}
              onChange={(event) =>
                handleDirecionadorChange('business', event.target.value)
              }
            />
          </Field>
          <Field label="Missao" htmlFor="mission">
            <textarea
              className={fieldStyles.textarea}
              id="mission"
              defaultValue={organization.mission ?? ''}
              onChange={(event) =>
                handleDirecionadorChange('mission', event.target.value)
              }
            />
          </Field>
        </div>
        <div className={pageStyles.row}>
          <Field label="Visao" htmlFor="vision">
            <textarea
              className={fieldStyles.textarea}
              id="vision"
              defaultValue={organization.vision ?? ''}
              onChange={(event) =>
                handleDirecionadorChange('vision', event.target.value)
              }
            />
          </Field>
          <Field label="Valores" htmlFor="valuesText" hint="Um valor por linha.">
            <textarea
              className={fieldStyles.textarea}
              id="valuesText"
              defaultValue={organization.values.join('\n')}
              onChange={(event) =>
                handleDirecionadorChange('valuesText', event.target.value)
              }
            />
          </Field>
        </div>
      </section>

      <section className={pageStyles.card} aria-labelledby="questoes-title">
        <h2 className={pageStyles.cardTitle} id="questoes-title">
          Questoes externas e internas
        </h2>
        <div className={styles.columns}>
          <AspectList
            projectId={projectId}
            type="EXTERNAL"
            title="Questoes externas"
            initialAspects={externalAspects}
          />
          <AspectList
            projectId={projectId}
            type="INTERNAL"
            title="Questoes internas"
            initialAspects={internalAspects}
          />
        </div>
      </section>
    </div>
  );
}
