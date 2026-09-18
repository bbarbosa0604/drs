/** Tipos de no de Topologia previstos inicialmente (PRD secao 13.1). */
export enum TopologyNodeType {
  APPLICATION = 'APPLICATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  FIREWALL = 'FIREWALL',
  CLOUD = 'CLOUD',
  SERVER = 'SERVER',
  USER = 'USER',
  INTERNET = 'INTERNET',
  THIRD_PARTY = 'THIRD_PARTY',
  PHYSICAL_UNIT = 'PHYSICAL_UNIT',
  OTHER = 'OTHER',
}
