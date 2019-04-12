import * as yup from 'yup';
import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Training, TrainingProcessStatus} from './training.model';
import {Candidate} from "candidate-cc";
import {TrainingOffer} from 'trainingOffer-cc';
import {TrainingAppLifecycleStatus} from "common-cc";


@Controller('training')
export class TrainingController extends ConvectorController<ChaincodeTx> {

    @Invokable()
    public async createTraining(@Param(Training)    training: Training) {
        async function preconditions(self) {
            await self.checkNewTrainingState((training))
        }

        await preconditions(this);
        await training.save();
    }


    @Invokable()
    public async submitTrainingApplication(@Param(yup.string()) trainingId: string) {
        function preconditions() {
            if (existing && existing.id) {
                this.checkThatTrainingIsNotClosed(existing);
                this.checkThatTrainingProcessIsInStatus(existing, TrainingProcessStatus.NotSubmitted);
            } else {
                throw new Error(`no exist training found with the id "${trainingId}"`);
            }
            this.checkThatCandidateIsValid(existing.candidateId);
            this.checkThatTrainingOfferIsValid(existing.trainingOfferId);
        }

        const existing = await Training.getOne(trainingId);
        preconditions();
        existing.trainingProcessStatus = TrainingProcessStatus.Submitted;
        await existing.save();
    }


    @Invokable()
    public async acceptApplication(@Param(Training) training: Training) {
        if (training.trainingProcessStatus !== TrainingProcessStatus.Submitted) {
            throw new Error("training must be in the status Submitted");
        }
        training.trainingProcessStatus = TrainingProcessStatus.Accepted;
        await training.save();
    }

    @Invokable()
    public async fundTraining(@Param(Training) training: Training) {
        if (training.trainingProcessStatus !== TrainingProcessStatus.Accepted) {
            throw new Error("training must be in the status Submitted");
        }
        training.trainingProcessStatus = TrainingProcessStatus.Funded;
        await training.save();
    }

    @Invokable()
    public async startTraining(@Param(Training) training: Training) {
        if (training.trainingProcessStatus !== TrainingProcessStatus.Funded) {
            throw new Error("training must be in the status Funded");
        }
        training.trainingProcessStatus = TrainingProcessStatus.InProgress;
        await training.save();
    }

    @Invokable()
    public async certifyCandidate(@Param(Training) training: Training) {
        if (training.trainingProcessStatus !== TrainingProcessStatus.InProgress) {
            throw new Error("training must be in the status InProgress");
        }
        training.trainingProcessStatus = TrainingProcessStatus.Succeeded;
        await training.save();
    }

    @Invokable()
    public async failCandidate(@Param(Training) training: Training) {
        if (training.trainingProcessStatus !== TrainingProcessStatus.InProgress) {
            throw new Error("training must be in the status InProgress");
        }
        training.trainingProcessStatus = TrainingProcessStatus.Failed;
        await training.save();
    }

    @Invokable()
    public async getCandidateTrainings(@Param(String) namePart: string): Promise<Training[] | Training> {
        const queryObject = {
            "selector": {
                "$or": [{"candidate.firstName": namePart.toString()}, {"candidate.lastName": namePart.toString()}]
            },
            "sort":
                [{"trainingOffer.title": "asc"}]
        };

        const trainings = await Training.query(Training, JSON.stringify(queryObject));
        return trainings;
    }

    @Invokable()
    public async searchTrainingByProcessStatus(@Param(TrainingProcessStatus) trainingProcessStatus: TrainingProcessStatus): Promise<Training[] | Training> {
        const queryObject = {
            "selector": {"trainingProcessStatus": trainingProcessStatus.toString()},
            "sort": [{"trainingOffer.title": "asc"}]
        };
        const trainings = await Training.query(Training, JSON.stringify(queryObject));
        return trainings;
    }

    @Invokable()
    public async closeTraining(@Param(yup.string()) trainingId: string) {
        const existing = await this.checkThatTrainingExistWithId(trainingId);
        this.checkThatTrainingIsNotClosed(existing);
    }

    /**
     * Check the state of a new training and trows an execption if the status if not valid
     * @param training
     */
    private async checkNewTrainingState(training: Training) {
        await this.checkThatTrainingWithIdDoesNotExist(training.id);
        if (training.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error("new Training status can\'t be closed");
        }
        if (training.trainingProcessStatus !== TrainingProcessStatus.NotSubmitted) {
            throw new Error(`new Training process status must be "${TrainingProcessStatus.NotSubmitted}"`);
        }
        const candidate = await Candidate.getOne(training.candidateId);
        if (candidate && candidate.id) {
            if (candidate.status === TrainingAppLifecycleStatus.Closed) {
                throw new Error(`a new training can\'t linked to a closed candidate - closed candidate id: "${candidate.id}"`);
            }
        } else {
            throw new Error(`a new training can't be linked to a non existing candidate with id: "${training.candidateId}"`)
        }
        Candidate.checkNewCandidateState(candidate);
        const trainingOffer = await TrainingOffer.getOne(training.trainingOfferId);
        if (trainingOffer && trainingOffer.id) {
            if (trainingOffer.status === TrainingAppLifecycleStatus.Closed) {
                throw new Error(`a new training can't linked to a closed training offer - closed training offer id: "${trainingOffer.id}"`);
            }
        } else {
            throw new Error(`a new training can't be linked to a non existing training offer with id: "${training.trainingOfferId}"`)
        }

    }


    /**
     * @param trainingID
     *
     * @throws Error if a training exists with the id
     */
    private async checkThatTrainingWithIdDoesNotExist(trainingID: string) {
        const training = await Training.getOne(trainingID);
        if (training && training.id) {
            throw new Error(`found an existing training with the id: "${trainingID}"`);
        }
    }

    private async checkThatTrainingExistWithId(trainingId: string): Promise<Training> {
        const existing = await Training.getOne(trainingId);
        if (existing && existing.id) {
            return existing;
        }
        throw new Error(`no training found with the id "${trainingId}"`);
    }

    private checkThatTrainingIsNotClosed(training: Training) {
        if (training.isClosed()) {
            throw new Error(`the training with the id "${training.id}" is not expected to be closed`);
        }
    }

    private async checkThatTrainingOfferIsValid(trainingOfferId: string) {
        const trainingOffer = await TrainingOffer.getOne(trainingOfferId);
        if (trainingOffer.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error('training offer must not be closed');
        }
    }

    private async checkThatCandidateIsValid(candidateId: string) {
        const candidate = await Candidate.getOne(candidateId);
        if (candidate.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error('candidateId must not be closed');
        }
    }

    private checkThatTrainingProcessIsInStatus(training: Training, expectedStatus: TrainingProcessStatus) {
        if (training.trainingProcessStatus !== expectedStatus) {
            throw new Error(`training must be in the status "${expectedStatus}"`);
        }
    }
}
