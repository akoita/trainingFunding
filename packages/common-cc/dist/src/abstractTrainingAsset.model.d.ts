import { ConvectorModel } from '@worldsibu/convector-core-model';
export declare abstract class AbstractTrainingAsset extends ConvectorModel<AbstractTrainingAsset> {
    readonly type: string;
    id: string;
    created: number;
    modified: number;
    status: TrainingAppLifecycleStatus;
    owner: AbstractTrainingAsset;
}
export declare enum TrainingAppLifecycleStatus {
    Open = 0,
    Closed = 1,
}
