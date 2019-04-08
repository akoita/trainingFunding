// tslint:disable:no-unused-expression
import {join} from 'path';
import * as chai from 'chai';
import {expect} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as uuid from 'uuid/v4';
import {MockControllerAdapter} from '@worldsibu/convector-adapter-mock';
import {ClientFactory, ConvectorControllerClient} from '@worldsibu/convector-core';

import {Domain, TrainingOffer, TrainingOfferController, TrainingOfferLevel} from '../src';
import {TrainingAppLifecycleStatus} from 'common-cc';

describe('TrainingOffer', () => {
    chai.use(chaiAsPromised);
    let adapter: MockControllerAdapter;
    let trainingOfferCtrl: ConvectorControllerClient<TrainingOfferController>;

    let blockchainOffer: TrainingOffer;
    let hyperledger: TrainingOffer;
    let microserviceOffer: TrainingOffer;
    let englishOffer: TrainingOffer;

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

        blockchainOffer = TrainingOffer.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            title: "Introduction to blockchain",
            description: "An introduction training on blockchain technology",
            domain: Domain.SoftwareDevelopment,
            level: TrainingOfferLevel.Intermediate
        });
        hyperledger = TrainingOffer.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            title: "Hyperledger Fabric blockchain",
            description: "Mastering Hyperledger Fabric blockchain",
            domain: Domain.SoftwareDevelopment,
            level: TrainingOfferLevel.Intermediate
        });
        microserviceOffer = TrainingOffer.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            title: "Build Microservice architecture",
            description: "Learn what is the microservice architecture, and how to build it",
            domain: Domain.SoftwareDevelopment,
            level: TrainingOfferLevel.Advanced
        });
        englishOffer = TrainingOffer.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            title: "Learning English",
            description: "Basic level in english vocabulary and grammar",
            domain: Domain.General,
            level: TrainingOfferLevel.Intermediate
        });
    });


    it('should create a Training Offer', async () => {
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        const justSavedModel = await TrainingOffer.getOne(blockchainOffer.id);
        expect(justSavedModel).to.be.deep.eq(blockchainOffer);

        blockchainOffer.status = TrainingAppLifecycleStatus.Closed;
        await expect(trainingOfferCtrl.createTrainingOffer(blockchainOffer).catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal("new Training offer status can\'t be closed");
    });


    it("should close the training offer", async () => {
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
        const saved = await TrainingOffer.getOne(blockchainOffer.id);
        expect(saved.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id).catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal("training offer's status is already closed");

        await expect(trainingOfferCtrl.closeTrainingOffer("noExistingID").catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal("no existing training offer found with the id: noExistingID");
    });


    it("should return all training offers", async () => {
        await expect(trainingOfferCtrl.listTrainingOffers()).to.be.empty;

        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        const allData = await trainingOfferCtrl.listTrainingOffers().then(models => models.map(model => {
            return new TrainingOffer(model)
        }));
        expect(allData).to.have.same.deep.members([blockchainOffer]);

        await trainingOfferCtrl.createTrainingOffer(microserviceOffer);
        const allData2 = await trainingOfferCtrl.listTrainingOffers().then(models => models.map(model => {
            return new TrainingOffer(model)
        }));
        expect(allData2).to.have.same.deep.members([blockchainOffer, microserviceOffer]);

        await trainingOfferCtrl.createTrainingOffer(englishOffer);
        const allData3 = await trainingOfferCtrl.listTrainingOffers().then(models => models.map(model => {
            return new TrainingOffer(model)
        }));
        expect(allData3).to.have.same.deep.members([blockchainOffer, microserviceOffer, englishOffer]);
    });


    it("should search the training offers by title or description", async () => {
        let result = await trainingOfferCtrl.searchTrainingOffersByTitleAndDescription("blockchain");
        if (Array.isArray(result)) {
            expect(result).to.be.empty;
        }

        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        result = await trainingOfferCtrl.searchTrainingOffersByTitleAndDescription("blockchain");
        if (Array.isArray(result)) {
            expect(result.map(model => {
                return new TrainingOffer(model)
            })).to.have.same.deep.members([blockchainOffer]);
        }

        await trainingOfferCtrl.createTrainingOffer(hyperledger);
        result = await trainingOfferCtrl.searchTrainingOffersByTitleAndDescription("blockchain");
        if (Array.isArray(result)) {
            expect(result.map(model => {
                return new TrainingOffer(model)
            })).to.have.same.deep.members([blockchainOffer, hyperledger]);
        }

        await trainingOfferCtrl.createTrainingOffer(microserviceOffer);
        result = await trainingOfferCtrl.searchTrainingOffersByTitleAndDescription("Microservice");
        if (Array.isArray(result)) {
            expect(result.map(model => {
                return new TrainingOffer(model)
            })).to.have.same.deep.members([microserviceOffer]);
        }

        result = await trainingOfferCtrl.searchTrainingOffersByTitleAndDescription("General");
        if (Array.isArray(result)) {
            expect(result).to.be.empty;
        }

        await trainingOfferCtrl.createTrainingOffer(englishOffer);
        result = await trainingOfferCtrl.searchTrainingOffersByTitleAndDescription("english");
        if (Array.isArray(result)) {
            expect(result.map(model => {
                return new TrainingOffer(model)
            })).to.have.same.deep.members([englishOffer]);
        }
    });


    it("should search the training offers by domain", async () =>{
        let result = await trainingOfferCtrl.searchTrainingOffersByDomain(Domain.General);
        if(Array.isArray(result)){
            expect(result.map(model => { return model})).to.be.empty;
        }

        await trainingOfferCtrl.createTrainingOffer(englishOffer);
        result = await trainingOfferCtrl.searchTrainingOffersByDomain(Domain.General);
        if(Array.isArray(result)){
            expect(result.map(model => {return new TrainingOffer(model)})).to.have.same.deep.members([englishOffer]);
        }

        result = await trainingOfferCtrl.searchTrainingOffersByDomain(Domain.SoftwareDevelopment);
        if(Array.isArray(result)){
            expect(result.map(model => { return new TrainingOffer(model)})).to.be.empty;
        }

        await trainingOfferCtrl.createTrainingOffer(microserviceOffer);
        result = await trainingOfferCtrl.searchTrainingOffersByDomain(Domain.SoftwareDevelopment);
        if(Array.isArray(result)){
            expect(result.map(model => { return new TrainingOffer(model)})).to.have.same.deep.members([microserviceOffer]);
        }

        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        result = await trainingOfferCtrl.searchTrainingOffersByDomain(Domain.SoftwareDevelopment);
        if(Array.isArray(result)){
            expect(result.map(model => { return new TrainingOffer(model)})).to.have.same.deep.members([blockchainOffer,microserviceOffer]);
        }

    });

});