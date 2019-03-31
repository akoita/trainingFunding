import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export abstract class AbstractTrainingAsset extends ConvectorModel<AbstractTrainingAsset> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.abstractTrainingAsset';

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


  @Required()
  public status: TrainingAppLifecycleStatus;

  @Required()
  @Validate(AbstractTrainingAsset)
  public owner: AbstractTrainingAsset;

}



export enum TrainingAppLifecycleStatus {
  Open,
  Closed
}