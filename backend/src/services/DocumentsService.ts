import { UserData } from '@modules/common/types';
import { DocumentsDao } from '@modules/data-access/daos/DocumentsDao';
import { NewDocument } from '../models/NewDocument';
import * as request from 'request-promise-native';

export class DocumentsService {
  public static download(userData: UserData, id: string): request.RequestPromise {
    return DocumentsDao.downloadDocument(userData, id);
  }

  public static addDocuments(userData: UserData, partnerId: string, newDocuments: NewDocument[]): Promise<unknown> {
    return Promise.all(newDocuments.map(newDocument => DocumentsDao.addDocument(userData, partnerId, newDocument)));
  }

  public static removeDocuments(userData: UserData, documentIds: string[]): Promise<unknown> {
    return Promise.all(documentIds.map(documentId => DocumentsDao.removeDocument(userData, documentId)));
  }
}
