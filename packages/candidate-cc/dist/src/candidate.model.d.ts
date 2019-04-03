import { AbstractTrainingAsset, TrainingAppLifecycleStatus } from 'common-cc';
export declare class Candidate extends AbstractTrainingAsset<Candidate> {
    readonly type: string;
    firstName: string;
    lastName: string;
    constructor(object: {
        id: string;
        created: number;
        modified: number;
        status: TrainingAppLifecycleStatus;
        firstName: string;
        lastName: string;
    });
}
