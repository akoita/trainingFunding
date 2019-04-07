import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { ConvectorController } from '@worldsibu/convector-core';
import { Training, TrainingProcessStatus } from './training.model';
export declare class TrainingController extends ConvectorController<ChaincodeTx> {
    create(training: Training): Promise<void>;
    submitTrainingApplication(training: Training): Promise<void>;
    acceptApplication(training: Training): Promise<void>;
    fundTraining(training: Training): Promise<void>;
    startTraining(training: Training): Promise<void>;
    certifyCandidate(training: Training): Promise<void>;
    failCandidate(training: Training): Promise<void>;
    getCandidateTrainings(namePart: string): Promise<Training[] | Training>;
    searchTrainingByProcessStatus(trainingProcessStatus: TrainingProcessStatus): Promise<Training[] | Training>;
}
