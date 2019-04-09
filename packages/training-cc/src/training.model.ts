import * as yup from 'yup';
import {ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';
import {AbstractTrainingAsset, TrainingAppLifecycleStatus} from 'common-cc';
import {TrainingOffer} from 'trainingOffer-cc';
import {Candidate} from 'candidate-cc';


export enum TrainingProcessStatus {
    NotSubmitted,
    Submitted,
    Funded,
    InProgress,
    Succeeded,
    Failed,
    Accepted
}


export class Training extends AbstractTrainingAsset<Training> {

    @ReadOnly()
    @Required()
    public readonly type = 'io.worldsibu.training';

    @ReadOnly()
    @Required()
    @Validate(TrainingOffer)
    public trainingOffer: TrainingOffer;

    @Required()
    @Validate(yup.string().oneOf(Object.keys(TrainingProcessStatus).map(k => TrainingProcessStatus[k])))
    public trainingProcessStatus: TrainingProcessStatus;

    @ReadOnly()
    @Required()
    @Validate(Candidate)
    public candidate: Candidate;

    public static build(value: {
        id: string, created: number, modified: number, status: TrainingAppLifecycleStatus, trainingOffer: TrainingOffer,
        trainingProcessStatus: TrainingProcessStatus, candidate: Candidate
    }): Training {
        const model = new Training();
        model.id = value.id;
        model.created = value.created;
        model.modified = value.modified;
        model.status = value.status;
        model.trainingOffer = value.trainingOffer;
        model.trainingProcessStatus = value.trainingProcessStatus;
        model.candidate = value.candidate;
        return model;
    }
}
