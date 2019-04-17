// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {CandidateControllerBackEnd, InitServerIdentity} from '../convector';

import {get, param,} from '@loopback/rest';
import {Candidate} from "candidate-cc";


InitServerIdentity();

export class CandidateWebControllerController {
    constructor() {
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
        return await CandidateControllerBackEnd.get(candidateId);
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


}
