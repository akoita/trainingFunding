// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {TrainingControllerBackEnd} from '../convector';
import {get, param, post, requestBody} from '@loopback/rest';

import {Training, TrainingProcessStatus} from 'training-cc';

export class TrainingWebControllerController {
  constructor() {}

  @post('/training/create', {
    description: 'Create a new training',
    responses: {},
  })
  public async createTraining(@requestBody() training: Training) {
    await TrainingControllerBackEnd.createTraining(training);
  }

  @get('/training', {
    description: 'Get a training by id',
    responses: {
      '200': {
        description: 'Training found by id',
        content: {'application/json': {'x-ts-type': Training}},
      },
    },
  })
  public async getTrainingById(
    @param.query.string('id') trainingId: string,
  ): Promise<Training> {
    return await TrainingControllerBackEnd.getTrainingById(trainingId);
  }

  @post('training/close', {
    description: 'Close a training',
    responses: {},
  })
  public async closeTraining(@param.query.string('id') trainingId: string) {
    await TrainingControllerBackEnd.closeTraining(trainingId);
  }

  @post('training/submitApplication', {
    description: 'Submit an application to a training',
    responses: {},
  })
  public async submitTrainingApplication(
    @param.query.string('id') trainingId: string,
  ) {
    await TrainingControllerBackEnd.submitTrainingApplication(trainingId);
  }

  @post('training/acceptApplication', {
    description: 'Accept an application to a training',
    responses: {},
  })
  public async acceptApplication(@param.query.string('id') trainingId: string) {
    await TrainingControllerBackEnd.acceptApplication(trainingId);
  }

  @post('training/fund', {
    description: 'Fund a training accepted',
    responses: {},
  })
  public async fundTraining(@param.query.string('id') trainingId: string) {
    await TrainingControllerBackEnd.fundTraining(trainingId);
  }

  @post('training/start', {
    description: 'Start a training funded',
    responses: {},
  })
  public async startTraining(@param.query.string('id') trainingId: string) {
    await TrainingControllerBackEnd.startTraining(trainingId);
  }

  @post('training/certifyTraining', {
    description: 'Certify a training started',
    responses: {},
  })
  public async certifyTraining(@param.query.string('id') trainingId: string) {
    await TrainingControllerBackEnd.certifyTraining(trainingId);
  }

  @post('training/failTraining', {
    description: 'Fail a training started',
    responses: {},
  })
  public async failTraining(@param.query.string('id') trainingId: string) {
    await TrainingControllerBackEnd.failTraining(trainingId);
  }

  @get('trainings/byCandidates', {
    description: 'Returns the list of the trainings of the candidates passed',
    responses: {
      200: {
        description: 'the list of the trainings of the candidates passed',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {'x-ts-type': Training},
            },
          },
        },
      },
    },
  })
  public async getTrainingsByCandidatesIds(
    @param.array('ids', 'query', {type: 'string'}) candidatesIds: string[],
  ): Promise<Training[]> {
    return await TrainingControllerBackEnd.getTrainingsByCandidatesIds(
      candidatesIds,
    );
  }

  @get('trainings/byProcessStatus', {
    description:
      'Returns the list of the trainings following the given process status',
    responses: {
      200: {
        description:
          'the list of the trainings following the given process status',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {'x-ts-type': Training},
            },
          },
        },
      },
    },
  })
  public async getTrainingsByProcessStatus(
    @param.array('status', 'query', {type: 'string'})
    trainingProcessStatus: TrainingProcessStatus[],
  ): Promise<Training[]> {
    return await TrainingControllerBackEnd.getTrainingsByProcessStatus(
      trainingProcessStatus,
    );
  }
}
