import * as yup from 'yup';
import {ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';

import {AbstractTrainingAsset, TrainingAppLifecycleStatus} from 'common-cc';


export class Candidate extends AbstractTrainingAsset<Candidate> {
    @ReadOnly()
    @Required()
    readonly type = 'io.worldsibu.candidate';

    @Required()
    @Validate(yup.string())
    firstName: string;

    @Required()
    @Validate(yup.string())
    lastName: string;

    public static build(value: {
        id: string, created: number, modified: number, status: TrainingAppLifecycleStatus,
        firstName: string, lastName: string
    }): Candidate {
        let candidate = new Candidate();
        candidate.id = value.id;
        candidate.created = value.created;
        candidate.modified = value.modified;
        candidate.status = value.status;
        candidate.firstName = value.firstName;
        candidate.lastName = value.lastName;
        return candidate;
    }

    /**
     * Check the state of a new Candidate and throws an exception if the state is not valid
     * @param newCandidate
     */
    public static checkNewCandidateState(newCandidate: Candidate) {
        if (newCandidate.status !== TrainingAppLifecycleStatus.Open) {
            throw new Error('new candidate must be in open status');
        }
    }
}
