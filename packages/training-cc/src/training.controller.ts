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
        async function preconditions(self: any) {
            await self.checkNewTrainingState((training))
        }

        await preconditions(this);
        await training.save();
    }


    @Invokable()
    public async submitTrainingApplication(@Param(yup.string()) trainingId: string): Promise<Training> {
        async function preconditions(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(trainingId, `cannot submit an application for non existing training with the id: "${trainingId}"`);
            await self.checkThatTrainingIsNotClosed(existing);
            await self.checkThatTrainingProcessIsInStatus(existing, TrainingProcessStatus.NotSubmitted);
            await self.checkThatCandidateIsValid(existing.candidateId,
                'cannot submit the an application for the training with id: "' + existing.id + '" because it' +
                ' is linked to a closed candidate with id: "' + existing.candidateId + '"');
            await self.checkThatTrainingOfferIsValid(existing.trainingOfferId,
                'cannot submit the an application for the training with id: "' + existing.id + '" because it' +
                ' is linked to a closed training offer with id: "' + existing.trainingOfferId + '"');

            return existing;
        }

        const training = await preconditions(this);
        training.trainingProcessStatus = TrainingProcessStatus.Submitted;
        await training.save();
        return await Training.getOne(trainingId);

    }


    @Invokable()
    public async acceptApplication(@Param(yup.string()) trainingId: string): Promise<Training> {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(trainingId,
                `cannot accept an application for non existing training with the id: "${trainingId}"`);
            await self.checkThatTrainingIsNotClosed(existing,
                `cannot accept an application for a closed training with the id "${trainingId}"`);
            await self.checkThatTrainingProcessIsInStatus(existing, TrainingProcessStatus.Submitted,
                'cannot start fund training with the id: "' + existing.id +
                '" because it\'s process is expected to be "' + TrainingProcessStatus.Submitted +
                '" instead of "' + existing.trainingProcessStatus + '"');

            await self.checkThatCandidateIsValid(existing.candidateId,
                'cannot accept an application for the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed candidate with the id: "' + existing.candidateId + '"');
            await self.checkThatTrainingOfferIsValid(existing.trainingOfferId,
                'cannot accept an application for the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed training offer with the id: "' + existing.trainingOfferId + '"');

            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.Accepted;
        await training.save();
        return await Training.getOne(trainingId);
    }

    @Invokable()
    public async fundTraining(@Param(yup.string())trainingId: string): Promise<Training> {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(trainingId,
                `cannot fund a non existing training with the id: "${trainingId}"`);
            await self.checkThatTrainingIsNotClosed(existing,
                `cannot fund a closed training with the id "${trainingId}"`);
            await self.checkThatTrainingProcessIsInStatus(existing, TrainingProcessStatus.Accepted,
                'cannot start fund training with the id: "' + existing.id +
                '" because it\'s process is expected to be "' + TrainingProcessStatus.Accepted +
                '" instead of "' + existing.trainingProcessStatus + '"');
            await self.checkThatCandidateIsValid(existing.candidateId,
                'cannot fund the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed candidate with the id: "' + existing.candidateId + '"');
            await self.checkThatTrainingOfferIsValid(existing.trainingOfferId,
                'cannot fund the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed training offer with the id: "' + existing.trainingOfferId + '"');
            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.Funded;
        await training.save();
        return await Training.getOne(trainingId);
    }

    @Invokable()
    public async startTraining(@Param(yup.string()) trainingId: string): Promise<Training> {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(trainingId,
                `cannot start a non existing training with the id: "${trainingId}"`);
            await self.checkThatTrainingIsNotClosed(existing,
                `cannot start a closed training with the id "${trainingId}"`);
            await self.checkThatTrainingProcessIsInStatus(existing, TrainingProcessStatus.Funded,
                'cannot start the training with the id: "' + existing.id +
                '" because it\'s process is expected to be "' + TrainingProcessStatus.Funded + '" instead of "'
                + existing.trainingProcessStatus + '"');

            await self.checkThatCandidateIsValid(existing.candidateId,
                'cannot start the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed candidate with the id: "' + existing.candidateId + '"');
            await self.checkThatTrainingOfferIsValid(existing.trainingOfferId,
                'cannot start the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed training offer with the id: "' + existing.trainingOfferId + '"');
            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.InProgress;
        await training.save();
        return await Training.getOne(trainingId);
    }

    @Invokable()
    public async certifyTraining(@Param(yup.string()) trainingId: string): Promise<Training> {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(trainingId,
                `cannot certify a non existing training with the id: "${trainingId}"`);
            await self.checkThatTrainingIsNotClosed(existing,
                `cannot certify a closed training with the id "${trainingId}"`);
            await self.checkThatTrainingProcessIsInStatus(existing, TrainingProcessStatus.InProgress,
                'cannot certify the training with the id: "' + existing.id +
                '" because it\'s process is expected to be "' + TrainingProcessStatus.InProgress + '" instead of "'
                + existing.trainingProcessStatus + '"');
            await self.checkThatCandidateIsValid(existing.candidateId,
                'cannot certify the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed candidate with the id: "' + existing.candidateId + '"');
            await self.checkThatTrainingOfferIsValid(existing.trainingOfferId,
                'cannot certify the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed training offer with the id: "' + existing.trainingOfferId + '"');
            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.Succeeded;
        await training.save();
        return await Training.getOne(trainingId);
    }

    @Invokable()
    public async failTraining(@Param(yup.string()) trainingId: string): Promise<Training> {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(trainingId,
                `cannot fail a non existing training with the id: "${trainingId}"`);
            await self.checkThatTrainingIsNotClosed(existing,
                `cannot fail a closed training with the id "${trainingId}"`);
            await self.checkThatTrainingProcessIsInStatus(existing, TrainingProcessStatus.InProgress,
                'cannot fail the training with the id: "' + existing.id +
                '" because it\'s process is expected to be "' + TrainingProcessStatus.InProgress + '" instead of "'
                + existing.trainingProcessStatus + '"');
            await self.checkThatCandidateIsValid(existing.candidateId,
                'cannot fail the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed candidate with the id: "' + existing.candidateId + '"');
            await self.checkThatTrainingOfferIsValid(existing.trainingOfferId,
                'cannot fail the training with the id: "' + existing.id + '" because it ' +
                'is linked to a closed training offer with the id: "' + existing.trainingOfferId + '"');
            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.Failed;
        await training.save();
        return await Training.getOne(trainingId);
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
    public async closeTraining(@Param(yup.string()) trainingId: string): Promise<Training> {
        let existing = await this.checkThatTrainingExistWithId(trainingId);
        this.checkThatTrainingIsNotClosed(existing);
        existing.status = TrainingAppLifecycleStatus.Closed;
        await existing.save();
        return Training.getOne(trainingId);
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

    private async checkThatTrainingExistWithId(trainingId: string, errorMessage: string = `no existing training found with the id: "${trainingId}"`): Promise<Training> {
        const existing = await Training.getOne(trainingId);
        if (existing && existing.id) {
            return existing;
        }
        throw new Error(errorMessage);
    }

    private checkThatTrainingIsNotClosed(training: Training,
                                         errorMessage: string = `the training with the id "${training.id}" is not expected to be closed`) {
        if (training.isClosed()) {
            throw new Error(errorMessage);
        }
    }

    private async checkThatTrainingOfferIsValid(trainingOfferId: string, errorMessage: string) {
        const trainingOffer = await TrainingOffer.getOne(trainingOfferId);
        if (trainingOffer.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error(errorMessage);
        }
    }

    private async checkThatCandidateIsValid(candidateId: string, errorMesgae: string) {
        const candidate = await Candidate.getOne(candidateId);
        if (candidate.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error(errorMesgae);
        }
    }

    private checkThatTrainingProcessIsInStatus(training: Training, expectedStatus: TrainingProcessStatus,
                                               errorMessage: string = `training must be in the status "${expectedStatus}"`) {
        if (training.trainingProcessStatus !== expectedStatus) {
            throw new Error(errorMessage);
        }
    }
}
