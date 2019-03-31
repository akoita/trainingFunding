import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { ConvectorController } from '@worldsibu/convector-core';
import { TrainingOffer } from './trainingOffer.model';
export declare class TrainingOfferController extends ConvectorController<ChaincodeTx> {
    create(trainingOffer: TrainingOffer): Promise<void>;
}
