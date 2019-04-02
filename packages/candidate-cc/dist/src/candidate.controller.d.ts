import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { ConvectorController } from '@worldsibu/convector-core';
import { Candidate } from './candidate.model';
export declare class CandidateController extends ConvectorController<ChaincodeTx> {
    create(candidate: Candidate): Promise<void>;
}
