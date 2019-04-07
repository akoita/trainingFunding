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
        if (candidate.status !== TrainingAppLifecycleStatus.Open) {
            throw new Error('new candidate must be in open status');
        }
        await candidate.save();
    }

    @Invokable()
    public async listCandidates(): Promise<Candidate[]> {
        debugger;
        return Candidate.getAll();
    }

    @Invokable()
    public async searchCandidate(@Param(yup.string()) namePart: string): Promise<Candidate[] | Candidate> {
        debugger;
        // const queryObject = {
        //     "selector": {
        //         $and: [{"firstName": namePart}, {"type": new Candidate().type}]
        //     },
        //     "use_index": ["_design/indexCandidateDoc", "indexCandidate"],
        //     fields: ["firstName", "lastName", "type"],
        //     "sort":
        //         [{"firstName": "asc"}]
        // };
        // const queryObject = {
        //     "selector": {
        //         $and: [{$or: [{"firstName": namePart}, {"lastName": namePart}]}, {"type": new Candidate().type}]
        //     },
        //     "use_index": ["_design/indexCandidateDoc", "indexCandidate"],
        //     fields: ["firstName", "lastName", "type"],
        //     "sort":
        //         [{"firstName": "asc"}]
        // };
        const queryObject = {
            "selector": {
                $and: [{"type": new Candidate().type}, {$or: [{"firstName": {$regex: ".*?"+namePart+".*"}}, {"lastName": {$regex: ".*?"+namePart+".*"}}]}]
            },
            "use_index": ["_design/indexCandidateDoc", "indexCandidate"],
            "sort":
                [{"firstName": "asc"}]
        };
        // const queryObject = {
        //     "selector": {
        //         $and: [{$or: [{"firstName": {$regex: ".*"}}, {"lastName": {$regex: ".*"}}]}, {"type": new Candidate().type}]
        //     },
        //     "sort":
        //         [{"firstName": "asc"}]
        // };
        debugger;
        const candidates = await Candidate.query(Candidate, JSON.stringify(queryObject));
        return candidates;
    }

    @Invokable()
    public async disableCandidate(@Param(Candidate) candidate: Candidate) {
        if (candidate.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error("Candidate is already disabled");
        } else {
            candidate.status = TrainingAppLifecycleStatus.Closed;
            await candidate.save();
        }
    }
}