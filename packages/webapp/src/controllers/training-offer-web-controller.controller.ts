// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


import {TrainingOfferControllerBackEnd} from '../convector'
import {get, param, post, requestBody} from '@loopback/rest';
import {Domain, TrainingOffer, TrainingOfferLevel} from "trainingOffer-cc";


export class TrainingOfferWebControllerController {
    constructor() {
    }

    @post('/trainingOffer/create', {
        description: "Create a new training offer",
        responses: {}
    })
    async createTrainingOffer(@requestBody()trainingOffer: TrainingOffer) {
        await TrainingOfferControllerBackEnd.createTrainingOffer(trainingOffer);
    }

    @get('/trainingOffer', {
        description: 'Get a training offer by id',
        responses: {
            '200': {
                description: 'Training offer found by id',
                content: {'application/json': {'x-ts-type': TrainingOffer}}
            }
        }
    })
    public async getTrainingOfferById(@param.query.string('id') trainingOfferId: string): Promise<TrainingOffer> {
        return await TrainingOfferControllerBackEnd.getTrainingOfferById(trainingOfferId);
    }


    @post('trainingOffer/close', {
        description: "Close a training",
        responses: {}
    })
    public async closeTrainingOffer(@param.query.string('id')trainingOfferId: string) {
        return await TrainingOfferControllerBackEnd.closeTrainingOffer(trainingOfferId);
    }


    @get('trainingOffers', {
        responses: {
            200: {
                description: 'Returns the list of all the training offers',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {'x-ts-type': TrainingOffer}
                        }
                    }
                }
            }
        }
    })
    public async listTrainingOffers(): Promise<TrainingOffer[]> {
        return await TrainingOfferControllerBackEnd.listTrainingOffers();
    }


    @get('trainingOffers/byTitleOrDescription', {
        description: 'Returns the list of the training offers matching the title or the description',
        responses: {
            200: {
                description: 'The list of the training offers matching the title or the description',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {'x-ts-type': TrainingOffer}
                        }
                    }
                }
            }
        }
    })
    public async searchTrainingOffersByTitleOrDescription(@param.query.string('titleOrDescription')keyword: string): Promise<TrainingOffer[]> {
        return await TrainingOfferControllerBackEnd.searchTrainingOffersByTitleOrDescription(keyword);
    }


    @get('trainingOffers/byDomain', {
        description: 'Returns the list of the training offers matching the domain',
        responses: {
            200: {
                description: 'The list of the training offers matching the domain',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {'x-ts-type': TrainingOffer}
                        }
                    }
                }
            }
        }
    })
    public async searchTrainingOffersByDomain(@param.path.string('domain')domain: Domain): Promise<TrainingOffer[]> {
        return await TrainingOfferControllerBackEnd.searchTrainingOffersByDomain(domain);
    }

    @get('trainingOffers/ByDomainAndLevel', {
        description: 'Returns the list of the training offers matching the domain and the level',
        responses: {
            200: {
                description: 'The list of the training offers matching the domain and the level',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {'x-ts-type': TrainingOffer}
                        }
                    }
                }
            }
        }
    })
    public async searchTrainingOffersByDomainAndLevel(@param.query.string('domain')domain: Domain, @param.query.string('level')level: TrainingOfferLevel): Promise<TrainingOffer[]> {
        return await TrainingOfferControllerBackEnd.searchTrainingOffersByDomainAndLevel(domain, level);
    }

}
