import { AbstractTrainingAsset } from 'common-cc';
export declare class Candidate extends AbstractTrainingAsset<Candidate> {
    readonly type = "io.worldsibu.candidate";
    firstName: string;
    lastName: string;
}
