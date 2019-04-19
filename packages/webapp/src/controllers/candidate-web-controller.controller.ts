// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {CandidateControllerBackEnd, InitServerIdentity} from '../convector';

import {get, param, post, requestBody} from '@loopback/rest';
import {Candidate} from "candidate-cc";


InitServerIdentity();

export class CandidateWebControllerController {
    constructor() {
    }


    @post('/candidate', {
        responses: {
            '200': {
                description: 'Create a new Candidate',
                content: {'application/json': {schema: {'x-ts-type': Candidate}}},
            },
        },
    })
    async createCandidate(@requestBody() candidate: Candidate): Promise<Candidate> {
        return await CandidateControllerBackEnd.createCandidate(candidate);

    }

    @get('/candidate/{id}', {
        responses: {
            '200': {
                description: 'Get a Candidate by id',
                content: {'application/json': {'x-ts-type': Candidate}},
            },
        },
    })
    async getCandidate(@param.path.string('id') candidateId: string): Promise<Candidate> {
        return await CandidateControllerBackEnd.getCandidateById(candidateId);
    }


    @get('/candidates', {
        responses: {
            '200': {
                description: 'Returns the list of all the Candidates',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {'x-ts-type': Candidate}
                        },
                    },
                },
            },
        },
    })
    async allCandidates(): Promise<Candidate[]> {
        return await CandidateControllerBackEnd.listCandidates();
    }

    @get('/candidates/{search_term}', {
        responses: {
            '200': {
                description: 'Returns the list of the candidates whose names match the search term',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {'x-ts-type': Candidate}
                        },
                    },
                },
            },
        },
    })
    async searchCandidates(@param.path.string('search_term') searchTerm: string): Promise<Candidate[]> {
        return await CandidateControllerBackEnd.searchCandidate(searchTerm);
    }

    @post('/candidate/disable/{id}', {
        responses: {
            '200': {
                description: 'disable the candidate',
                content: {'application/json': {'x-ts-type': Candidate}},
            },
        },
    })
    async disableCandidate(@param.path.string('id') candidateId: string): Promise<Candidate> {
        return await CandidateControllerBackEnd.disableCandidate(candidateId);
    }


}
