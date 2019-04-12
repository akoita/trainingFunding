import * as yup from 'yup';
import {ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';
import {AbstractTrainingAsset, TrainingAppLifecycleStatus} from 'common-cc';


export enum TrainingProcessStatus {
    NotSubmitted = 'NotSubmitted',
    Submitted = 'Submitted',
    Funded = 'Funded',
    InProgress = 'InProgress',
    Succeeded = 'Succeeded',
    Failed = 'Failed',
    Accepted = 'Accepted'
}


export class Training extends AbstractTrainingAsset<Training> {

    @ReadOnly()
    @Required()
    public readonly type = 'io.worldsibu.training';
    public static readonly staticType = 'io.worldsibu.training';

    @ReadOnly()
    @Required()
    @Validate(yup.string())
    public trainingOfferId: string;

    @ReadOnly()
    @Required()
    @Validate(yup.string())
    public candidateId: string;

    @Required()
    @Validate(yup.string().oneOf(Object.keys(TrainingProcessStatus).map(k => TrainingProcessStatus[k])))
    public trainingProcessStatus: TrainingProcessStatus;

    public static build(value: {
        id: string, created: number, modified: number, status: TrainingAppLifecycleStatus, trainingOfferId: string,
        trainingProcessStatus: TrainingProcessStatus, candidateId: string
    }): Training {
        const model = new Training();
        model.id = value.id;
        model.created = value.created;
        model.modified = value.modified;
        model.status = value.status;
        model.trainingOfferId = value.trainingOfferId;
        model.trainingProcessStatus = value.trainingProcessStatus;
        model.candidateId = value.candidateId;
        return model;
    }

}
