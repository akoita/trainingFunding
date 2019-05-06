import * as yup from 'yup';

import {BaseStorage, ConvectorController, Param} from '@worldsibu/convector-core';

import {ClientIdentity} from 'fabric-shim';
import {AbstractTrainingParticipantModel, x509Identities} from "./abstractTrainingParticipant.model";
import {TrainingAppLifecycleStatus} from "common-cc/dist/src/abstractTrainingConcept.model";

export abstract class AbstractParticipantController<T extends AbstractTrainingParticipantModel<T>> extends ConvectorController {
    get fullIdentity(): ClientIdentity {
        const stub = (BaseStorage.current as any).stubHelper;
        return new ClientIdentity(stub.getStub());
    };

    protected async register(participantId: string, participantName: string) {
        // Retrieve to see if exists
        const existing = await this._getParticipantById(participantId);
        if (!existing || !existing.id) {
            const participant = this.build({
                                               id: participantId,
                                               name: participantName,
                                               msp: this.fullIdentity.getMSPID(),
                                           }).withCreated(Date.now()).withModified(Date.now()).withStatus(
                TrainingAppLifecycleStatus.Open);
            // Create a new identity
            participant.identities = [x509Identities.build({
                                                               fingerprint: this.sender,
                                                               status: TrainingAppLifecycleStatus.Open
                                                           })];
            await participant.save();
        } else {
            throw new Error(`a participant already exists with the id "${participantId}"`);
        }
    }

    protected async changeIdentity(@Param(yup.string())
        id: string, @Param(yup.string())
        newIdentity: string) {
        // Check permissions
        let isAdmin = this.fullIdentity.getAttributeValue('admin');
        let requesterMSP = this.fullIdentity.getMSPID();

        // Retrieve to see if exists
        const existing = await this._getParticipantById(id);
        if (!existing || !existing.id) {
            throw new Error('No identity exists with that ID');
        }

        if (existing.msp != requesterMSP) {
            throw new Error('Unathorized. MSPs do not match');
        }

        if (!isAdmin) {
            throw new Error('Unathorized. Requester identity is not an admin');
        }

        // Disable previous identities!
        existing.identities = existing.identities.map(identity => {
            identity.status = TrainingAppLifecycleStatus.Closed;
            return identity;
        });

        // Set the enrolling identity
        existing.identities.push(x509Identities.build({
                                                          fingerprint: newIdentity,
                                                          status: TrainingAppLifecycleStatus.Open
                                                      }));
        await existing.save();
    }

    protected abstract async _getParticipantById(id: string): Promise<T>;

    protected abstract build(params: { name: string; id: string; msp: any }): T;
}