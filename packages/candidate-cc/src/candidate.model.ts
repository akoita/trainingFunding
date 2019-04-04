import * as yup from 'yup';
import {ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';

import {AbstractTrainingAsset, TrainingAppLifecycleStatus} from 'common-cc';




export class Candidate extends AbstractTrainingAsset<Candidate> {
  @ReadOnly()
  @Required()
  readonly type = 'io.worldsibu.candidate';

  @Required()
  @Validate(yup.string())
  firstName: string;

  @Required()
  @Validate(yup.string())
  lastName: string;

  //
  // constructor(object: {id: string, created: number, modified: number, status: TrainingAppLifecycleStatus, firstName: string, lastName: string}){
  //   super({id: object.id, created: object.created, modified: object.modified, status: object.status});
  //   this.firstName = object.firstName;
  //   this.lastName = object.lastName;
  // }
}
