import { ConvectorModel } from '@worldsibu/convector-core-model';
export declare abstract class AbstractTrainingAsset<T extends AbstractTrainingAsset<any>> extends ConvectorModel<T> {
    id: string;
    created: number;
    modified: number;
    status: TrainingAppLifecycleStatus;
}
export declare enum TrainingAppLifecycleStatus {
    Open = "Open",
    Closed = "Closed",
}
