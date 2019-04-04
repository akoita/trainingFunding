import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

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
  @Validate(yup.string())
  public status: TrainingAppLifecycleStatus;
  //
  // // @Required()
  // // @Validate(AbstractTrainingParticipant)
  // // public owner: AbstractTrainingParticipant<any>;
  //
  // constructor(object: {id: string, created: number, modified: number, status: TrainingAppLifecycleStatus}) {
  //   super(object.id);
  //   this.id= object.id;
  //   this.created =object.created;
  //   this.modified = object.modified;
  //   this.status = object.status;
  // }
}


export enum TrainingAppLifecycleStatus {
  Open = "Open",
  Closed = "Closed"
}