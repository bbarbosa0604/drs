import { Document, HeadingLevel, Packer, Paragraph } from 'docx';

import { type DocumentContext } from './document-context';

/** Documento 2/3 do MVP (PRD secao 17): Proposta de Aprovacao. */
export async function renderApprovalProposalDocx(
  context: DocumentContext,
): Promise<Buffer> {
  const { scopeDefinition, approval } = context;

  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Proposta de Aprovacao do Escopo do SGSI',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ text: context.organizationName }),
          new Paragraph({ text: `Projeto: ${context.projectName}` }),
          new Paragraph({
            text: `Versao: ${context.versionNumber} (${context.versionStatus === 'APPROVED' ? 'Aprovada' : 'Rascunho'})`,
          }),
          new Paragraph({
            text: 'Escopo proposto',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: scopeDefinition.formalDeclaration ?? '' }),
          new Paragraph({
            text: 'Registro de aprovacao',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: `Metodo: ${approval?.method ?? 'A definir'}` }),
          new Paragraph({
            text: `Plataforma: ${approval?.platform ?? 'A definir'}`,
          }),
          new Paragraph({
            text: `Responsavel: ${approval?.responsible ?? 'A definir'}`,
          }),
          new Paragraph({
            text: `Data: ${approval?.approvedAt ?? 'A definir'}`,
          }),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(document));
}
