import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { ConvectorController } from '@worldsibu/convector-core';
import { Training } from './training.model';
export declare class TrainingController extends ConvectorController<ChaincodeTx> {
    create(training: Training): Promise<void>;
}
