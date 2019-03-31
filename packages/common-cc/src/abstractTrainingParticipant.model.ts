import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export abstract class AbstractTrainingParticipant extends ConvectorModel<AbstractTrainingParticipant> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.abstractTrainingParticipant';

  @Required()
  @Validate(yup.string())
  public id: string;

  @Required()
  @Validate(yup.string())
  public firstName: string;

  @Required()
  @Validate(yup.string())
  public lastName: string;

  @ReadOnly()
  @Required()
  @Validate(yup.number())
  public created: number;

  @Required()
  @Validate(yup.number())
  public modified: number;
}
