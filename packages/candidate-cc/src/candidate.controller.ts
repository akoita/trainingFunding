import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Candidate} from './candidate.model';
import {TrainingOffer} from "../../trainingOffer-cc/src";
import {TrainingAppLifecycleStatus} from "../../common-cc/src";

@Controller('candidate')
export class CandidateController extends ConvectorController<ChaincodeTx> {
    @Invokable()
    public async createCandidate(@Param(Candidate) candidate: Candidate) {
        await candidate.save();
    }

    @Invokable()
    public async listCandidates(): Promise<Candidate[]> {
        return Candidate.getAll();
    }

    @Invokable()
    public async searchCandidate(@Param(String) namePart: string): Promise<Candidate[] | Candidate> {
        const queryObject = {
            "selector": {
                "$or": [{"firstName": namePart.toString()}, {"lastName": namePart.toString()}]
            },
            "sort":
                [{"firstName": "asc"}]
        };

        const candidates = await Candidate.query(Candidate, JSON.stringify(queryObject));
        return candidates;
    }

    @Invokable()
    public async disableCandidate(@Param(Candidate) candidate: Candidate){
        if(candidate.status===TrainingAppLifecycleStatus.Closed){
            throw new Error("Candidate is already disabled");
        }else {
            candidate.status= TrainingAppLifecycleStatus.Closed;
            await candidate.save();
        }
    }
}