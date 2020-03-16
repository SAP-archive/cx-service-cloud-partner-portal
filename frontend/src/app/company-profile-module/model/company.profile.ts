import { CompanyDetails, exampleCompanyDetails } from './company-profile.model';
import { Document, exampleDocument } from './document.model';

export interface CompanyProfile {
  companyDetails: CompanyDetails;
  documents: Document[];
}

export const exampleCompanyProfile = (): CompanyProfile => ({
  companyDetails: exampleCompanyDetails(),
  documents: [exampleDocument()],
});
