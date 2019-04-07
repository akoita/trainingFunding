import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Common } from './common.model';

@Controller('common')
export class CommonController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(Common)
    common: Common
  ) {
    await common.save();
  }
}