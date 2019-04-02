import { ConvectorModel } from '@worldsibu/convector-core-model';
export declare abstract class AbstractTrainingParticipant<T extends AbstractTrainingParticipant<any>> extends ConvectorModel<T> {
    id: string;
    created: number;
    modified: number;
}
