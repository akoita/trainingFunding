import * as yup from 'yup';
import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Domain, TrainingOffer, TrainingOfferLevel} from './trainingOffer.model';
import {TrainingAppLifecycleStatus} from 'common-cc';

@Controller('trainingOffer')
export class TrainingOfferController extends ConvectorController<ChaincodeTx> {

    @Invokable()
    public async createTrainingOffer(@Param(TrainingOffer)    trainingOffer: TrainingOffer) {
        TrainingOffer.checkNewTrainingOfferState(trainingOffer);
        await trainingOffer.save();
    }

    @Invokable()
    public async getTrainingOfferById(@Param(yup.string())trainingOfferId: string): Promise<TrainingOffer> {
        const trainingOffer = await TrainingOffer.getOne(trainingOfferId);
        if (!trainingOffer || !trainingOffer.id) {
            throw new Error(`no training offer found with the id: "${trainingOfferId}"`);
        }
        return trainingOffer;
    }

    @Invokable()
    public async closeTrainingOffer(@Param(yup.string()) trainingOfferId: string) {
        const trainingOffer = await TrainingOffer.getOne(trainingOfferId);
        if (!trainingOffer || !trainingOffer.id) {
            throw new Error("no existing training offer found with the id: " + trainingOfferId);
        }
        if (trainingOffer.status == TrainingAppLifecycleStatus.Closed) {
            throw new Error("training offer's status is already closed");
        }
        trainingOffer.status = TrainingAppLifecycleStatus.Closed;
        await trainingOffer.save();
    }

    @Invokable()
    public async listTrainingOffers(): Promise<TrainingOffer[]> {
        return await TrainingOffer.getAll();
    }

    @Invokable()
    public async searchTrainingOffersByTitleOrDescription(@Param(yup.string()) keyword: string): Promise<TrainingOffer[]> {
        const queryObject = {
            "selector": {
                $and: [
                    {"type": TrainingOffer.staticType},
                    {$or: [{"title": {$regex: ".*" + keyword + ".*"}}, {"description": {$regex: ".*?" + keyword + ".*"}}]}
                ]
            },
            "sort":
                [{"title": "asc"}]
        };
        const trainingOffers = await TrainingOffer.query(TrainingOffer, JSON.stringify(queryObject));
        if (Array.isArray(trainingOffers)) {
            return trainingOffers;
        } else {
            return [trainingOffers];
        }
    }

    @Invokable()
    public async searchTrainingOffersByDomain(@Param(yup.string().oneOf(Object.keys(Domain).map(k => Domain[k]))) domain: Domain): Promise<TrainingOffer[]> {
        const queryObject = {
            "selector": {
                $and: [
                    {"type": TrainingOffer.staticType},
                    {"domain": {$regex: ".*?" + domain.toString() + ".*"}}
                ]
            },
            "sort": [{"title": "asc"}]
        };
        const trainingOffers = await TrainingOffer.query(TrainingOffer, JSON.stringify(queryObject));
        if (Array.isArray(trainingOffers)) {
            return trainingOffers;
        } else {
            return [trainingOffers];
        }
    }

    @Invokable()
    public async searchTrainingOffersByDomainAndLevel(@Param(yup.string().oneOf(Object.keys(Domain).map(k => Domain[k]))) domain: Domain, @Param(yup.string().oneOf(Object.keys(TrainingOfferLevel).map(k => TrainingOfferLevel[k]))) level: TrainingOfferLevel): Promise<TrainingOffer[]> {
        const queryObject = {
            "selector": {
                $and: [{"type": TrainingOffer.staticType},
                    {$and: [{"domain": {$regex: ".*?" + domain.toString() + ".*"}}, {"level": {$regex: ".*?" + level.toString() + ".*"}}]}
                ]
            },
            "sort":
                [{"title": "asc"}]
        };
        const trainingOffers = await TrainingOffer.query(TrainingOffer, JSON.stringify(queryObject));
        if (Array.isArray(trainingOffers)) {
            return trainingOffers;
        } else {
            return [trainingOffers];
        }
    }

}