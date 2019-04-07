import { AbstractTrainingAsset } from "common-cc";
export declare class TrainingOffer extends AbstractTrainingAsset<TrainingOffer> {
    readonly type = "io.worldsibu.trainingOffer";
    title: string;
    description: string;
    domain: Domain;
    level: TrainingOfferLevel;
}
export declare enum TrainingOfferLevel {
    Intermediate = 0,
    Advanced = 1
}
export declare enum Domain {
    SoftwareDeveloper = 0,
    ProjectManager = 1,
    Language = 2
}
