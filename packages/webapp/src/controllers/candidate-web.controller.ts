// Uncomment these imports to begin using these cool features!

import '../convector';
import {ConvectorControllerClient} from '@worldsibu/convector-core';
import {get, param, post, requestBody} from '@loopback/rest';
import {Candidate, CandidateController} from 'candidate-cc';
import {inject} from '@loopback/context';

export class CandidateWebController {
  constructor(
    @inject('CandidateControllerBackEnd')
    private candidateFabricController: ConvectorControllerClient<
      CandidateController
    >,
  ) {}

  @post('/candidate/create', {
    description: 'Creates a new candidate',
    responses: {},
  })
  async createCandidate(@requestBody() candidate: Candidate) {
    await this.candidateFabricController.createCandidate(candidate);
  }

  @get('/candidate', {
    description: 'Returns a Candidate by id',
    responses: {
      '200': {
        description: 'a Candidate',
        content: {'application/json': {'x-ts-type': Candidate}},
      },
    },
  })
  async getCandidate(
    @param.query.string('id') candidateId: string,
  ): Promise<Candidate> {
    return await this.candidateFabricController.getCandidateById(candidateId);
  }

  @get('/candidates', {
    description: 'Returns the list of all the Candidates',
    responses: {
      '200': {
        description: 'list of all Candidates',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {'x-ts-type': Candidate},
            },
          },
        },
      },
    },
  })
  async allCandidates(): Promise<Candidate[]> {
    return await this.candidateFabricController.listCandidates();
  }

  @get('/candidates/search', {
    description:
      'Returns the list of the candidates whose names match the search term',
    responses: {
      '200': {
        description: 'list of Candidate',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {'x-ts-type': Candidate},
            },
          },
        },
      },
    },
  })
  async searchCandidates(
    @param.query.string('search') searchTerm: string,
  ): Promise<Candidate[]> {
    return await this.candidateFabricController.searchCandidate(searchTerm);
  }

  @post('/candidate/disable', {
    description: 'Disable the candidate corresponding to the id',
    responses: {},
  })
  async disableCandidate(@param.query.string('id') candidateId: string) {
    await this.candidateFabricController.disableCandidate(candidateId);
  }
}
