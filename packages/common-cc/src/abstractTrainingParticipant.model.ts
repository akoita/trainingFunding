import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export abstract class AbstractTrainingParticipant<T extends AbstractTrainingParticipant<any>> extends ConvectorModel<T> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.abstractTrainingParticipant';

  @Required()
  @Validate(yup.string())
  public name: string;

  @ReadOnly()
  @Required()
  @Validate(yup.number())
  public created: number;

  @Required()
  @Validate(yup.number())
  public modified: number;
}
