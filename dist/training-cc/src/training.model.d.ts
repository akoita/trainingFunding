import { AbstractTrainingAsset } from 'common-cc';
import { TrainingOffer } from 'trainingOffer-cc';
import { Candidate } from 'candidate-cc';
export declare class Training extends AbstractTrainingAsset<Training> {
    readonly type = "io.worldsibu.training";
    trainingOffer: TrainingOffer;
    trainingProcessStatus: TrainingProcessStatus;
    candidate: Candidate;
}
export declare enum TrainingProcessStatus {
    NotSubmitted = 0,
    Submitted = 1,
    Funded = 2,
    InProgress = 3,
    Succeeded = 4,
    Failed = 5,
    Accepted = 6
}
