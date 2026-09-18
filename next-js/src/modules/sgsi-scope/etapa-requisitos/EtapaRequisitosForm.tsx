import type {
  GovernanceCommittee,
  GovernanceMember,
  ProjectRequirement,
  Requirement,
  Stakeholder,
} from '@/services/sgsi-scope/requirements.service';
import pageStyles from '../etapa-empresa/EtapaEmpresaForm.module.css';
import { StepNav } from '../StepNav';
import { GovernanceBlock } from './GovernanceBlock';
import { RequirementsBlock } from './RequirementsBlock';
import { StakeholderBlock } from './StakeholderBlock';

export function EtapaRequisitosForm({
  projectId,
  stakeholders,
  requirementsLibrary,
  selectedRequirements,
  governanceCommittee,
  governanceMembers,
}: {
  projectId: string;
  stakeholders: Stakeholder[];
  requirementsLibrary: Requirement[];
  selectedRequirements: ProjectRequirement[];
  governanceCommittee: GovernanceCommittee | null;
  governanceMembers: GovernanceMember[];
}) {
  return (
    <div className={pageStyles.page}>
      <StepNav projectId={projectId} activeStep={3} />

      <section className={pageStyles.card} aria-labelledby="stakeholders-title">
        <h2 className={pageStyles.cardTitle} id="stakeholders-title">
          Partes interessadas
        </h2>
        <StakeholderBlock projectId={projectId} initialStakeholders={stakeholders} />
      </section>

      <section className={pageStyles.card} aria-labelledby="requirements-title">
        <h2 className={pageStyles.cardTitle} id="requirements-title">
          Legislacao e outros requisitos
        </h2>
        <RequirementsBlock
          projectId={projectId}
          library={requirementsLibrary}
          initialSelected={selectedRequirements}
        />
      </section>

      <section className={pageStyles.card} aria-labelledby="governance-title">
        <h2 className={pageStyles.cardTitle} id="governance-title">
          Governanca / CGSI
        </h2>
        <GovernanceBlock
          projectId={projectId}
          committee={governanceCommittee}
          initialMembers={governanceMembers}
        />
      </section>
    </div>
  );
}
