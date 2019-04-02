import { ConvectorModel } from '@worldsibu/convector-core-model';
import { AbstractTrainingParticipant } from "./abstractTrainingParticipant.model";
export declare abstract class AbstractTrainingAsset<T extends AbstractTrainingAsset<any>> extends ConvectorModel<T> {
    id: string;
    created: number;
    modified: number;
    status: TrainingAppLifecycleStatus;
    owner: AbstractTrainingParticipant<any>;
}
export declare enum TrainingAppLifecycleStatus {
    Open = 0,
    Closed = 1,
}
