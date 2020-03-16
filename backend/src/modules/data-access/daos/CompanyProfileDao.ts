import { UserData } from '@modules/common/types';
import { CrowdServiceApi } from '@modules/data-access/services/CrowdServiceApi';
import { CompanyDetails } from '../../../models/CompanyDetails';
import { omit } from '../../../utils/omit';
import { CompanyDetailsDto } from '../dtos/CompanyDetailsDto';

export class CompanyProfileDao {
  public static async save(userData: UserData, partnerId: string, companyDetails: CompanyDetails): Promise<CompanyDetails> | undefined {
    const body = CompanyProfileDao.modelToDto(companyDetails);

    return CrowdServiceApi.put<CompanyDetailsDto>(userData, `crowd-partner/v1/partners/${partnerId}`, body)
      .then((response) =>
        response.results.length > 0 ? CompanyProfileDao.dtoToModel(response.results[0]) : null,
      );
  }

  private static modelToDto(details: CompanyDetails): CompanyDetailsDto {
    return {
      ...omit(details, 'contact'),
      contacts: [details.contact],
    } as CompanyDetailsDto;
  }

  private static dtoToModel(detailsDto: CompanyDetailsDto): CompanyDetails {
    return {
      ...omit(detailsDto, 'contacts'),
      contact: detailsDto.contacts[0],
      serviceArea: omit(detailsDto.serviceArea, 'id'),
    } as CompanyDetails;
  }
}
