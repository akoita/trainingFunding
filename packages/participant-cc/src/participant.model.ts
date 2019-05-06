import {ReadOnly, Required} from '@worldsibu/convector-core-model';
import {AbstractTrainingParticipantModel} from "./abstractTrainingParticipant.model";
import {TrainingAppLifecycleStatus} from "common-cc";

export class CareerAdvisorParticipant extends AbstractTrainingParticipantModel<CareerAdvisorParticipant> {
    public static readonly type2 = 'io.worldsibu.careerAdvisor';

    @ReadOnly()
    @Required()
    readonly type = CareerAdvisorParticipant.type2;

    static build(params: { name: string; id: string; msp: any }): CareerAdvisorParticipant {
        return <CareerAdvisorParticipant>ParticipantFacory.create(CareerAdvisorParticipant.type2, params);
    }
}

export class TrainingCompanyParticipant extends AbstractTrainingParticipantModel<TrainingCompanyParticipant> {
    public static readonly type2 = 'io.worldsibu.trainingCompany';

    @ReadOnly()
    @Required()
    readonly type = TrainingCompanyParticipant.type2;

    static build(params: { name: string; id: string; msp: any }): TrainingCompanyParticipant {
        return <TrainingCompanyParticipant>ParticipantFacory.create(TrainingCompanyParticipant.type2, params);
    }

}

export class InvestorParticipant extends AbstractTrainingParticipantModel<InvestorParticipant> {
    public static readonly type2 = 'io.worldsibu.investor';

    @ReadOnly()
    @Required()
    readonly type = InvestorParticipant.type2;

    static build(params: { name: string; id: string; msp: any }): InvestorParticipant {
        return <InvestorParticipant>ParticipantFacory.create(InvestorParticipant.type2, params);
    }
}

export class ParticipantFacory {
    public static create(type: string, params: { name: string; id: string; msp: any }): AbstractTrainingParticipantModel<any> {
        let participant: AbstractTrainingParticipantModel<any>;
        if (type === CareerAdvisorParticipant.type2) {
            participant = new CareerAdvisorParticipant();
        } else if (type === TrainingCompanyParticipant.type2) {
            participant = new TrainingCompanyParticipant();
        } else if (type === InvestorParticipant.type2) {
            participant = new InvestorParticipant();
        }
        participant.name = params.name;
        participant.id = params.id;
        participant.msp = params.msp;
        participant.status = TrainingAppLifecycleStatus.Open;
        return participant;
    }
}