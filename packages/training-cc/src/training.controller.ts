import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Training } from './training.model';

@Controller('training')
export class TrainingController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(Training)
    training: Training
  ) {
    await training.save();
  }
}