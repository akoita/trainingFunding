import * as yup from 'yup';
import {ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';
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


    public static build(valueObject: {
        id: string, created: number, modified: number, status: TrainingAppLifecycleStatus,
        title: string, description: string, domain: Domain, level: TrainingOfferLevel
    }): TrainingOffer {
        let model = new TrainingOffer();
        model.id = valueObject.id;
        model.created = valueObject.created;
        model.modified = valueObject.modified;
        model.status = valueObject.status;
        model.title = valueObject.title;
        model.description = valueObject.description;
        model.domain = valueObject.domain;
        model.level = valueObject.level;

        return model;
    }


}

