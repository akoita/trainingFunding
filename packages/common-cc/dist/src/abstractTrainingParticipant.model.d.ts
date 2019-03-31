import { ConvectorModel } from '@worldsibu/convector-core-model';
export declare abstract class AbstractTrainingParticipant extends ConvectorModel<AbstractTrainingParticipant> {
    readonly type: string;
    id: string;
    firstName: string;
    lastName: string;
    created: number;
    modified: number;
}
