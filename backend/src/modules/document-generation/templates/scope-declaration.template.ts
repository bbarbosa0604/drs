import { Document, HeadingLevel, Packer, Paragraph } from 'docx';

import { type DocumentContext } from './document-context';

/** Documento 1/3 do MVP (PRD secao 17): Declaracao de Escopo. */
export async function renderScopeDeclarationDocx(
  context: DocumentContext,
): Promise<Buffer> {
  const { scopeDefinition } = context;

  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Declaracao de Escopo do SGSI',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ text: context.organizationName }),
          new Paragraph({ text: `Projeto: ${context.projectName}` }),
          new Paragraph({
            text: `Versao: ${context.versionNumber} (${context.versionStatus === 'APPROVED' ? 'Aprovada' : 'Rascunho'})`,
          }),
          new Paragraph({
            text: 'Declaracao formal',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: scopeDefinition.formalDeclaration ?? '' }),
          new Paragraph({
            text: 'Fundamentacao executiva',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: scopeDefinition.executiveJustification ?? '',
          }),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(document));
}
