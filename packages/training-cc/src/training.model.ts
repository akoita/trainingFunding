import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';
import {TrainingOffer} from "../../trainingOffer-cc/src";
import {Candidate} from "../../candidate-cc/src";
import {AbstractTrainingAsset} from "../../common-cc/src";

export class Training extends AbstractTrainingAsset<Training> {

  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.training';

  @ReadOnly()
  @Required()
  @Validate(TrainingOffer)
  public trainingOffer: TrainingOffer;

  @Required()
  public trainingProcessStatus: TrainingProcessStatus;

  @ReadOnly()
  @Required()
  @Validate(Candidate)
  public candidate: Candidate;

}


export enum TrainingProcessStatus {
  NotSubmitted,
  Submitted,
  Funded,
  InProgress,
  Succeeded,
  Failed,
  Accepted
}

