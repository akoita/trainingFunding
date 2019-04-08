// tslint:disable:no-unused-expression
import {join} from 'path';
import * as chai from 'chai';
import {expect} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as uuid from 'uuid/v4';
import {MockControllerAdapter} from '@worldsibu/convector-adapter-mock';
import {ClientFactory, ConvectorControllerClient} from '@worldsibu/convector-core';

import {Domain, TrainingOffer, TrainingOfferController, TrainingOfferLevel} from '../src';
import {TrainingAppLifecycleStatus} from "common-cc";

describe('TrainingOffer', () => {
    chai.use(chaiAsPromised);
    let adapter: MockControllerAdapter;
    let trainingOfferCtrl: ConvectorControllerClient<TrainingOfferController>;

    let trainingOffer1: TrainingOffer;
    let trainingOffer2: TrainingOffer;
    let trainingOffer3: TrainingOffer;
    let trainingOffer4: TrainingOffer;

    beforeEach(async () => {
        // Mocks the blockchain execution environment
        adapter = new MockControllerAdapter();
        trainingOfferCtrl = ClientFactory(TrainingOfferController, adapter);

        await adapter.init([
            {
                version: '*',
                controller: 'TrainingOfferController',
                name: join(__dirname, '..')
            }
        ]);

        trainingOffer1 = TrainingOffer.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            title: "Introduction to blockchain",
            description: "An introduction training on blockchain technology",
            domain: Domain.SoftwareDevelopment,
            level: TrainingOfferLevel.Intermediate
        });
    });


    it('should create a Training Offer', async () => {
        await trainingOfferCtrl.createTrainingOffer(trainingOffer1);
        const justSavedModel = await TrainingOffer.getOne(trainingOffer1.id);
        expect(justSavedModel).to.be.deep.eq(trainingOffer1);

        trainingOffer1.status = TrainingAppLifecycleStatus.Closed;
        await expect(trainingOfferCtrl.createTrainingOffer(trainingOffer1).catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal("new Training offer status can\'t be closed");
    });


    it("should close the training offer", async()=>{
        await trainingOfferCtrl.createTrainingOffer(trainingOffer1);

        await trainingOfferCtrl.closeTrainingOffer(trainingOffer1.id);
        const saved = await TrainingOffer.getOne(trainingOffer1.id);
        expect(saved.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingOfferCtrl.closeTrainingOffer(trainingOffer1.id).catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal("training offer's status is already closed");

        await expect(trainingOfferCtrl.closeTrainingOffer("noExistingID").catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal("no existing training offer found with the id: noExistingID");
    });
});