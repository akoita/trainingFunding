import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

import {AbstractTrainingAsset} from 'common-cc';



export class Candidate extends AbstractTrainingAsset<Candidate> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.candidate';

  @Required()
  @Validate(yup.string())
  public firstName: string;

  @Required()
  @Validate(yup.string())
  public lastName: string;
}
