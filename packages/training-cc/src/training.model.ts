import * as yup from 'yup';
import {ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';
import {AbstractTrainingAsset, TrainingAppLifecycleStatus} from 'common-cc';


export enum TrainingProcessStatus {
    NotSubmitted = 'NotSubmitted',
    Submitted = 'Submitted',
    Accepted = 'Accepted',
    Funded = 'Funded',
    InProgress = 'InProgress',
    Succeeded = 'Succeeded',
    Failed = 'Failed'
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

    @ReadOnly()
    @Validate(yup.string())
    trainingCompanyId: string;

    @ReadOnly()
    @Validate(yup.string())
    investorId: string;

    public static build(params: {
        id: string, ownerId: string, created: number, modified: number, status: TrainingAppLifecycleStatus, trainingOfferId: string,
        trainingProcessStatus: TrainingProcessStatus, candidateId: string
    }): Training {
        const model = new Training();
        model.id = params.id;
        model.ownerId = params.ownerId;
        model.created = params.created;
        model.modified = params.modified;
        model.status = params.status;
        model.trainingOfferId = params.trainingOfferId;
        model.trainingProcessStatus = params.trainingProcessStatus;
        model.candidateId = params.candidateId;
        return model;
    }

}
