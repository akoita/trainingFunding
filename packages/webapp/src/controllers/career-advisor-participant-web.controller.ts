import '../convector';
import {ConvectorControllerClient} from '@worldsibu/convector-core';
import {get, param, post} from '@loopback/rest';
import {inject} from '@loopback/context';

import {Candidate} from 'candidate-cc';
import {
  CareerAdvisorParticipant,
  CareerAdvisorParticipantController,
} from 'participant-cc';

export class CareerAdvisorParticipantWebController {
  constructor(
    @inject('CareerAdvisorParticipantControllerBackEnd')
    private careerAdvisorParticipantFabricController: ConvectorControllerClient<
      CareerAdvisorParticipantController
    >,
  ) {}

  @post('/careerAdvisor/create', {
    description: 'Creates a new career advisor',
    responses: {},
  })
  public async register(
    @param.query.string('id')
    participantId: string,
    @param.query.string('name')
    participantName: string,
  ) {
    await this.careerAdvisorParticipantFabricController.register(
      participantId,
      participantName,
    );
  }

  @post('/careerAdvisor/changeIdentity', {
    description: 'Change the identity of a registered career advisor',
    responses: {},
  })
  public async changeIdentity(
    @param.query.string('id')
    id: string,
    @param.query.string('identity')
    newIdentity: string,
  ) {
    await this.careerAdvisorParticipantFabricController.changeIdentity(
      id,
      newIdentity,
    );
  }

  @get('/careerAdvisor', {
    description: 'Returns a career advisor participant by id',
    responses: {
      '200': {
        description: 'a career advisor',
        content: {'application/json': {'x-ts-type': Candidate}},
      },
    },
  })
  public async getParticipantById(
    @param.query.string('id') id: string,
  ): Promise<CareerAdvisorParticipant> {
    return await this.careerAdvisorParticipantFabricController.getParticipantById(
      id,
    );
  }
}
