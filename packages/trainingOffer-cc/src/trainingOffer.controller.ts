import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

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
    if(!trainingOffer || !trainingOffer.id){
      throw new Error("no existing training offer found with the id: "+trainingOfferId);
    }
    if (trainingOffer.status == TrainingAppLifecycleStatus.Closed) {
      throw new Error("training offer's status is already closed");
    }
    trainingOffer.status = TrainingAppLifecycleStatus.Closed;
    await trainingOffer.save();
  }

  @Invokable()
  public async listTrainingOffers(): Promise<TrainingOffer[]> {
    const trainingOffers = await TrainingOffer.getAll();
    return trainingOffers;
  }

  @Invokable()
  public async listTrainingOffersContainingKeyword(@Param(String) keyword: string): Promise<TrainingOffer[] | TrainingOffer> {
    const queryObject = {
      "selector": {
        "$or": [{"title": keyword}, {"description": keyword}]
      },
      "sort":
          [{"title": "asc"}]
    };
    // const trainingOffers =  await this.tx.stub.getStub().getQueryResult(JSON.stringify(queryObject));
    const trainingOffers = await TrainingOffer.query(TrainingOffer, JSON.stringify(queryObject));
    return trainingOffers;

  }

  @Invokable()
  public async listTrainingOffersForDomain(@Param(Domain) domain: Domain): Promise<TrainingOffer[] | TrainingOffer> {
    const queryObject = {
      "selector": {"domain": domain.toString()},
      "sort": [{"title": "asc"}]
    };
    const trainingOffers = await TrainingOffer.query(TrainingOffer, JSON.stringify(queryObject));
    return trainingOffers;
  }

  @Invokable()
  public async listTrainingOffersForDomainAndLevel(@Param(Domain) domain: Domain, @Param(TrainingOfferLevel) level: TrainingOfferLevel): Promise<TrainingOffer[] | TrainingOffer> {
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