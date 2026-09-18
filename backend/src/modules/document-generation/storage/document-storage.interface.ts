/**
 * Interface minima compativel com um object storage S3 (put/get objeto por
 * chave) - PRD secao 24/44: o dominio nao deve depender de um provedor
 * especifico. `LocalFilesystemStorageAdapter` e a implementacao de
 * desenvolvimento (aprovada pelo Bruno, Task 025/026: sem provedor real
 * nem credenciais de producao neste ambiente); trocar por S3/MinIO real
 * depois e so uma nova implementacao desta interface, sem tocar no
 * `DocumentGenerationService`.
 */
export interface DocumentStorageAdapter {
  putObject(key: string, buffer: Buffer, contentType: string): Promise<void>;
  getObject(key: string): Promise<Buffer>;
}

export const DOCUMENT_STORAGE_ADAPTER = Symbol('DOCUMENT_STORAGE_ADAPTER');
