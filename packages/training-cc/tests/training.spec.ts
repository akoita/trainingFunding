// tslint:disable:no-unused-expression
import {join} from 'path';
import * as chai from 'chai';
import {expect} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as uuid from 'uuid/v4';
import {MockControllerAdapter} from '@worldsibu/convector-adapter-mock';
import {ClientFactory, ConvectorControllerClient} from '@worldsibu/convector-core';
import 'mocha';

import {Training, TrainingController, TrainingProcessStatus} from '../src';
import {Candidate, CandidateController} from "candidate-cc";
import {TrainingAppLifecycleStatus} from "common-cc";
import {Domain, TrainingOffer, TrainingOfferController, TrainingOfferLevel} from "trainingOffer-cc";

describe('Training', () => {
    chai.use(chaiAsPromised);
    let trainingCtrlAdapter: MockControllerAdapter;
    let candidateCtrlAdapter: MockControllerAdapter;
    let trainingOfferCtrlAdapter: MockControllerAdapter;
    let trainingCtrl: ConvectorControllerClient<TrainingController>;
    let candidateCtrl: ConvectorControllerClient<CandidateController>;
    let trainingOfferCtrl: ConvectorControllerClient<TrainingOfferController>;

    let abouBlockchainTraining: Training;
    let abouHyperledgerTraining: Training;
    let abouMicroserviceTraining: Training;
    let abouEngkishTraining: Training;

    let itachiBlockchainTraining: Training;
    let itachiHyperledgerTraining: Training;
    let itachiEngkishTraining: Training;

    let julieBlockchainTraining: Training;
    let julieMicroserviceTraining: Training;
    let julieEngkishTraining: Training;

    let abou: Candidate;
    let julie: Candidate;
    let itachi: Candidate;

    let blockchainOffer: TrainingOffer;
    let hyperledger: TrainingOffer;
    let microserviceOffer: TrainingOffer;
    let englishOffer: TrainingOffer;


    beforeEach(async () => {
        // Mocks the blockchain execution environment
        // trainingCtrlAdapter = new MockControllerAdapter();
        // trainingCtrl = ClientFactory(TrainingController, trainingCtrlAdapter);
        //
        // candidateCtrlAdapter = new MockControllerAdapter();
        // candidateCtrl = ClientFactory(CandidateController, candidateCtrlAdapter);
        //
        // trainingOfferCtrlAdapter = new MockControllerAdapter();
        // trainingOfferCtrl = ClientFactory(TrainingOfferController, trainingOfferCtrlAdapter);

        trainingCtrlAdapter = new MockControllerAdapter();
        trainingCtrl = ClientFactory(TrainingController, trainingCtrlAdapter);
        candidateCtrl = ClientFactory(CandidateController, trainingCtrlAdapter);
        trainingOfferCtrl = ClientFactory(TrainingOfferController, trainingCtrlAdapter);


        // [
        //     {adapter: trainingCtrlAdapter, name: 'TrainingController', dir: 'training-cc'},
        //     {adapter: candidateCtrlAdapter, name: 'CandidateController', dir: 'candidate-cc'},
        //     {adapter: trainingOfferCtrlAdapter, name: 'TrainingOfferController', dir: 'trainingOffer-cc'}
        // ].forEach(async (adapterAndName) => {
        //
        // });


        await trainingCtrlAdapter.init([
            {
                version: '*',
                controller: TrainingController.name,
                name: join(__dirname, '..', '..', 'training-cc')
            },
            {
                version: '*',
                controller: CandidateController.name,
                name: join(__dirname, '..', '..', 'candidate-cc')
            },
            {
                version: '*',
                controller: TrainingOfferController.name,
                name: join(__dirname, '..', '..', 'trainingOffer-cc')
            }
        ]);

        //
        // [
        //     {adapter: trainingCtrlAdapter, name: 'TrainingController', dir: 'training-cc'},
        //     {adapter: candidateCtrlAdapter, name: 'CandidateController', dir: 'candidate-cc'},
        //     {adapter: trainingOfferCtrlAdapter, name: 'TrainingOfferController', dir: 'trainingOffer-cc'}
        // ].forEach(async (adapterAndName) => {
        //     await adapterAndName.adapter.init([
        //         {
        //             version: '*',
        //             controller: adapterAndName.name,
        //             name: join(__dirname, '..', '..', adapterAndName.dir)
        //         }
        //     ]);
        //
        // });

        abou = Candidate.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Aboubakar',
            lastName: 'Koïta',
            status: TrainingAppLifecycleStatus.Open

        });

        julie = Candidate.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Julie',
            lastName: 'Gayet',
            status: TrainingAppLifecycleStatus.Open

        });

        itachi = Candidate.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Itachi',
            lastName: 'Uchiha',
            status: TrainingAppLifecycleStatus.Open

        });

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


        /**
         * ****************************** Trainings **************************************
         */

        abouBlockchainTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: blockchainOffer.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: abou.id
        });
        abouHyperledgerTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: hyperledger.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: abou.id
        });
        abouMicroserviceTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: microserviceOffer.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: abou.id
        });
        abouEngkishTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: englishOffer.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: abou.id
        });

        itachiBlockchainTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: blockchainOffer.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: itachi.id
        });

        itachiHyperledgerTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: hyperledger.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: itachi.id
        });
        itachiEngkishTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: englishOffer.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: itachi.id
        });

        julieBlockchainTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: blockchainOffer.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: julie.id
        });
        julieMicroserviceTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: microserviceOffer.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: julie.id
        });
        julieEngkishTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOfferId: englishOffer.id,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidateId: julie.id
        });


    });

    it('should create a Training', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const justSavedModel = await Training.getOne(abouBlockchainTraining.id);
        expect(justSavedModel).to.be.deep.eq(abouBlockchainTraining);

    });

    it('should throw an exception when trying to create and existing training', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const justSavedModel = await Training.getOne(abouBlockchainTraining.id);
        expect(justSavedModel).to.be.deep.eq(abouBlockchainTraining);

        await expect(trainingCtrl.createTraining(abouBlockchainTraining).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(`found an existing training with the id: "${abouBlockchainTraining.id}"`);
    });

    it('should throw an exception when trying to create a training linked to a non-existing candidate', async () => {
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        await expect(trainingCtrl.createTraining(abouBlockchainTraining).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `a new training can't be linked to a non existing candidate with id: "${abouBlockchainTraining.candidateId}"`);
    });

    it('should throw an exception when trying to create a training linked to a non-existing offer', async () => {
        await candidateCtrl.createCandidate(abou);
        await expect(trainingCtrl.createTraining(abouBlockchainTraining).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `a new training can't be linked to a non existing training offer with id: "${abouBlockchainTraining.trainingOfferId}"`);
    });

    it('should throw an exception when trying to create a training linked to a closed candidate', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        await candidateCtrl.disableCandidate(abou.id);

        await expect(trainingCtrl.createTraining(abouBlockchainTraining).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `a new training can't linked to a closed candidate - closed candidate id: "${abouBlockchainTraining.candidateId}"`);
    });

    it('should throw an exception when trying to create a training linked to a closed training offer', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);

        await expect(trainingCtrl.createTraining(abouBlockchainTraining).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `a new training can't linked to a closed training offer - closed training offer id: "${abouBlockchainTraining.trainingOfferId}"`);
    });

    it('should submit the training application', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);

        const submitted = await Training.getOne(abouBlockchainTraining.id);

        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

    });

    it('should throw an exception when trying to submit a non existent training application', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        await trainingCtrl.createTraining(abouBlockchainTraining);

        await trainingCtrl.closeTraining(abouBlockchainTraining.id);

        const closed = await Training.getOne(abouBlockchainTraining.id);
        expect(closed.id).to.be.equal(abouBlockchainTraining.id);
        expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `the training with the id "${abouBlockchainTraining.id}" is not expected to be closed`);
    });

    it('should throw an exception when trying to submit a closed  training application', async () => {
        await expect(trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `no existing training found with the id: "${abouBlockchainTraining.id}"`);
    });

    it('should throw an exception when trying to submit a closed training application', async () => {
        await expect(trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `no existing training found with the id: "${abouBlockchainTraining.id}"`);
    });

    it('should throw an exception when trying to submit a training linked to a closed candidate', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        await candidateCtrl.disableCandidate(abou.id);
        const closedCandidate = await Candidate.getOne(abou.id);
        expect(closedCandidate.id).to.be.equal(abou.id);
        expect(closedCandidate.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `can't submit the training application because it it linked to a closed candidate: "${abouBlockchainTraining.candidateId}"`);
    });

    it('should throw an exception when trying to submit the application to a training linked to a closed training offer', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
        const trainingOfferClosed = await TrainingOffer.getOne(blockchainOffer.id);
        expect(trainingOfferClosed.id).to.be.equal(blockchainOffer.id);
        expect(trainingOfferClosed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `can't submit the training application because it it linked to a closed training offer: "${abouBlockchainTraining.trainingOfferId}"`);
    });

});