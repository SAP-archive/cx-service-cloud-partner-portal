import { UserData } from '@modules/common/types';
import { CrowdServiceApi } from '@modules/data-access/services/CrowdServiceApi';
import { Document } from '../../../models/Document';
import { DocumentDto } from '@modules/data-access/dtos/DocumentDto';
import { omit } from '../../../utils/omit';
import { NewDocument } from '../../../models/NewDocument';
import { HttpClientService } from '@modules/data-access';
import * as request from 'request-promise-native';

export class DocumentsDao {
  public static async fetchMyDocuments(userData: UserData): Promise<Document[]> {
    return CrowdServiceApi.get<DocumentDto>(userData, `crowd/v1/documents`)
      .then((response) =>
        response.results.map(document => omit(document, 'objectType', 'description') as Document),
      );
  }

  public static downloadDocument(userData: UserData, id: string): request.RequestPromise {
    return CrowdServiceApi.stream(userData, `/crowd/v1/documents/${id}/attachments`);
  }

  public static async addDocument(userData: UserData, partnerId: string, newDocument: NewDocument): Promise<string[]> {
    const formData = {
      documentDto: {
        value: JSON.stringify({
          ...omit(newDocument, 'fileContent', 'approvalDecision'),
          id: null,
          attachmentId: null,
          state: 'NEW',
          objectType: {
            objectId: partnerId,
            objectType: 'BUSINESSPARTNER',
          },
        }),
        options: {
          filename: 'request.json',
          contentType: 'application/json',
        },
      },
      file: {
        value: Buffer.from(newDocument.fileContent, 'base64'),
        options: {
          filename: newDocument.name,
          contentType: newDocument.contentType,
        },
      },
    };

    return HttpClientService.send<string[]>({
      method: 'POST',
      path: `/cloud-crowd-service/api/crowd/v1/documents`,
      data: formData,
      useFormData: true,
      userData,
    });
  }

  public static removeDocument(userData: UserData, documentId: string): Promise<unknown> {
    return CrowdServiceApi.delete(userData, `crowd/v1/documents/${documentId}`);
  }
}
