import * as yup from 'yup';
import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Domain, TrainingOffer, TrainingOfferLevel} from './trainingOffer.model';
import {TrainingAppLifecycleStatus} from 'common-cc';

@Controller('trainingOffer')
export class TrainingOfferController extends ConvectorController<ChaincodeTx> {

    @Invokable()
    public async createTrainingOffer(@Param(TrainingOffer)    trainingOffer: TrainingOffer) {
        if (trainingOffer.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error("new Training offer status can't be closed");
        }
        await trainingOffer.save();
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
    public async searchTrainingOffersByTitleAndDescription(@Param(yup.string()) keyword: string): Promise<TrainingOffer[] | TrainingOffer> {
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
        return trainingOffers;

    }

    @Invokable()
    public async searchTrainingOffersByDomain(@Param(yup.string()) domain: Domain): Promise<TrainingOffer[] | TrainingOffer> {
        const queryObject = {
            "selector": {
                $and: [
                    {"type": TrainingOffer.staticType},
                    {"domain": {$regex: ".*?"+domain.toString()+".*"}}
                ]
            },
            "sort": [{"title": "asc"}]
        };
        const trainingOffers = await TrainingOffer.query(TrainingOffer, JSON.stringify(queryObject));
        return trainingOffers;
    }

    @Invokable()
    public async searchTrainingOffersByDomainAndLevel(@Param(Domain) domain: Domain, @Param(TrainingOfferLevel) level: TrainingOfferLevel): Promise<TrainingOffer[] | TrainingOffer> {
        const queryObject = {
            "selector": {
                "$and": [{"domain": domain.toString()}, {"level": level.toString()}]
            },
            "sort":
                [{"title": "asc"}]
        };

        const trainingOffers = await TrainingOffer.query(TrainingOffer, JSON.stringify(queryObject));
        return trainingOffers;
    }

}