'use client';

import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ScopeDefinition,
  ScopeDefinitionInput,
  ScopeListItem,
} from '@/services/sgsi-scope/scope-definition.service';
import { AutosaveIndicator } from '../AutosaveIndicator';
import pageStyles from '../etapa-empresa/EtapaEmpresaForm.module.css';
import { useAutosave } from '../hooks/useAutosave';
import { RichTextEditor } from '../RichTextEditor';
import { StepNav } from '../StepNav';
import { ScopeListBlock } from './ScopeListBlock';

async function saveScopeDefinition(
  projectId: string,
  input: ScopeDefinitionInput,
): Promise<void> {
  const response = await fetch(
    `/api/projects/${projectId}/sgsi-scope/scope-definition`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to save scope definition.');
  }
}

export function EtapaEscopoForm({
  projectId,
  scopeDefinition,
  characteristics,
  benefits,
}: {
  projectId: string;
  scopeDefinition: ScopeDefinition | null;
  characteristics: ScopeListItem[];
  benefits: ScopeListItem[];
}) {
  const autosave = useAutosave<ScopeDefinitionInput>((value) =>
    saveScopeDefinition(projectId, value),
  );

  return (
    <div className={pageStyles.page}>
      <StepNav projectId={projectId} activeStep={4} />

      <section className={pageStyles.card} aria-labelledby="scope-title">
        <div className={pageStyles.cardHeader}>
          <h2 className={pageStyles.cardTitle} id="scope-title">
            Declaracao de escopo
          </h2>
          <AutosaveIndicator status={autosave.status} />
        </div>
        <Field label="Declaracao formal do escopo" htmlFor="formal-declaration">
          <textarea
            className={fieldStyles.textarea}
            id="formal-declaration"
            defaultValue={scopeDefinition?.formalDeclaration ?? ''}
            onChange={(event) =>
              autosave.schedule({
                formalDeclaration: event.target.value || null,
              })
            }
          />
        </Field>
        <Field
          label="Fundamentacao executiva"
          htmlFor="executive-justification"
        >
          <textarea
            className={fieldStyles.textarea}
            id="executive-justification"
            defaultValue={scopeDefinition?.executiveJustification ?? ''}
            onChange={(event) =>
              autosave.schedule({
                executiveJustification: event.target.value || null,
              })
            }
          />
        </Field>
        <Field label="Descricao detalhada" htmlFor="detailed-description">
          <RichTextEditor
            initialHtml={scopeDefinition?.detailedDescription?.html ?? ''}
            onChangeHtml={(html) =>
              autosave.schedule({ detailedDescriptionHtml: html })
            }
          />
        </Field>
      </section>

      <section
        className={pageStyles.card}
        aria-labelledby="characteristics-title"
      >
        <h2 className={pageStyles.cardTitle} id="characteristics-title">
          Caracteristicas
        </h2>
        <ScopeListBlock
          projectId={projectId}
          kind="characteristics"
          initialItems={characteristics}
          emptyMessage="Nenhuma caracteristica cadastrada ainda."
          placeholder="Nova caracteristica"
        />
      </section>

      <section className={pageStyles.card} aria-labelledby="benefits-title">
        <h2 className={pageStyles.cardTitle} id="benefits-title">
          Beneficios / resultados esperados
        </h2>
        <ScopeListBlock
          projectId={projectId}
          kind="benefits"
          initialItems={benefits}
          emptyMessage="Nenhum beneficio cadastrado ainda."
          placeholder="Novo beneficio"
        />
      </section>
    </div>
  );
}
