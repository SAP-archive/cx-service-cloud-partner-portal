import { CompanyDetails, exampleCompanyDetails } from './CompanyDetails';
import { Document, exampleDocument } from './Document';

export interface CompanyProfile {
  companyDetails: CompanyDetails;
  documents: Document[];
}

export const exampleCompanyProfile = (): CompanyProfile => ({
  companyDetails: exampleCompanyDetails(),
  documents: [exampleDocument()],
});
