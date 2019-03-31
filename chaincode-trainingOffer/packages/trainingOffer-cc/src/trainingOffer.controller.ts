import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { TrainingOffer } from './trainingOffer.model';

@Controller('trainingOffer')
export class TrainingOfferController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(TrainingOffer)
    trainingOffer: TrainingOffer
  ) {
    await trainingOffer.save();
  }
}