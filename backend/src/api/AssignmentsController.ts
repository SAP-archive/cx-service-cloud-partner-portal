import * as express from 'express';
import { AssignmentsDao } from '@modules/data-access/daos/AssignmentsDao';
import { UserDataRequest } from './middleware/sessiondata';
import { ApiHelper } from './APIHelper';
import { Assignment } from '../models/Assignment';

export class AssignmentsController {
  public static async fetchAssignments(req: express.Request & UserDataRequest, res: express.Response) {
    try {
      const response = await AssignmentsDao.getByPage(
        req.userData,
        parseInt(req.query.page, 10),
        parseInt(req.query.size, 10),
        JSON.parse(req.query.filter),
      );
      res.json(response);
    } catch (error) {
      ApiHelper.processError(res, AssignmentsDao.getError(error));
    } finally {
      res.end();
    }
  }

  public static async fetchAssignmentsStats(req: express.Request & UserDataRequest, res: express.Response) {
    try {
      const response = await AssignmentsDao.getStats(req.userData);
      res.json(response);
    } catch (error) {
      ApiHelper.processError(res, AssignmentsDao.getError(error));
    } finally {
      res.end();
    }
  }

  public static async rejectAssignment(req: express.Request & UserDataRequest, res: express.Response) {
    try {
      const response = await AssignmentsDao.dispatch(
        req.userData,
        req.body,
        'reject',
      );
      res.json(response);
    } catch (error) {
      ApiHelper.processError(res, AssignmentsDao.getError(error));
    } finally {
      res.end();
    }
  }

  public static async acceptAssignment(req: express.Request & UserDataRequest, res: express.Response) {
    try {
      const response = await AssignmentsDao.dispatch(
        req.userData,
        req.body,
        'accept',
      );
      res.json(response);
    } catch (error) {
      ApiHelper.processError(res, AssignmentsDao.getError(error));
    } finally {
      res.end();
    }
  }

  public static async closeAssignment(req: express.Request & UserDataRequest, res: express.Response) {
    try {
      const response = await AssignmentsDao.close(
        req.userData,
        req.body,
      );
      res.json(response);
    } catch (error) {
      ApiHelper.processError(res, AssignmentsDao.getError(error));
    } finally {
      res.end();
    }
  }

  public static async releaseAssignment(req: express.Request & UserDataRequest, res: express.Response) {
    try {
      const updatedAssignment = await AssignmentsDao.dispatch(
        req.userData,
        req.body,
        'release',
      );
      res.json({...updatedAssignment, serviceAssignmentState: 'RELEASED'} as Assignment);
    } catch (error) {
      ApiHelper.processError(res, AssignmentsDao.getError(error));
    } finally {
      res.end();
    }
  }

  public static async handoverAssignment(req: express.Request & UserDataRequest, res: express.Response) {
    try {
      const response = await AssignmentsDao.handover(
        req.userData,
        req.body,
      );
      res.json(response);
    } catch (error) {
      ApiHelper.processError(res, AssignmentsDao.getError(error));
    } finally {
      res.end();
    }
  }

  public static async updateAssignment(req: express.Request & UserDataRequest, res: express.Response) {
    try {
      const response = await AssignmentsDao.update(
        req.userData,
        req.body,
      );
      res.json(response);
    } catch (error) {
      ApiHelper.processError(res, AssignmentsDao.getError(error));
    } finally {
      res.end();
    }
  }
}
