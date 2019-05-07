import '../convector';
import {ConvectorControllerClient} from '@worldsibu/convector-core';
import {get, param, post} from '@loopback/rest';
import {inject} from '@loopback/context';
import {
  InvestorParticipant,
  InvestorParticipantController,
} from 'participant-cc';

export class InvestorParticipantWebController {
  constructor(
    @inject('InvestorParticipantControllerBackEnd')
    private investorParticipantFabricController: ConvectorControllerClient<
      InvestorParticipantController
    >,
  ) {}

  @post('/investor/create', {
    description: 'Creates a new investor',
    responses: {},
  })
  public async register(
    @param.query.string('id')
    participantId: string,
    @param.query.string('name')
    participantName: string,
  ) {
    await this.investorParticipantFabricController.register(
      participantId,
      participantName,
    );
  }

  @post('/investor/changeIdentity', {
    description: 'Change the identity of a registered investor',
    responses: {},
  })
  public async changeIdentity(
    @param.query.string('id')
    id: string,
    @param.query.string('identity')
    newIdentity: string,
  ) {
    await this.investorParticipantFabricController.changeIdentity(
      id,
      newIdentity,
    );
  }

  @get('/careerAdvisor', {
    description: 'Returns an investor participant by id',
    responses: {
      '200': {
        description: 'an investor',
        content: {'application/json': {'x-ts-type': InvestorParticipant}},
      },
    },
  })
  public async getParticipantById(
    @param.query.string('id') id: string,
  ): Promise<InvestorParticipant> {
    return await this.investorParticipantFabricController.getParticipantById(
      id,
    );
  }
}
