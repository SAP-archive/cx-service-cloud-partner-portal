import { exampleDocument } from './Document';
import { ApprovalDecision, approvalDecisionSchema, emptyApprovalDecision } from './ApprovalDecision';
import { SchemaWithReferences } from '../types/SchemaWithReferences';

export interface NewDocument {
  id: string | null;
  name: string | null;
  approvalDecision: ApprovalDecision;
  fileContent: string;
  contentType: string;
}

export const exampleNewDocument = (id: string = '123'): NewDocument => ({
  id,
  name: 'filename.jpg',
  approvalDecision: emptyApprovalDecision(),
  fileContent: 'some content',
  contentType: 'image/png',
});

export const newDocumentSchema: SchemaWithReferences = {
  schema: {
    id: '/NewDocument',
    type: 'object',
    additionalProperties: false,
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      approvalDecision: {$ref: '/ApprovalDecision'},
      fileContent: {type: 'string'},
      contentType: {type: 'string'},
      description: {type: 'string'},
    },
    required: ['id', 'name', 'approvalDecision', 'fileContent', 'contentType'],
  },
  referencedSchemas: [approvalDecisionSchema]
};
