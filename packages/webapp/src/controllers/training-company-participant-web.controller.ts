// Uncomment these imports to begin using these cool features!

import '../convector';
import {ConvectorControllerClient} from '@worldsibu/convector-core';
import {get, param, post} from '@loopback/rest';
import {inject} from '@loopback/context';

import {
  TrainingCompanyParticipant,
  TrainingCompanyParticipantController,
} from 'participant-cc';

export class TrainingCompanyParticipantWebController {
  constructor(
    @inject('TrainingCompanyParticipantControllerBackEnd')
    private trainingCompanyParticipantFabricController: ConvectorControllerClient<
      TrainingCompanyParticipantController
    >,
  ) {}

  @post('/trainingCompany/create', {
    description: 'Creates a new training company',
    responses: {},
  })
  public async register(
    @param.query.string('id')
    participantId: string,
    @param.query.string('name')
    participantName: string,
  ) {
    await this.trainingCompanyParticipantFabricController.register(
      participantId,
      participantName,
    );
  }

  @post('/trainingCompany/changeIdentity', {
    description: 'Change the identity of a registered training company',
    responses: {},
  })
  public async changeIdentity(
    @param.query.string('id')
    id: string,
    @param.query.string('identity')
    newIdentity: string,
  ) {
    await this.trainingCompanyParticipantFabricController.changeIdentity(
      id,
      newIdentity,
    );
  }

  @get('/trainingCompany', {
    description: 'Returns a training company participant by id',
    responses: {
      '200': {
        description: 'a training company',
        content: {
          'application/json': {'x-ts-type': TrainingCompanyParticipant},
        },
      },
    },
  })
  public async getParticipantById(
    @param.query.string('id') id: string,
  ): Promise<TrainingCompanyParticipant> {
    return await this.trainingCompanyParticipantFabricController.getParticipantById(
      id,
    );
  }
}
