import * as yup from 'yup';
import {FlatConvectorModel, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';
import {AbstractTrainingAsset, TrainingAppLifecycleStatus} from 'common-cc';


export enum TrainingOfferLevel {
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}

export enum Domain {
    SoftwareDevelopment = "SoftwareDevelopment",
    ProjectManagement = "ProjectManagement",
    General = "General"
}

export class TrainingOffer extends AbstractTrainingAsset<TrainingOffer> {
    @ReadOnly()
    @Required()
    public readonly type = 'io.worldsibu.trainingOffer';
    public static readonly staticType = 'io.worldsibu.trainingOffer';

    @Required()
    @Validate(yup.string())
    public title: string;

    @Required()
    @Validate(yup.string())
    public description: string;

    @Required()
    @Validate(yup.string().oneOf(Object.keys(Domain).map(k => Domain[k])))
    public domain: Domain;

    @Required()
    @Validate(yup.string().oneOf(Object.keys(TrainingOfferLevel).map(k => TrainingOfferLevel[k])))
    public level: TrainingOfferLevel;

    public static build(params: {
        id: string, ownerId: string, created: number, modified: number, status: TrainingAppLifecycleStatus,
        title: string, description: string, domain: Domain, level: TrainingOfferLevel
    }): TrainingOffer {

        let model = new TrainingOffer();
        model.id = params.id;
        model.ownerId = params.ownerId;
        model.created = params.created;
        model.modified = params.modified;
        model.status = params.status;
        model.title = params.title;
        model.description = params.description;
        model.domain = params.domain;
        model.level = params.level;

        return model;
    }


    /**
     * Check the state of new training offer and throw an exception if the state is not valid
     * @param trainingOffer a new training offer
     */
    public static checkNewTrainingOfferState(trainingOffer: TrainingOffer) {
        if (trainingOffer.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error("new Training offer status can't be closed");
        }
    }

}

