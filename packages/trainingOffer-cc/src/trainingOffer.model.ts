import * as yup from 'yup';
import {ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';
import {AbstractTrainingAsset, TrainingAppLifecycleStatus} from 'common-cc';


export enum TrainingOfferLevel {
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}

export enum TrainingDomain {
    SoftwareDevelopment = "SoftwareDevelopment",
    ProjectManagement = "ProjectManagement",
    General = "General"
}

export const trainingOfferLevelYupSchema = () => yup.string()
                                                    .oneOf(Object.keys(TrainingOfferLevel).map(k => TrainingOfferLevel[k]));

export const trainingDomainYupSchema = () => yup.string().oneOf(Object.keys(TrainingDomain).map(k => TrainingDomain[k]));

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
    @Validate(trainingDomainYupSchema())
    public domain: TrainingDomain;

    @Required()
    @Validate(trainingOfferLevelYupSchema())
    public level: TrainingOfferLevel;

    public withTitle(title: string): this {
        this.title = title;
        return this;
    }

    public withDescription(description: string): this {
        this.description = description;
        return this;
    }

    public withDomain(domain: TrainingDomain): this {
        this.domain = domain;
        return this;
    }

    public withLevel(level: TrainingOfferLevel): this {
        this.level = level;
        return this;
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

