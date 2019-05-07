import * as yup from 'yup';

import {Controller, Invokable, Param} from '@worldsibu/convector-core';
import {CareerAdvisorParticipant, InvestorParticipant, TrainingCompanyParticipant} from "./participant.model";
import {AbstractParticipantController} from "./abstractParticipant.controller";

@Controller('careerAdvisor')
export class CareerAdvisorParticipantController extends AbstractParticipantController<CareerAdvisorParticipant> {


    @Invokable()
    public async register(@Param(yup.string())
        participantId: string, @Param(yup.string())
        participantName: string,) {
        await super.register(participantId, participantName);
    }

    @Invokable()
    public async changeIdentity(@Param(yup.string())
        id: string, @Param(yup.string())
        newIdentity: string) {
        await super.changeIdentity(id, newIdentity);
    }

    @Invokable()
    public async getParticipantById(@Param(yup.string())id: string): Promise<CareerAdvisorParticipant> {
        return await this._getParticipantById(id);
    }

    public build(params: { name: string; id: string; msp: any }): CareerAdvisorParticipant {
        return CareerAdvisorParticipant.build(params);
    }

    protected async _getParticipantById(id: string): Promise<CareerAdvisorParticipant> {
        return await CareerAdvisorParticipant.getOne(id);
    }
}

@Controller('trainingCompany')
export class TrainingCompanyParticipantController extends AbstractParticipantController<TrainingCompanyParticipant> {

    @Invokable()
    public async getParticipantById(@Param(yup.string())id: string): Promise<TrainingCompanyParticipant> {
        return this._getParticipantById(id);
    }

    @Invokable()
    public async register(@Param(yup.string())
        participantId: string, @Param(yup.string())
        participantName: string,) {
        await super.register(participantId, participantName);
    }

    @Invokable()
    public async changeIdentity(@Param(yup.string())
        id: string, @Param(yup.string())
        newIdentity: string) {
        await super.changeIdentity(id, newIdentity);
    }

    public build(params: { name: string; id: string; msp: any }): TrainingCompanyParticipant {
        return TrainingCompanyParticipant.build(params);
    }

    protected async _getParticipantById(id: string): Promise<TrainingCompanyParticipant> {
        return await TrainingCompanyParticipant.getOne(id);
    }

}

@Controller('investor')
export class InvestorParticipantController extends AbstractParticipantController<InvestorParticipant> {
    @Invokable()
    public async getParticipantById(@Param(yup.string())id: string): Promise<InvestorParticipant> {
        return await this._getParticipantById(id);
    }


    @Invokable()
    public async register(@Param(yup.string())
        participantId: string, @Param(yup.string())
        participantName: string,) {
        await super.register(participantId, participantName);
    }

    @Invokable()
    public async changeIdentity(@Param(yup.string())
        id: string, @Param(yup.string())
        newIdentity: string) {
        await super.changeIdentity(id, newIdentity);
    }

    public build(params: { name: string; id: string; msp: any }): InvestorParticipant {
        return InvestorParticipant.build(params);
    }

    protected async _getParticipantById(id: string): Promise<InvestorParticipant> {
        return await InvestorParticipant.getOne(id);
    }
}
