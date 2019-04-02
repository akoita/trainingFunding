import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { ConvectorController } from '@worldsibu/convector-core';
import { Candidate } from './candidate.model';
export declare class CandidateController extends ConvectorController<ChaincodeTx> {
    createCandidate(candidate: Candidate): Promise<void>;
    listCandidates(): Promise<Candidate[]>;
    searchCandidate(namePart: string): Promise<Candidate[] | Candidate>;
    disableCandidate(candidate: Candidate): Promise<void>;
}
