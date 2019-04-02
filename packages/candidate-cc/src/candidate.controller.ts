import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Candidate } from './candidate.model';

@Controller('candidate')
export class CandidateController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(Candidate)
    candidate: Candidate
  ) {
    await candidate.save();
  }
}