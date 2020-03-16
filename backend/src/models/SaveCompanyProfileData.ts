import { CompanyDetails, exampleCompanyDetails } from './CompanyDetails';
import { exampleNewDocument, NewDocument } from './NewDocument';

export interface SaveCompanyProfileData {
  companyDetails: CompanyDetails;
  newDocuments: NewDocument[];
  removedDocumentsIds: string[];
}

export const exampleSaveCompanyProfileData = (): SaveCompanyProfileData => ({
  companyDetails: exampleCompanyDetails(),
  newDocuments: [exampleNewDocument()],
  removedDocumentsIds: ['1'],
});
