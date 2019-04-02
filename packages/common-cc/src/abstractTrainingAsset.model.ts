import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';
import {AbstractTrainingParticipant} from "./abstractTrainingParticipant.model";

export abstract class AbstractTrainingAsset<T extends AbstractTrainingAsset<any>> extends ConvectorModel<T> {
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
  @Validate(AbstractTrainingParticipant)
  public owner: AbstractTrainingParticipant<any>;
}


export enum TrainingAppLifecycleStatus {
  Open,
  Closed
}