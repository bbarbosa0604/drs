import PptxGenJS from 'pptxgenjs';

import { type DocumentContext } from './document-context';

/** Documento 3/3 do MVP (PRD secao 17): Apresentacao para Aprovacao. */
export async function renderApprovalPresentationPptx(
  context: DocumentContext,
): Promise<Buffer> {
  const pptx = new PptxGenJS();

  const titleSlide = pptx.addSlide();
  titleSlide.addText('Apresentacao para Aprovacao do Escopo do SGSI', {
    x: 0.5,
    y: 1.5,
    w: 9,
    fontSize: 28,
    bold: true,
  });
  titleSlide.addText(
    `${context.organizationName}\nProjeto: ${context.projectName}\nVersao ${context.versionNumber} (${
      context.versionStatus === 'APPROVED' ? 'Aprovada' : 'Rascunho'
    })`,
    { x: 0.5, y: 3, w: 9, fontSize: 16 },
  );

  const scopeSlide = pptx.addSlide();
  scopeSlide.addText('Declaracao de escopo', {
    x: 0.5,
    y: 0.5,
    fontSize: 22,
    bold: true,
  });
  scopeSlide.addText(context.scopeDefinition.formalDeclaration ?? '', {
    x: 0.5,
    y: 1.3,
    w: 9,
    h: 5,
    fontSize: 14,
  });

  const approvalSlide = pptx.addSlide();
  approvalSlide.addText('Aprovacao', {
    x: 0.5,
    y: 0.5,
    fontSize: 22,
    bold: true,
  });
  approvalSlide.addText(
    `Metodo: ${context.approval?.method ?? 'A definir'}\nPlataforma: ${
      context.approval?.platform ?? 'A definir'
    }\nResponsavel: ${context.approval?.responsible ?? 'A definir'}\nData: ${
      context.approval?.approvedAt ?? 'A definir'
    }`,
    { x: 0.5, y: 1.3, w: 9, fontSize: 16 },
  );

  const output = await pptx.write({ outputType: 'nodebuffer' });

  return output as Buffer;
}
