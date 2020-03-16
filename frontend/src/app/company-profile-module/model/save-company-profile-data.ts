import { CompanyDetails, exampleCompanyDetails } from './company-profile.model';
import { exampleNewDocument, NewDocument } from './new-document.model';
import { RecursivePartial } from '../../utils/recursive-partial';

export interface SaveCompanyProfileData {
  companyDetails: RecursivePartial<CompanyDetails>;
  newDocuments: NewDocument[];
  removedDocumentsIds: string[];
}

export const exampleSaveCompanyProfileData = (): SaveCompanyProfileData => ({
  companyDetails: exampleCompanyDetails(),
  newDocuments: [exampleNewDocument()],
  removedDocumentsIds: ['1'],
});
