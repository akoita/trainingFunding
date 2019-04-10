import * as yup from 'yup';
import {FlatConvectorModel, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';
import {AbstractTrainingAsset, TrainingAppLifecycleStatus} from 'common-cc';
import {TrainingOffer} from 'trainingOffer-cc';
import {Candidate} from 'candidate-cc';


export enum TrainingProcessStatus {
    NotSubmitted='NotSubmitted',
    Submitted='Submitted',
    Funded='Funded',
    InProgress='InProgress',
    Succeeded='Succeeded',
    Failed='Failed',
    Accepted='Accepted'
}


export class Training extends AbstractTrainingAsset<Training> {

    @ReadOnly()
    @Required()
    public readonly type = 'io.worldsibu.training';
    public static readonly staticType = 'io.worldsibu.training';

    @ReadOnly()
    @Required()
    @Validate(TrainingOffer)
    public trainingOffer: FlatConvectorModel<TrainingOffer>;

    @Required()
    @Validate(yup.string().oneOf(Object.keys(TrainingProcessStatus).map(k => TrainingProcessStatus[k])))
    public trainingProcessStatus: TrainingProcessStatus;

    @Required()
    @Validate(Candidate)
    public candidate: FlatConvectorModel<Candidate>;

    public static build(value: {
        id: string, created: number, modified: number, status: TrainingAppLifecycleStatus, trainingOffer: FlatConvectorModel<TrainingOffer>,
        trainingProcessStatus: TrainingProcessStatus, candidate: FlatConvectorModel<Candidate>}): Training {
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

    /**
     * Check the state of a new training and trows an execption if the status if not valid
     * @param training
     */
    static checkNewTrainingState(training: Training) {
        if(training.status===TrainingAppLifecycleStatus.Closed){
            throw new Error("new Training status can\'t be closed");
        }
        if(training.trainingProcessStatus!==TrainingProcessStatus.NotSubmitted){
            throw new Error(`new Training process status must be "${TrainingProcessStatus.NotSubmitted}"`);
        }
        Candidate.checkNewCandidateState(new Candidate(training.candidate));
        TrainingOffer.checkNewTrainingOfferState(new TrainingOffer(training.trainingOffer));
    }
}
