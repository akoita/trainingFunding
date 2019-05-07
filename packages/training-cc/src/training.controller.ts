import * as yup from "yup";
import {ChaincodeTx} from "@worldsibu/convector-platform-fabric";
import {Controller, ConvectorController, Invokable, Param} from "@worldsibu/convector-core";

import {Training, TrainingProcessStatus} from "./training.model";
import {Candidate} from "candidate-cc";
import {TrainingOffer} from "trainingOffer-cc";
import {
    AbstractTrainingParticipantModel,
    CareerAdvisorParticipant,
    InvestorParticipant,
    TrainingCompanyParticipant
} from "participant-cc";
import {TrainingAppLifecycleStatus} from "common-cc/dist/src/abstractTrainingConcept.model";

export interface TrainingParams {
    id: string;
    ownerId: string;
    trainingOfferId: string;
    candidateId: string;
}

const trainingParamsYupSchema = () =>
    yup.object().shape({
        id: yup.string(),
        ownerId: yup.string(),
        trainingOfferId: yup.string(),
        candidateId: yup.string()
    });

@Controller("training")
export class TrainingController extends ConvectorController<ChaincodeTx> {
    @Invokable()
    public async createTraining(
        @Param(trainingParamsYupSchema()) params: TrainingParams
    ) {
        async function preconditions(self: TrainingController) {
            await self.checkNewTrainingParameters(params);
        }

        await preconditions(this);
        const currentTimestamp = Date.now();
        await new Training(params.id)
            .withCandidateId(params.candidateId)
            .withTrainingOfferId(params.trainingOfferId)
            .withOwnerId(params.ownerId)
            .withTrainingProcessStatus(TrainingProcessStatus.NotSubmitted)
            .withStatus(TrainingAppLifecycleStatus.Open)
            .save();
    }

    @Invokable()
    public async getTrainingById(
        @Param(yup.string()) trainingId: string
    ): Promise<Training> {
        const training = await Training.getOne(trainingId);
        if (!training || !training.id) {
            throw new Error(`no training found with the id: "${trainingId}"`);
        }
        return training;
    }

    @Invokable()
    public async submitTrainingApplication(
        @Param(yup.string()) trainingId: string
    ) {
        async function preconditions(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(
                trainingId,
                `cannot submit an application for non existing training with the id: "${trainingId}"`
            );
            self.checkThatCallerMatchesCareerAdvisor(existing.ownerId);
            await self.checkThatTrainingIsNotClosed(existing);
            await self.checkThatTrainingProcessIsInStatus(
                existing,
                TrainingProcessStatus.NotSubmitted
            );
            await self.checkThatCandidateIsValid(
                existing.candidateId,
                'cannot submit an application for the training with id: "' +
                existing.id +
                '" because it' +
                ' is linked to a closed candidate with id: "' +
                existing.candidateId +
                '"'
            );
            await self.checkThatTrainingOfferIsValid(
                existing.trainingOfferId,
                'cannot submit an application for the training with id: "' +
                existing.id +
                '" because it' +
                ' is linked to a closed training offer with id: "' +
                existing.trainingOfferId +
                '"'
            );

            return existing;
        }

        const training = await preconditions(this);
        training.trainingProcessStatus = TrainingProcessStatus.Submitted;
        await training.save();
    }

    @Invokable()
    public async acceptApplication(
        @Param(yup.string()) trainingId: string,
        @Param(yup.string()) trainingCompanyId: string
    ) {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(
                trainingId,
                `cannot accept an application for non existing training with the id: "${trainingId}"`
            );
            self.checkThatCallerMatchesTraningCompany(trainingCompanyId);
            await self.checkThatTrainingIsNotClosed(
                existing,
                `cannot accept an application for a closed training with the id "${trainingId}"`
            );
            await self.checkThatTrainingProcessIsInStatus(
                existing,
                TrainingProcessStatus.Submitted,
                'cannot start fund training with the id: "' +
                existing.id +
                '" because it\'s process is expected to be "' +
                TrainingProcessStatus.Submitted +
                '" instead of "' +
                existing.trainingProcessStatus +
                '"'
            );

            await self.checkThatCandidateIsValid(
                existing.candidateId,
                'cannot accept an application for the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed candidate with the id: "' +
                existing.candidateId +
                '"'
            );
            await self.checkThatTrainingOfferIsValid(
                existing.trainingOfferId,
                'cannot accept an application for the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed training offer with the id: "' +
                existing.trainingOfferId +
                '"'
            );
            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.Accepted;
        training.trainingCompanyId = trainingCompanyId;
        await training.save();
    }

    @Invokable()
    public async fundTraining(
        @Param(yup.string()) trainingId: string,
        @Param(yup.string()) investorID: string
    ) {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(
                trainingId,
                `cannot fund a non existing training with the id: "${trainingId}"`
            );
            await self.checkThatCallerMatchesInvestor(investorID);
            await self.checkThatTrainingIsNotClosed(
                existing,
                `cannot fund a closed training with the id "${trainingId}"`
            );
            await self.checkThatTrainingProcessIsInStatus(
                existing,
                TrainingProcessStatus.Accepted,
                'cannot start fund training with the id: "' +
                existing.id +
                '" because it\'s process is expected to be "' +
                TrainingProcessStatus.Accepted +
                '" instead of "' +
                existing.trainingProcessStatus +
                '"'
            );
            await self.checkThatCandidateIsValid(
                existing.candidateId,
                'cannot fund the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed candidate with the id: "' +
                existing.candidateId +
                '"'
            );
            await self.checkThatTrainingOfferIsValid(
                existing.trainingOfferId,
                'cannot fund the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed training offer with the id: "' +
                existing.trainingOfferId +
                '"'
            );
            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.Funded;
        training.investorId = investorID;
        await training.save();
    }

    @Invokable()
    public async startTraining(@Param(yup.string()) trainingId: string) {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(
                trainingId,
                `cannot start a non existing training with the id: "${trainingId}"`
            );
            self.checkThatCallerMatchesTraningCompany(existing.trainingCompanyId);
            await self.checkThatTrainingIsNotClosed(
                existing,
                `cannot start a closed training with the id "${trainingId}"`
            );
            await self.checkThatTrainingProcessIsInStatus(
                existing,
                TrainingProcessStatus.Funded,
                'cannot start the training with the id: "' +
                existing.id +
                '" because it\'s process is expected to be "' +
                TrainingProcessStatus.Funded +
                '" instead of "' +
                existing.trainingProcessStatus +
                '"'
            );

            await self.checkThatCandidateIsValid(
                existing.candidateId,
                'cannot start the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed candidate with the id: "' +
                existing.candidateId +
                '"'
            );
            await self.checkThatTrainingOfferIsValid(
                existing.trainingOfferId,
                'cannot start the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed training offer with the id: "' +
                existing.trainingOfferId +
                '"'
            );
            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.InProgress;
        await training.save();
    }

    @Invokable()
    public async certifyTraining(@Param(yup.string()) trainingId: string) {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(
                trainingId,
                `cannot certify a non existing training with the id: "${trainingId}"`
            );
            await self.checkThatTrainingIsNotClosed(
                existing,
                `cannot certify a closed training with the id "${trainingId}"`
            );
            await self.checkThatTrainingProcessIsInStatus(
                existing,
                TrainingProcessStatus.InProgress,
                'cannot certify the training with the id: "' +
                existing.id +
                '" because it\'s process is expected to be "' +
                TrainingProcessStatus.InProgress +
                '" instead of "' +
                existing.trainingProcessStatus +
                '"'
            );
            await self.checkThatCandidateIsValid(
                existing.candidateId,
                'cannot certify the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed candidate with the id: "' +
                existing.candidateId +
                '"'
            );
            await self.checkThatTrainingOfferIsValid(
                existing.trainingOfferId,
                'cannot certify the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed training offer with the id: "' +
                existing.trainingOfferId +
                '"'
            );
            await self.checkThatCallerMatchesTraningCompany(existing.trainingCompanyId);
            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.Succeeded;
        await training.save();
    }

    @Invokable()
    public async failTraining(@Param(yup.string()) trainingId: string) {
        async function precondition(self: TrainingController): Promise<Training> {
            const existing = await self.checkThatTrainingExistWithId(
                trainingId,
                `cannot fail a non existing training with the id: "${trainingId}"`
            );
            await self.checkThatTrainingIsNotClosed(
                existing,
                `cannot fail a closed training with the id "${trainingId}"`
            );
            await self.checkThatTrainingProcessIsInStatus(
                existing,
                TrainingProcessStatus.InProgress,
                'cannot fail the training with the id: "' +
                existing.id +
                '" because it\'s process is expected to be "' +
                TrainingProcessStatus.InProgress +
                '" instead of "' +
                existing.trainingProcessStatus +
                '"'
            );
            await self.checkThatCandidateIsValid(
                existing.candidateId,
                'cannot fail the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed candidate with the id: "' +
                existing.candidateId +
                '"'
            );
            await self.checkThatTrainingOfferIsValid(
                existing.trainingOfferId,
                'cannot fail the training with the id: "' +
                existing.id +
                '" because it ' +
                'is linked to a closed training offer with the id: "' +
                existing.trainingOfferId +
                '"'
            );
            await self.checkThatCallerMatchesTraningCompany(existing.trainingCompanyId);
            return existing;
        }

        const training = await precondition(this);
        training.trainingProcessStatus = TrainingProcessStatus.Failed;
        await training.save();
    }

    @Invokable()
    public async closeTraining(@Param(yup.string()) trainingId: string) {
        async function preconditions(self: TrainingController) {
            let existing = await self.checkThatTrainingExistWithId(
                trainingId,
                `cannot close a non existing training with the id: "${trainingId}"`
            );
            await self.checkThatCallerMatchesCareerAdvisor(existing.ownerId);
            await self.checkThatTrainingIsNotClosed(
                existing,
                `cannot close an already closed training with the id: "${trainingId}"`
            );
            return existing;
        }

        const existing = await preconditions(this);
        existing.status = TrainingAppLifecycleStatus.Closed;
        await existing.save();
    }

    @Invokable()
    public async getTrainingsByCandidatesIds(
        @Param(yup.array(yup.string())) candidatesIds: string[]
    ): Promise<Training[]> {
        const queryObject = {
            selector: {
                $and: [
                    {type: Training.staticType},
                    {candidateId: {$in: candidatesIds}}
                ]
            },
            sort: [{id: "asc"}]
        };
        const trainings = await Training.query(
            Training,
            JSON.stringify(queryObject)
        );
        if (Array.isArray(trainings)) {
            return trainings;
        } else {
            return [trainings];
        }
    }

    @Invokable()
    public async getTrainingsByProcessStatus(
        @Param(
            yup.array(
                yup
                    .string()
                    .oneOf(
                        Object.keys(TrainingProcessStatus).map(
                            k => TrainingProcessStatus[k]
                        )
                    )
            )
        )
            trainingProcessStatus: TrainingProcessStatus[]
    ): Promise<Training[]> {
        const queryObject = {
            selector: {
                $and: [
                    {type: Training.staticType},
                    {trainingProcessStatus: {$in: trainingProcessStatus}}
                ]
            },
            sort: [{id: "asc"}]
        };
        const trainings = await Training.query(
            Training,
            JSON.stringify(queryObject)
        );
        if (Array.isArray(trainings)) {
            return trainings;
        } else {
            return [trainings];
        }
    }

    /**
     * Check the parameters for a new training and trows an exception if there is an inconsistency
     * @param training
     */
    private async checkNewTrainingParameters(trainingParams: TrainingParams) {
        await this.checkThatTrainingWithIdDoesNotExist(trainingParams.id);
        await this.checkThatCallerMatchesCareerAdvisor(trainingParams.ownerId);
        const candidate = await Candidate.getOne(trainingParams.candidateId);
        if (candidate && candidate.id) {
            if (candidate.status === TrainingAppLifecycleStatus.Closed) {
                throw new Error(
                    `a new training can\'t linked to a closed candidate - closed candidate id: "${
                        candidate.id
                        }"`
                );
            }
        } else {
            throw new Error(
                `a new training can't be linked to a non existing candidate with id: "${
                    trainingParams.candidateId
                    }"`
            );
        }
        const trainingOffer = await TrainingOffer.getOne(
            trainingParams.trainingOfferId
        );
        if (trainingOffer && trainingOffer.id) {
            if (trainingOffer.status === TrainingAppLifecycleStatus.Closed) {
                throw new Error(
                    `a new training can't linked to a closed training offer - closed training offer id: "${
                        trainingOffer.id
                        }"`
                );
            }
        } else {
            throw new Error(
                `a new training can't be linked to a non existing training offer with id: "${
                    trainingParams.trainingOfferId
                    }"`
            );
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
            throw new Error(
                `found an existing training with the id: "${trainingID}"`
            );
        }
    }

    private async checkThatTrainingExistWithId(
        trainingId: string,
        errorMessage: string = `no existing training found with the id: "${trainingId}"`
    ): Promise<Training> {
        const existing = await Training.getOne(trainingId);
        if (existing && existing.id) {
            return existing;
        }
        throw new Error(errorMessage);
    }

    private checkThatTrainingIsNotClosed(
        training: Training,
        errorMessage: string = `the training with the id "${
            training.id
            }" is not expected to be closed`
    ) {
        if (training.isClosed()) {
            throw new Error(errorMessage);
        }
    }

    private async checkThatTrainingOfferIsValid(
        trainingOfferId: string,
        errorMessage: string
    ) {
        const trainingOffer = await TrainingOffer.getOne(trainingOfferId);
        if (trainingOffer.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error(errorMessage);
        }
    }

    private async checkThatCandidateIsValid(
        candidateId: string,
        errorMesgae: string
    ) {
        const candidate = await Candidate.getOne(candidateId);
        if (candidate.status === TrainingAppLifecycleStatus.Closed) {
            throw new Error(errorMesgae);
        }
    }

    private checkThatTrainingProcessIsInStatus(
        training: Training,
        expectedStatus: TrainingProcessStatus,
        errorMessage: string = `training must be in the status "${expectedStatus}"`
    ) {
        if (training.trainingProcessStatus !== expectedStatus) {
            throw new Error(errorMessage);
        }
    }

    private async checkThatCallerMatchesCareerAdvisor(careerAdvisorId: string) {
        const participant = await CareerAdvisorParticipant.getOne(careerAdvisorId);
        await this.checkThatCallerMatchesParticipant(
            participant,
            careerAdvisorId,
            "Career advisor"
        );
    }

    private async checkThatCallerMatchesTraningCompany(
        trainingCompanyId: string
    ) {
        const participant = await TrainingCompanyParticipant.getOne(
            trainingCompanyId
        );
        this.checkThatCallerMatchesParticipant(
            participant,
            trainingCompanyId,
            "Training company"
        );
    }

    private async checkThatCallerMatchesInvestor(investorID: string) {
        const participant = await InvestorParticipant.getOne(investorID);
        this.checkThatCallerMatchesParticipant(participant, investorID, "Investor");
    }

    private async checkThatCallerMatchesParticipant(
        participant: AbstractTrainingParticipantModel<any>,
        participantId: string,
        participantTitle = `Training company`
    ) {
        if (!participant || !participant.id) {
            throw new Error(
                `no ${participantTitle} participant found with the id ${participantId}`
            );
        }
        const activeIdentity = participant.findActiveIdentity();
        if (!activeIdentity) {
            throw new Error(
                `no active identity found for the ${participantTitle} participant with the id ${participantId}`
            );
        }
        if (this.sender !== activeIdentity.fingerprint) {
            throw new Error(
                `the transaction caller identity "${
                    this.sender
                    }" does not match ${participantTitle} participant active identity "${
                    activeIdentity.fingerprint
                    }"`
            );
        }
    }
}
