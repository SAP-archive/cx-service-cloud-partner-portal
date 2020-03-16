import * as express from 'express';
import { TechnicianService } from '../services/TechnicianService';
import { ApiHelper, StatusCode } from './APIHelper';
import { UserDataRequest } from './middleware/sessiondata';
import { validateBody } from '@modules/common/utils';
import { TechnicianDto, Skill } from '@modules/data-access/models';
import { NewSkillCertificate } from '@modules/data-access/models/SkillCertificate';

export interface UpdateTechnicianRequest extends express.Request {
  body: {
    profile: TechnicianDto;
    skills: {
      add: Skill[];
      remove: Skill[];
    },
    certificates: {
      add: NewSkillCertificate[],
      remove: Skill[],
    };
  };
}

export class TechnicianController {
  public static readAll(req: express.Request & UserDataRequest, res: express.Response) {
    TechnicianService.readAll(req.userData)
      .then(result => res.json(result))
      .catch(() => ApiHelper.processError(res));
  }

  public static remove(req: express.Request & UserDataRequest, res: express.Response) {
    TechnicianService.remove(req.userData, req.params.technicianId)
      .then(() => res.sendStatus(200))
      .catch(() => ApiHelper.processError(res));
  }

  @validateBody({
    schema: {
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          additionalProperties: false,
          required: [
            'firstName',
            'lastName',
            'mobilePhone',
            'email',
            'address',
          ],
          properties: {
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            mobilePhone: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            address: {
              type: 'object',
              properties: {
                city: {
                  type: 'string',
                },
                zipCode: {
                  type: 'string',
                },
                country: {
                  type: 'string',
                },
                streetName: {
                  type: 'string',
                },
                number: {
                  type: 'string',
                },
              },
              required: [
                'city',
                'zipCode',
                'country',
                'streetName',
                'number',
              ]
            },
          },
        },
        skills: {
          type: 'array',
          items: {
            $ref: '#/definitions/skill',
          },
        },
        certificates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fileName: {
                type: 'string',
              },
              fileContents: {
                type: 'string',
              },
              tagExternalId: {
                type: 'string',
              },
              contentType: {
                type: 'string',
              },
              viewModelId: {
                type: ['string', 'null']
              },
            },
          },
        },
      },
      required: [
        'profile',
        'skills',
        'certificates',
      ],
      additionalProperties: false,
      definitions: {
        skill: {
          type: 'object',
          properties: {
            uuid: {
              type: ['string', 'null'],
            },
            externalId: {
              type: ['string', 'null'],
            },
            technicianExternalId: {
              type: ['string', 'null'],
            },
            tagName: {
              type: ['string', 'null'],
            },
            tagExternalId: {
              type: 'string',
            },
            approvalDecision: {
              type: ['object', 'null'],
            },
            expiredAt: {
              type: ['string', 'null'],
            },
            startedAt: {
              type: ['string', 'null'],
            },
            certificate: {
              type: ['object', 'null'],
            },
            viewModelId: {
              type: ['string', 'null']
            },
          },
        },
      },
    },
  })
  public static create(req: express.Request & UserDataRequest, res: express.Response) {
    TechnicianService.create(req.userData, req.body)
      .then((profile) => {
        res.json(profile);
      })
      .catch(reason => ApiHelper.processError(res));
  }

  @validateBody({
    schema: {
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          additionalProperties: false,
          required: [
            'externalId',
            'firstName',
            'lastName',
            'mobilePhone',
            'email',
            'address',
          ],
          properties: {
            externalId: {
              type: 'string',
            },
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            mobilePhone: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            address: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                city: {
                  type: 'string',
                },
                zipCode: {
                  type: 'string',
                },
                country: {
                  type: 'string',
                },
                streetName: {
                  type: 'string',
                },
                number: {
                  type: 'string',
                },
              },
              additionalProperties: false,
              required: [
                'city',
                'zipCode',
                'country',
                'streetName',
                'number',
              ]
            },
          },
        },
        skills: {
          type: 'object',
          required: ['add', 'remove'],
          properties: {
            add: {
              type: 'array',
              items: {
                $ref: '#/definitions/skill',
              },
            },
            remove: {
              type: 'array',
              items: {
                $ref: '#/definitions/skill',
              },
            },
          },
        },
        certificates: {
          type: 'object',
          properties: {
            add: {
              type: 'array',
              items: {
                $ref: '#/definitions/certificate',
              },
            },
            remove: {
              type: 'array',
              items: {
                type: '#/definitions/skill'
              },
            },
          },
          required: ['add', 'remove'],
          additionalProperties: false,
        },
      },
      required: [
        'profile',
        'skills',
        'certificates',
      ],
      additionalProperties: false,
      definitions: {
        skill: {
          type: 'object',
          properties: {
            viewModelId: {
              type: ['string', 'null']
            },
            uuid: {
              type: ['string', 'null'],
            },
            externalId: {
              type: ['string', 'null'],
            },
            technicianExternalId: {
              type: ['string', 'null'],
            },
            tagName: {
              type: ['string', 'null'],
            },
            tagExternalId: {
              type: 'string',
            },
            approvalDecision: {
              type: ['object', 'null'],
            },
            expiredAt: {
              type: ['string', 'null'],
            },
            startedAt: {
              type: ['string', 'null'],
            },
            certificate: {
              type: ['object', 'null'],
            },
          },
        },
        certificate: {
          type: 'object',
          properties: {
            viewModelId: {
              type: ['string', 'null']
            },
            skillId: {
              type: ['string', 'null']
            },
            fileName: {
              type: 'string',
            },
            fileContents: {
              type: 'string',
            },
            contentType: {
              type: 'string',
            },
          },
          additionalProperties: false,
          required: [
            'viewModelId',
            'fileName',
            'fileContents',
            'contentType',
          ],
        },
      },
    },
  })
  public static update(req: UpdateTechnicianRequest & UserDataRequest, res: express.Response) {
    const { technicianId } = req.params;

    if (!technicianId) {
      ApiHelper.processError(res, {
        code: StatusCode.BAD_REQUEST,
        message: 'BAD_REQUEST',
      });
    }

    TechnicianService.update(req.userData, technicianId, req.body)
      .then(([, profile, address]) => {
        res.json({
          ...profile,
          address,
        } as TechnicianDto);
      })
      .catch(() => ApiHelper.processError(res));
  }

  @validateBody({
    schema: {
      type: 'object',
      properties: {
        tagExternalId: {
          type: 'string',
        },
      },
      required: [
        'tagExternalId',
      ],
      additionalProperties: false,
    },
  })
  public static assignSkill(req: express.Request & UserDataRequest, res: express.Response) {
    const { technicianId } = req.params;

    if (!technicianId) {
      ApiHelper.processError(res, {
        code: StatusCode.BAD_REQUEST,
        message: 'BAD_REQUEST',
      });
    }

    const { tagExternalId } = req.body;

    TechnicianService.assignSkill(req.userData, technicianId, tagExternalId)
      .then(skill => res.json(skill))
      .catch(reason => ApiHelper.processError(res));
  }

  public static readSkills(req: express.Request & UserDataRequest, res: express.Response) {
    const { technicianId } = req.params;

    if (!technicianId) {
      ApiHelper.processError(res, {
        code: StatusCode.BAD_REQUEST,
        message: 'BAD_REQUEST',
      });
    }

    const { tagExternalId } = req.body;

    TechnicianService.readSkills(req.userData, technicianId, tagExternalId)
      .then(skills => res.json(skills))
      .catch(reason => ApiHelper.processError(res));
  }

  public static removeSkill(req: express.Request & UserDataRequest, res: express.Response) {
    const { technicianId, skillId } = req.params;

    if (!technicianId || !skillId) {
      ApiHelper.processError(res, {
        code: StatusCode.BAD_REQUEST,
        message: 'BAD_REQUEST',
      });
    }

    TechnicianService.removeSkill(req.userData, technicianId, skillId)
      .then(result => res.send())
      .catch(reason => ApiHelper.processError(res));
  }

  public static read(req: express.Request & UserDataRequest, res: express.Response) {
    const { technicianId } = req.params;

    if (!technicianId) {
      ApiHelper.processError(res, {
        code: StatusCode.BAD_REQUEST,
        message: 'BAD_REQUEST',
      });
    }

    TechnicianService.read(req.userData, technicianId)
      .then(result => res.json(result))
      .catch(reason => ApiHelper.processError(res));
  }
}
