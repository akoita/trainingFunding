import { ConvectorModel } from '@worldsibu/convector-core-model';
export declare abstract class AbstractTrainingAsset<T extends AbstractTrainingAsset<any>> extends ConvectorModel<T> {
    name: string;
    created: number;
    modified: number;
}
