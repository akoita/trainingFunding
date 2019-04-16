import * as yup from 'yup';
import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Candidate} from './candidate.model';
import {TrainingAppLifecycleStatus} from 'common-cc';

@Controller('candidate')
export class CandidateController extends ConvectorController<ChaincodeTx> {
    @Invokable()
    public async createCandidate(@Param(Candidate) candidate: Candidate) {
        debugger;
        Candidate.checkNewCandidateState(candidate);
        await candidate.save();
    }


    @Invokable()
    public async get(@Param(yup.string()) candidateId: string): Promise<Candidate> {
        const candidate = await Candidate.getOne(candidateId);
        if(!candidate || !candidate.id){
            throw new Error(`no candidate found with the id: "${candidateId}"`);
        }
        return candidate;
    }

    @Invokable()
    public async listCandidates(): Promise<Candidate[]> {
        debugger;
        return Candidate.getAll();
    }

    @Invokable()
    public async searchCandidate(@Param(yup.string()) namePart: string): Promise<Candidate[] | Candidate> {
        debugger;
        const queryObject = {
            "selector": {
                $and: [{"type": new Candidate().type}, {$or: [{"firstName": {$regex: ".*?" + namePart + ".*"}}, {"lastName": {$regex: ".*?" + namePart + ".*"}}]}]
            },
            "use_index": ["_design/indexCandidateFirstNameTypeDoc", "indexCandidateFirstNameType"],
            "sort":
                [{"firstName": "asc"}]
        };
        debugger;
        const candidates = await Candidate.query(Candidate, JSON.stringify(queryObject));
        return candidates;
    }

    @Invokable()
    public async disableCandidate(@Param(yup.string()) candidateId: string): Promise<Candidate> {
        const candidate = await Candidate.getOne(candidateId);
        if (!candidate || !candidate.id) {
            throw new Error('no existing candidate found with the id: ' + candidateId)
        }
        if (candidate.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error("Candidate is already disabled");
        }
        candidate.status = TrainingAppLifecycleStatus.Closed;
        await candidate.save();
        return await Candidate.getOne(candidateId);
    }
}