import { Document, exampleDocument } from './document.model';
import { ApprovalDecision } from '../../model/approval-decision';

export interface NewDocument {
  id: string | null;
  name: string | null;
  approvalDecision: ApprovalDecision;
  fileContent: string;
  contentType: string;
  description: string;
}

export const exampleNewDocument = (id: string = '123'): NewDocument => ({
  ...exampleDocument(id),
  fileContent: 'some content',
  contentType: 'image/png',
});

export const isNewDocument = (document: Document | NewDocument): document is NewDocument =>
  (document as NewDocument).fileContent !== undefined;
