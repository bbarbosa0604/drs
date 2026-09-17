'use client';

import Link from 'next/link';
import { useCallback } from 'react';

import { Field, fieldStyles } from '@/components/forms/Field';
import type { Organization } from '@/services/organizations/organizations.service';
import type {
  DocumentControl,
  DocumentControlInput,
} from '@/services/sgsi-scope/sgsi-scope.service';
import { AutosaveIndicator } from '../AutosaveIndicator';
import { useAutosave } from '../hooks/useAutosave';
import { ImportReferenceJson } from '../ImportReferenceJson';
import styles from './EtapaEmpresaForm.module.css';

const STEPS = [
  'Empresa',
  'Contexto',
  'Requisitos & CGSI',
  'Escopo',
  'Cadeia de Valor',
  'Topologia & Arquitetura',
  'Limites & Recursos',
  'Previa & Exportacao',
];

async function saveDocumentControl(
  projectId: string,
  input: DocumentControlInput,
): Promise<void> {
  const response = await fetch(
    `/api/projects/${projectId}/sgsi-scope/document-control`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to save document control.');
  }
}

export function EtapaEmpresaForm({
  projectId,
  organization,
  documentControl,
  currentUserName,
}: {
  projectId: string;
  organization: Organization;
  documentControl: DocumentControl | null;
  currentUserName: string;
}) {
  const { status, schedule } = useAutosave<DocumentControlInput>((value) =>
    saveDocumentControl(projectId, value),
  );

  const handleFieldChange = useCallback(
    (field: keyof DocumentControlInput, value: string) => {
      schedule({ [field]: value || null });
    },
    [schedule],
  );

  return (
    <div className={styles.page}>
      <nav className={styles.steps} aria-label="Etapas do Escopometro">
        {STEPS.map((step, index) => (
          <span
            key={step}
            className={index === 0 ? styles.stepActive : styles.step}
          >
            {index + 1}. {step}
          </span>
        ))}
      </nav>

      <section className={styles.card} aria-labelledby="empresa-title">
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle} id="empresa-title">
            Dados da organizacao
          </h2>
          <Link className={styles.editLink} href={`/organizations/${organization.id}`}>
            Editar organizacao
          </Link>
        </div>
        <p className={fieldStyles.hint}>
          Reaproveitados da Organizacao vinculada. Para altera-los, edite a
          Organizacao — nao ha ainda um campo de sobreposicao especifico do
          Escopometro para estes dados (pendencia registrada na Task 013).
        </p>
        <div className={styles.readonlyGrid}>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>Nome</span>
            <p className={styles.readonlyValue}>{organization.name}</p>
          </div>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>Segmento</span>
            <p className={styles.readonlyValue}>
              {organization.segment ?? '-'}
            </p>
          </div>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>Colaboradores</span>
            <p className={styles.readonlyValue}>
              {organization.employeeCount ?? '-'}
            </p>
          </div>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>Abrangencia geografica</span>
            <p className={styles.readonlyValue}>
              {organization.geographicScope ?? '-'}
            </p>
          </div>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>Produtos e servicos</span>
            <p className={styles.readonlyValue}>
              {organization.productsServices ?? '-'}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="controle-title">
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle} id="controle-title">
            Controle documental
          </h2>
          <AutosaveIndicator status={status} />
        </div>
        <div className={styles.row}>
          <Field label="Classificacao" htmlFor="classification">
            <input
              className={fieldStyles.input}
              id="classification"
              defaultValue={documentControl?.classification ?? ''}
              onChange={(event) =>
                handleFieldChange('classification', event.target.value)
              }
            />
          </Field>
          <Field label="Versao" htmlFor="version">
            <input
              className={fieldStyles.input}
              id="version"
              defaultValue={documentControl?.version ?? ''}
              onChange={(event) =>
                handleFieldChange('version', event.target.value)
              }
            />
          </Field>
        </div>
        <div className={styles.row}>
          <Field label="Data de criacao" htmlFor="documentDate">
            <input
              className={fieldStyles.input}
              id="documentDate"
              type="date"
              defaultValue={documentControl?.documentDate ?? ''}
              onChange={(event) =>
                handleFieldChange('documentDate', event.target.value)
              }
            />
          </Field>
          <Field label="Validade" htmlFor="validUntil">
            <input
              className={fieldStyles.input}
              id="validUntil"
              type="date"
              defaultValue={documentControl?.validUntil ?? ''}
              onChange={(event) =>
                handleFieldChange('validUntil', event.target.value)
              }
            />
          </Field>
        </div>
        <div className={styles.readonlyGrid}>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>Elaborado por</span>
            <p className={styles.readonlyValue}>{currentUserName}</p>
          </div>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>Aprovado por</span>
            <p className={styles.readonlyValue}>
              Ainda nao aprovado (fluxo de aprovacao e a Task 027)
            </p>
          </div>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="import-title">
        <h2 className={styles.cardTitle} id="import-title">
          Importar referencia (JSON)
        </h2>
        <ImportReferenceJson />
      </section>
    </div>
  );
}
