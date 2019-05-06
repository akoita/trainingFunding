import * as yup from 'yup';
import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Candidate} from './candidate.model';
import {TrainingAppLifecycleStatus} from 'common-cc';
import {CareerAdvisorParticipant} from "participant-cc";

@Controller('candidate')
export class CandidateController extends ConvectorController<ChaincodeTx> {

    @Invokable()
    public async createCandidate(@Param(Candidate) candidate: Candidate) {
        debugger;

        async function preconditions(self: CandidateController) {
            await self.checkThatCallerMatchesCareerAdvisor(candidate.ownerId);
            Candidate.checkNewCandidateState(candidate);
        }
        await preconditions(this);
        await candidate.save();
    }


    @Invokable()
    public async disableCandidate(@Param(yup.string()) candidateId: string) {
        async function preconditions(self: any) {
            const candidate = await Candidate.getOne(candidateId);
            if (!candidate || !candidate.id) {
                throw new Error('no existing candidate found with the id: ' + candidateId)
            }
            if (candidate.status === TrainingAppLifecycleStatus.Closed) {
                throw new Error("Candidate is already disabled");
            }
            await self.checkThatCallerMatchesCareerAdvisor(candidate.ownerId);
            return candidate;
        }

        const candidate = await preconditions(this);
        candidate.status = TrainingAppLifecycleStatus.Closed;
        await candidate.save();
    }

    @Invokable()
    public async getCandidateById(@Param(yup.string())candidateId: string): Promise<Candidate> {
        const candidate = await Candidate.getOne(candidateId);
        if (!candidate || !candidate.id) {
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
    public async searchCandidate(@Param(yup.string())namePart: string
    ):
        Promise<Candidate[]> {
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
        if (Array.isArray(candidates)) {
            return candidates;
        } else {
            return [candidates];
        }
    }


    private async checkThatCallerMatchesCareerAdvisor(participantId: string) {
        const participant = await CareerAdvisorParticipant.getOne(participantId);
        if (!participantId || !participant.id) {
            throw new Error(`no Career advisor participant found with the id ${participantId}`);
        }
        const activeIdentity = participant.findActiveIdentity();
        if (!activeIdentity) {
            throw new Error(`no active identity found for the Career advisor participant with the id ${participantId}`);
        }
        if (this.sender !== activeIdentity.fingerprint) {
            throw new Error(`the transaction caller identity "${this.sender}" does not match Career advisor participant active identity "${activeIdentity.fingerprint}"`);
        }

    }
}