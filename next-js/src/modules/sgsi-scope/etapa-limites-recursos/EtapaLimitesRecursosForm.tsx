'use client';

import { useState } from 'react';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { Field, fieldStyles } from '@/components/forms/Field';
import type {
  ScopeApproval,
  ScopeApprovalInput,
  ScopeAsset,
  ScopeAssetInput,
  ScopeEmployeeGroup,
  ScopeEmployeeGroupInput,
  ScopeLocation,
  ScopeLocationInput,
  ScopeProvider,
  ScopeProviderInput,
  ScopeRevision,
  ScopeRevisionInput,
} from '@/services/sgsi-scope/limits.service';
import { AutosaveIndicator } from '../AutosaveIndicator';
import pageStyles from '../etapa-empresa/EtapaEmpresaForm.module.css';
import { useAutosave } from '../hooks/useAutosave';
import { SCOPE_CLASSIFICATION_OPTIONS } from '../scope-engine-options';
import { StepNav } from '../StepNav';
import styles from './EtapaLimitesRecursosForm.module.css';
import { ScopeAssetRow } from './ScopeAssetRow';
import { ScopeEmployeeGroupRow } from './ScopeEmployeeGroupRow';
import { ScopeLocationRow } from './ScopeLocationRow';
import { ScopeProviderRow } from './ScopeProviderRow';

const EMPTY_LOCATION_DRAFT: ScopeLocationInput = {
  name: '',
  address: null,
  description: null,
  classification: null,
};
const EMPTY_GROUP_DRAFT: ScopeEmployeeGroupInput = {
  areaOrGroup: '',
  quantity: null,
  description: null,
  classification: null,
};
const EMPTY_ASSET_DRAFT: ScopeAssetInput = {
  assetName: '',
  category: null,
  description: null,
  responsible: null,
  classification: null,
};
const EMPTY_PROVIDER_DRAFT: ScopeProviderInput = {
  providerName: '',
  service: null,
  description: null,
  classification: null,
};
const EMPTY_REVISION_DRAFT: ScopeRevisionInput = {
  version: '',
  revisedAt: '',
  responsible: '',
  changeDescription: '',
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(data?.message ?? 'Nao foi possivel salvar.');
  }

  return (await response.json()) as T;
}

async function patchJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel salvar.');
  }

  return (await response.json()) as T;
}

async function saveApproval(projectId: string, input: ScopeApprovalInput) {
  await patchJson(`/api/projects/${projectId}/sgsi-scope/limits/approval`, input);
}

export function EtapaLimitesRecursosForm({
  projectId,
  initialLocations,
  initialEmployeeGroups,
  initialAssets,
  initialProviders,
  initialApproval,
  initialRevisions,
}: {
  projectId: string;
  initialLocations: ScopeLocation[];
  initialEmployeeGroups: ScopeEmployeeGroup[];
  initialAssets: ScopeAsset[];
  initialProviders: ScopeProvider[];
  initialApproval: ScopeApproval | null;
  initialRevisions: ScopeRevision[];
}) {
  const [locations, setLocations] = useState(initialLocations);
  const [locationDraft, setLocationDraft] = useState(EMPTY_LOCATION_DRAFT);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [groups, setGroups] = useState(initialEmployeeGroups);
  const [groupDraft, setGroupDraft] = useState(EMPTY_GROUP_DRAFT);
  const [groupError, setGroupError] = useState<string | null>(null);

  const [assets, setAssets] = useState(initialAssets);
  const [assetDraft, setAssetDraft] = useState(EMPTY_ASSET_DRAFT);
  const [assetError, setAssetError] = useState<string | null>(null);

  const [providers, setProviders] = useState(initialProviders);
  const [providerDraft, setProviderDraft] = useState(EMPTY_PROVIDER_DRAFT);
  const [providerError, setProviderError] = useState<string | null>(null);

  const [revisions, setRevisions] = useState(initialRevisions);
  const [revisionDraft, setRevisionDraft] = useState(EMPTY_REVISION_DRAFT);
  const [revisionError, setRevisionError] = useState<string | null>(null);

  const approvalAutosave = useAutosave<ScopeApprovalInput>((value) =>
    saveApproval(projectId, value),
  );

  async function handleCreateLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocationError(null);

    if (!locationDraft.name.trim()) {
      return;
    }

    try {
      const created = await postJson<ScopeLocation>(
        `/api/projects/${projectId}/sgsi-scope/limits/locations`,
        locationDraft,
      );

      setLocations((current) => [...current, created]);
      setLocationDraft(EMPTY_LOCATION_DRAFT);
    } catch (submitError) {
      setLocationError(
        submitError instanceof Error ? submitError.message : 'Erro ao criar.',
      );
    }
  }

  async function handleUpdateLocation(
    locationId: string,
    patch: Partial<ScopeLocationInput>,
  ) {
    const updated = await patchJson<ScopeLocation>(
      `/api/projects/${projectId}/sgsi-scope/limits/locations/${locationId}`,
      patch,
    );

    setLocations((current) =>
      current.map((location) => (location.id === locationId ? updated : location)),
    );
  }

  async function handleRemoveLocation(locationId: string) {
    setLocations((current) => current.filter((location) => location.id !== locationId));

    await fetch(`/api/projects/${projectId}/sgsi-scope/limits/locations/${locationId}`, {
      method: 'DELETE',
    });
  }

  async function handleCreateGroup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGroupError(null);

    if (!groupDraft.areaOrGroup.trim()) {
      return;
    }

    try {
      const created = await postJson<ScopeEmployeeGroup>(
        `/api/projects/${projectId}/sgsi-scope/limits/employee-groups`,
        groupDraft,
      );

      setGroups((current) => [...current, created]);
      setGroupDraft(EMPTY_GROUP_DRAFT);
    } catch (submitError) {
      setGroupError(
        submitError instanceof Error ? submitError.message : 'Erro ao criar.',
      );
    }
  }

  async function handleUpdateGroup(
    groupId: string,
    patch: Partial<ScopeEmployeeGroupInput>,
  ) {
    const updated = await patchJson<ScopeEmployeeGroup>(
      `/api/projects/${projectId}/sgsi-scope/limits/employee-groups/${groupId}`,
      patch,
    );

    setGroups((current) => current.map((group) => (group.id === groupId ? updated : group)));
  }

  async function handleRemoveGroup(groupId: string) {
    setGroups((current) => current.filter((group) => group.id !== groupId));

    await fetch(
      `/api/projects/${projectId}/sgsi-scope/limits/employee-groups/${groupId}`,
      { method: 'DELETE' },
    );
  }

  async function handleCreateAsset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAssetError(null);

    if (!assetDraft.assetName.trim()) {
      return;
    }

    try {
      const created = await postJson<ScopeAsset>(
        `/api/projects/${projectId}/sgsi-scope/limits/assets`,
        assetDraft,
      );

      setAssets((current) => [...current, created]);
      setAssetDraft(EMPTY_ASSET_DRAFT);
    } catch (submitError) {
      setAssetError(
        submitError instanceof Error ? submitError.message : 'Erro ao criar.',
      );
    }
  }

  async function handleUpdateAsset(assetId: string, patch: Partial<ScopeAssetInput>) {
    const updated = await patchJson<ScopeAsset>(
      `/api/projects/${projectId}/sgsi-scope/limits/assets/${assetId}`,
      patch,
    );

    setAssets((current) => current.map((asset) => (asset.id === assetId ? updated : asset)));
  }

  async function handleRemoveAsset(assetId: string) {
    setAssets((current) => current.filter((asset) => asset.id !== assetId));

    await fetch(`/api/projects/${projectId}/sgsi-scope/limits/assets/${assetId}`, {
      method: 'DELETE',
    });
  }

  async function handleCreateProvider(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProviderError(null);

    if (!providerDraft.providerName.trim()) {
      return;
    }

    try {
      const created = await postJson<ScopeProvider>(
        `/api/projects/${projectId}/sgsi-scope/limits/providers`,
        providerDraft,
      );

      setProviders((current) => [...current, created]);
      setProviderDraft(EMPTY_PROVIDER_DRAFT);
    } catch (submitError) {
      setProviderError(
        submitError instanceof Error ? submitError.message : 'Erro ao criar.',
      );
    }
  }

  async function handleUpdateProvider(
    providerId: string,
    patch: Partial<ScopeProviderInput>,
  ) {
    const updated = await patchJson<ScopeProvider>(
      `/api/projects/${projectId}/sgsi-scope/limits/providers/${providerId}`,
      patch,
    );

    setProviders((current) =>
      current.map((provider) => (provider.id === providerId ? updated : provider)),
    );
  }

  async function handleRemoveProvider(providerId: string) {
    setProviders((current) => current.filter((provider) => provider.id !== providerId));

    await fetch(`/api/projects/${projectId}/sgsi-scope/limits/providers/${providerId}`, {
      method: 'DELETE',
    });
  }

  async function handleCreateRevision(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRevisionError(null);

    if (
      !revisionDraft.version.trim() ||
      !revisionDraft.revisedAt ||
      !revisionDraft.responsible.trim() ||
      !revisionDraft.changeDescription.trim()
    ) {
      setRevisionError('Preencha versao, data, responsavel e descricao da alteracao.');

      return;
    }

    try {
      const created = await postJson<ScopeRevision>(
        `/api/projects/${projectId}/sgsi-scope/limits/revisions`,
        revisionDraft,
      );

      setRevisions((current) => [created, ...current]);
      setRevisionDraft(EMPTY_REVISION_DRAFT);
    } catch (submitError) {
      setRevisionError(
        submitError instanceof Error ? submitError.message : 'Erro ao criar.',
      );
    }
  }

  return (
    <div className={styles.page}>
      <StepNav projectId={projectId} activeStep={7} />

      <h2 className={styles.sectionTitle}>Localidades</h2>
      <section className={pageStyles.card} aria-labelledby="locations-title">
        <h2 className={pageStyles.cardTitle} id="locations-title">
          Localidades
        </h2>
        {locations.length === 0 ? (
          <EmptyState message="Nenhuma localidade cadastrada ainda." />
        ) : (
          <ul className={styles.list}>
            {locations.map((location) => (
              <ScopeLocationRow
                key={location.id}
                location={location}
                onSave={(patch) => handleUpdateLocation(location.id, patch)}
                onRemove={() => handleRemoveLocation(location.id)}
              />
            ))}
          </ul>
        )}
        <form className={styles.form} onSubmit={handleCreateLocation}>
          <div className={styles.row}>
            <Field label="Nome" htmlFor="new-location-name">
              <input
                className={fieldStyles.input}
                id="new-location-name"
                value={locationDraft.name}
                onChange={(event) =>
                  setLocationDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Endereco/localizacao" htmlFor="new-location-address">
              <input
                className={fieldStyles.input}
                id="new-location-address"
                value={locationDraft.address ?? ''}
                onChange={(event) =>
                  setLocationDraft((current) => ({
                    ...current,
                    address: event.target.value || null,
                  }))
                }
              />
            </Field>
            <Field label="Classificacao de escopo" htmlFor="new-location-classification">
              <select
                className={fieldStyles.select}
                id="new-location-classification"
                value={locationDraft.classification ?? ''}
                onChange={(event) =>
                  setLocationDraft((current) => ({
                    ...current,
                    classification:
                      (event.target.value as ScopeLocationInput['classification']) ||
                      null,
                  }))
                }
              >
                <option value="">Nao classificado</option>
                {SCOPE_CLASSIFICATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button className={styles.submit} type="submit">
            Adicionar localidade
          </button>
          {locationError ? <p role="alert">{locationError}</p> : null}
        </form>
      </section>

      <h2 className={styles.sectionTitle}>Colaboradores / areas</h2>
      <section className={pageStyles.card} aria-labelledby="groups-title">
        <h2 className={pageStyles.cardTitle} id="groups-title">
          Colaboradores / areas
        </h2>
        {groups.length === 0 ? (
          <EmptyState message="Nenhum grupo cadastrado ainda." />
        ) : (
          <ul className={styles.list}>
            {groups.map((group) => (
              <ScopeEmployeeGroupRow
                key={group.id}
                group={group}
                onSave={(patch) => handleUpdateGroup(group.id, patch)}
                onRemove={() => handleRemoveGroup(group.id)}
              />
            ))}
          </ul>
        )}
        <form className={styles.form} onSubmit={handleCreateGroup}>
          <div className={styles.row}>
            <Field label="Area/grupo" htmlFor="new-group-area">
              <input
                className={fieldStyles.input}
                id="new-group-area"
                value={groupDraft.areaOrGroup}
                onChange={(event) =>
                  setGroupDraft((current) => ({
                    ...current,
                    areaOrGroup: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Quantidade" htmlFor="new-group-quantity">
              <input
                className={fieldStyles.input}
                id="new-group-quantity"
                type="number"
                min={0}
                value={groupDraft.quantity ?? ''}
                onChange={(event) =>
                  setGroupDraft((current) => ({
                    ...current,
                    quantity:
                      event.target.value === '' ? null : Number(event.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Classificacao de escopo" htmlFor="new-group-classification">
              <select
                className={fieldStyles.select}
                id="new-group-classification"
                value={groupDraft.classification ?? ''}
                onChange={(event) =>
                  setGroupDraft((current) => ({
                    ...current,
                    classification:
                      (event.target
                        .value as ScopeEmployeeGroupInput['classification']) || null,
                  }))
                }
              >
                <option value="">Nao classificado</option>
                {SCOPE_CLASSIFICATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button className={styles.submit} type="submit">
            Adicionar grupo
          </button>
          {groupError ? <p role="alert">{groupError}</p> : null}
        </form>
      </section>

      <h2 className={styles.sectionTitle}>Ativos tecnologicos</h2>
      <section className={pageStyles.card} aria-labelledby="assets-title">
        <h2 className={pageStyles.cardTitle} id="assets-title">
          Ativos tecnologicos
        </h2>
        {assets.length === 0 ? (
          <EmptyState message="Nenhum ativo cadastrado ainda." />
        ) : (
          <ul className={styles.list}>
            {assets.map((asset) => (
              <ScopeAssetRow
                key={asset.id}
                asset={asset}
                onSave={(patch) => handleUpdateAsset(asset.id, patch)}
                onRemove={() => handleRemoveAsset(asset.id)}
              />
            ))}
          </ul>
        )}
        <form className={styles.form} onSubmit={handleCreateAsset}>
          <div className={styles.row}>
            <Field label="Ativo" htmlFor="new-asset-name">
              <input
                className={fieldStyles.input}
                id="new-asset-name"
                value={assetDraft.assetName}
                onChange={(event) =>
                  setAssetDraft((current) => ({
                    ...current,
                    assetName: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Categoria" htmlFor="new-asset-category">
              <input
                className={fieldStyles.input}
                id="new-asset-category"
                value={assetDraft.category ?? ''}
                onChange={(event) =>
                  setAssetDraft((current) => ({
                    ...current,
                    category: event.target.value || null,
                  }))
                }
              />
            </Field>
            <Field label="Responsavel" htmlFor="new-asset-responsible">
              <input
                className={fieldStyles.input}
                id="new-asset-responsible"
                value={assetDraft.responsible ?? ''}
                onChange={(event) =>
                  setAssetDraft((current) => ({
                    ...current,
                    responsible: event.target.value || null,
                  }))
                }
              />
            </Field>
            <Field label="Classificacao de escopo" htmlFor="new-asset-classification">
              <select
                className={fieldStyles.select}
                id="new-asset-classification"
                value={assetDraft.classification ?? ''}
                onChange={(event) =>
                  setAssetDraft((current) => ({
                    ...current,
                    classification:
                      (event.target.value as ScopeAssetInput['classification']) ||
                      null,
                  }))
                }
              >
                <option value="">Nao classificado</option>
                {SCOPE_CLASSIFICATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button className={styles.submit} type="submit">
            Adicionar ativo
          </button>
          {assetError ? <p role="alert">{assetError}</p> : null}
        </form>
      </section>

      <h2 className={styles.sectionTitle}>Prestadores de servico</h2>
      <section className={pageStyles.card} aria-labelledby="providers-title">
        <h2 className={pageStyles.cardTitle} id="providers-title">
          Prestadores de servico
        </h2>
        {providers.length === 0 ? (
          <EmptyState message="Nenhum prestador cadastrado ainda." />
        ) : (
          <ul className={styles.list}>
            {providers.map((provider) => (
              <ScopeProviderRow
                key={provider.id}
                provider={provider}
                onSave={(patch) => handleUpdateProvider(provider.id, patch)}
                onRemove={() => handleRemoveProvider(provider.id)}
              />
            ))}
          </ul>
        )}
        <form className={styles.form} onSubmit={handleCreateProvider}>
          <div className={styles.row}>
            <Field label="Prestador" htmlFor="new-provider-name">
              <input
                className={fieldStyles.input}
                id="new-provider-name"
                value={providerDraft.providerName}
                onChange={(event) =>
                  setProviderDraft((current) => ({
                    ...current,
                    providerName: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Servico" htmlFor="new-provider-service">
              <input
                className={fieldStyles.input}
                id="new-provider-service"
                value={providerDraft.service ?? ''}
                onChange={(event) =>
                  setProviderDraft((current) => ({
                    ...current,
                    service: event.target.value || null,
                  }))
                }
              />
            </Field>
            <Field label="Classificacao de escopo" htmlFor="new-provider-classification">
              <select
                className={fieldStyles.select}
                id="new-provider-classification"
                value={providerDraft.classification ?? ''}
                onChange={(event) =>
                  setProviderDraft((current) => ({
                    ...current,
                    classification:
                      (event.target.value as ScopeProviderInput['classification']) ||
                      null,
                  }))
                }
              >
                <option value="">Nao classificado</option>
                {SCOPE_CLASSIFICATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button className={styles.submit} type="submit">
            Adicionar prestador
          </button>
          {providerError ? <p role="alert">{providerError}</p> : null}
        </form>
      </section>

      <h2 className={styles.sectionTitle}>Aprovacao</h2>
      <section className={pageStyles.card} aria-labelledby="approval-title">
        <div className={pageStyles.cardHeader}>
          <h2 className={pageStyles.cardTitle} id="approval-title">
            Aprovacao
          </h2>
          <AutosaveIndicator status={approvalAutosave.status} />
        </div>
        <div className={styles.row}>
          <Field label="Metodo" htmlFor="approval-method">
            <input
              className={fieldStyles.input}
              id="approval-method"
              defaultValue={initialApproval?.method ?? ''}
              onChange={(event) =>
                approvalAutosave.schedule({ method: event.target.value || null })
              }
            />
          </Field>
          <Field label="Plataforma" htmlFor="approval-platform">
            <input
              className={fieldStyles.input}
              id="approval-platform"
              defaultValue={initialApproval?.platform ?? ''}
              onChange={(event) =>
                approvalAutosave.schedule({ platform: event.target.value || null })
              }
            />
          </Field>
          <Field label="Responsavel" htmlFor="approval-responsible">
            <input
              className={fieldStyles.input}
              id="approval-responsible"
              defaultValue={initialApproval?.responsible ?? ''}
              onChange={(event) =>
                approvalAutosave.schedule({
                  responsible: event.target.value || null,
                })
              }
            />
          </Field>
          <Field label="Data" htmlFor="approval-date">
            <input
              className={fieldStyles.input}
              id="approval-date"
              type="date"
              defaultValue={initialApproval?.approvedAt ?? ''}
              onChange={(event) =>
                approvalAutosave.schedule({
                  approvedAt: event.target.value || null,
                })
              }
            />
          </Field>
        </div>
        <Field label="Texto de aprovacao" htmlFor="approval-text">
          <textarea
            className={fieldStyles.textarea}
            id="approval-text"
            defaultValue={initialApproval?.approvalText ?? ''}
            onChange={(event) =>
              approvalAutosave.schedule({
                approvalText: event.target.value || null,
              })
            }
          />
        </Field>
        <Field label="Observacoes" htmlFor="approval-observations">
          <textarea
            className={fieldStyles.textarea}
            id="approval-observations"
            defaultValue={initialApproval?.observations ?? ''}
            onChange={(event) =>
              approvalAutosave.schedule({
                observations: event.target.value || null,
              })
            }
          />
        </Field>
      </section>

      <h2 className={styles.sectionTitle}>Revisoes</h2>
      <section className={pageStyles.card} aria-labelledby="revisions-title">
        <h2 className={pageStyles.cardTitle} id="revisions-title">
          Historico de revisoes
        </h2>
        {revisions.length === 0 ? (
          <EmptyState message="Nenhuma revisao registrada ainda." />
        ) : (
          <ul className={styles.list}>
            {revisions.map((revision) => (
              <li key={revision.id} className={pageStyles.readonlyField}>
                <p className={pageStyles.readonlyLabel}>
                  v{revision.version} — {revision.revisedAt} — {revision.responsible}
                </p>
                <p className={pageStyles.readonlyValue}>{revision.changeDescription}</p>
              </li>
            ))}
          </ul>
        )}
        <form className={styles.form} onSubmit={handleCreateRevision}>
          <div className={styles.row}>
            <Field label="Versao" htmlFor="new-revision-version">
              <input
                className={fieldStyles.input}
                id="new-revision-version"
                value={revisionDraft.version}
                onChange={(event) =>
                  setRevisionDraft((current) => ({
                    ...current,
                    version: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Data" htmlFor="new-revision-date">
              <input
                className={fieldStyles.input}
                id="new-revision-date"
                type="date"
                value={revisionDraft.revisedAt}
                onChange={(event) =>
                  setRevisionDraft((current) => ({
                    ...current,
                    revisedAt: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Responsavel" htmlFor="new-revision-responsible">
              <input
                className={fieldStyles.input}
                id="new-revision-responsible"
                value={revisionDraft.responsible}
                onChange={(event) =>
                  setRevisionDraft((current) => ({
                    ...current,
                    responsible: event.target.value,
                  }))
                }
              />
            </Field>
          </div>
          <Field label="Descricao da alteracao" htmlFor="new-revision-description">
            <textarea
              className={fieldStyles.textarea}
              id="new-revision-description"
              value={revisionDraft.changeDescription}
              onChange={(event) =>
                setRevisionDraft((current) => ({
                  ...current,
                  changeDescription: event.target.value,
                }))
              }
            />
          </Field>
          <button className={styles.submit} type="submit">
            Adicionar revisao
          </button>
          {revisionError ? <p role="alert">{revisionError}</p> : null}
        </form>
      </section>
    </div>
  );
}
