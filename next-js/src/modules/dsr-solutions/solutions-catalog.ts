/**
 * Catalogo das solucoes DSR disponiveis dentro de um projeto (visao de
 * produto do Bruno: o Escopometro e so a primeira de ~10-15 solucoes
 * planejadas). Lista fixa no front-end de proposito - quando uma nova
 * solucao for implementada, adiciona uma entrada aqui; nao inventar nomes
 * de solucoes que ainda nao existem, so o placeholder generico "Mais
 * solucoes em breve".
 */
export interface DsrSolution {
  key: string;
  name: string;
  description: string;
  status: 'available' | 'coming-soon';
  href?: (projectId: string) => string;
}

export const DSR_SOLUTIONS: DsrSolution[] = [
  {
    key: 'sgsi-scope',
    name: 'Escopometro SGSI',
    description:
      'Estrutura e documenta a definicao de escopo de um SGSI (ISO 27001) - Etapas 1 a 8.',
    status: 'available',
    href: (projectId) => `/projects/${projectId}/sgsi-scope`,
  },
  {
    key: 'coming-soon',
    name: 'Mais solucoes em breve',
    description:
      'Novas solucoes DSR serao adicionadas aqui conforme forem implementadas.',
    status: 'coming-soon',
  },
];
