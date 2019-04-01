import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export abstract class AbstractTrainingParticipant<T extends AbstractTrainingParticipant<any>> extends ConvectorModel<T> {

  @Required()
  @Validate(yup.string())
  public id: string;

  @ReadOnly()
  @Required()
  @Validate(yup.number())
  public created: number;

  @Required()
  @Validate(yup.number())
  public modified: number;
}
