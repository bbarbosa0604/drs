import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, normalize, sep } from 'node:path';

import { type DocumentStorageAdapter } from './document-storage.interface';

const STORAGE_ROOT = join(process.cwd(), 'storage', 'generated-documents');

/**
 * Adapter de desenvolvimento (Task 026, aprovado pelo Bruno): salva em disco
 * local atras da mesma interface que um adapter S3 real usaria. Nunca
 * marca sucesso sem o arquivo estar de fato gravado (PRD - Task 026, casos
 * de erro: falha no storage nunca deve virar "sucesso" falso).
 */
@Injectable()
export class LocalFilesystemStorageAdapter implements DocumentStorageAdapter {
  async putObject(key: string, buffer: Buffer): Promise<void> {
    const path = this.resolveKeyPath(key);

    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, buffer);
  }

  async getObject(key: string): Promise<Buffer> {
    const path = this.resolveKeyPath(key);

    try {
      return await readFile(path);
    } catch {
      throw new InternalServerErrorException(
        'Generated document is missing from storage.',
      );
    }
  }

  private resolveKeyPath(key: string): string {
    const path = normalize(join(STORAGE_ROOT, key));

    if (!path.startsWith(STORAGE_ROOT + sep) && path !== STORAGE_ROOT) {
      throw new InternalServerErrorException('Invalid storage key.');
    }

    return path;
  }
}
