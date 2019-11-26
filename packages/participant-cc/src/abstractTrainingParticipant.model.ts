import * as yup from 'yup';
import {ConvectorModel, FlatConvectorModel, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';
import {AbstractTrainingConceptModel, TrainingAppLifecycleStatus} from 'common-cc';


export class X509Identities extends ConvectorModel<X509Identities> {
    @ReadOnly()
    public readonly type = 'io.worldsibu.examples.x509identity';

    @Validate(yup.string())
    @Required()
    fingerprint: string;

    @Required()
    @Validate(yup.string().oneOf(Object.keys(TrainingAppLifecycleStatus).map(k => TrainingAppLifecycleStatus[k])))
    public status: TrainingAppLifecycleStatus;

    public static build(param: { fingerprint: string; status: TrainingAppLifecycleStatus }): X509Identities {
        const x509Identities1 = new X509Identities();
        x509Identities1.fingerprint = param.fingerprint;
        x509Identities1.status = param.status;
        return x509Identities1;
    }
}

// export abstract class AbstractTrainingParticipantModel extends AbstractTrainingAsset<AbstractTrainingParticipantModel> {
export abstract class AbstractTrainingParticipantModel<T extends AbstractTrainingConceptModel<any>> extends AbstractTrainingConceptModel<T> {
    @ReadOnly()
    @Required()
    @Validate(yup.string())
    public name: string;

    @ReadOnly()
    @Validate(yup.string())
    public msp: string;

    @Validate(yup.array(X509Identities.schema()))
    public identities: Array<FlatConvectorModel<X509Identities>>;

    public findActiveIdentity(): FlatConvectorModel<X509Identities> {
        return this.identities.find(identity => identity.status === TrainingAppLifecycleStatus.Open);
    }

}
