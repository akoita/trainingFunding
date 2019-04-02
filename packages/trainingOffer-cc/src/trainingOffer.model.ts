import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';
import {AbstractTrainingAsset} from "../../common-cc/dist/src";

export class TrainingOffer extends AbstractTrainingAsset<TrainingOffer> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.trainingOffer';

  @Required()
  @Validate(yup.string())
  public title: string;

  @Required()
  @Validate(yup.string())
  public description: string;

  @Required()
  public domain: Domain

  @Required()
  public level: TrainingOfferLevel

}


export enum TrainingOfferLevel {
  Intermediate,
  Advanced
}

export enum Domain {
  SoftwareDeveloper,
  ProjectManager,
  Language
}