import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { ConvectorController } from '@worldsibu/convector-core';
import { Domain, TrainingOffer, TrainingOfferLevel } from './trainingOffer.model';
export declare class TrainingOfferController extends ConvectorController<ChaincodeTx> {
    createTrainingOffer(trainingOffer: TrainingOffer): Promise<void>;
    closeTrainingOffer(trainingOffer: TrainingOffer): Promise<void>;
    listTrainingOffers(): Promise<TrainingOffer[]>;
    listTrainingOffersContainingKeyword(keyword: string): Promise<TrainingOffer[] | TrainingOffer>;
    listTrainingOffersForDomain(domain: Domain): Promise<TrainingOffer[] | TrainingOffer>;
    listTrainingOffersForDomainAndLevel(domain: Domain, level: TrainingOfferLevel): Promise<TrainingOffer[] | TrainingOffer>;
}
