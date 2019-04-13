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

    //========================================= Create a training ===================================================//
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

    //================================== Close training===================================================//
    it('should close an existing training', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const justSavedModel = await Training.getOne(abouBlockchainTraining.id);
        expect(justSavedModel).to.be.deep.eq(abouBlockchainTraining);
        expect(justSavedModel.status).to.be.equal(TrainingAppLifecycleStatus.Open);

        const closed = await trainingCtrl.closeTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(closed.id).to.be.equal(abouBlockchainTraining.id);
        expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    });

    it('should throw an exception when trying to close a non existing training', async () => {
        await expect(trainingCtrl.closeTraining(abouBlockchainTraining.id).catch(ex => ex.responses[0].error.message)).to.be.eventually.equal(`cannot close a non existing training with the id: "${abouBlockchainTraining.id}"`);
    });

    it('should thow an exception when trying to close an already closed training', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const justSavedModel = await Training.getOne(abouBlockchainTraining.id);
        expect(justSavedModel).to.be.deep.eq(abouBlockchainTraining);
        expect(justSavedModel.status).to.be.equal(TrainingAppLifecycleStatus.Open);

        const closed = await trainingCtrl.closeTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(closed.id).to.be.equal(abouBlockchainTraining.id);
        expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.closeTraining(abouBlockchainTraining.id).catch(ex => ex.responses[0].error.message)).to.be.eventually.equal(`cannot close an already closed training with the id: "${abouBlockchainTraining.id}"`);

    });


    //================================== Submit training application ===================================================//

    it('should submit the training application', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));

        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);
    });

    it('should throw an exception when trying to submit an application for a closed training', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        await trainingCtrl.createTraining(abouBlockchainTraining);

        const closed = await trainingCtrl.closeTraining(abouBlockchainTraining.id).then(result => new Training(result));
        ;

        expect(closed.id).to.be.equal(abouBlockchainTraining.id);
        expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `the training with the id "${abouBlockchainTraining.id}" is not expected to be closed`);
    });

    it('should throw an exception when trying to submit an application for non existing training', async () => {
        await expect(trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot submit an application for non existing training with the id: "${abouBlockchainTraining.id}"`);
    });


    it('should throw an exception when trying to submit an application for training linked to a closed candidate', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const closedCandidate = await candidateCtrl.disableCandidate(abou.id).then(result => new Candidate(result));
        ;
        expect(closedCandidate.id).to.be.equal(abou.id);
        expect(closedCandidate.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot submit the an application for the training with id: "' + abouBlockchainTraining.id + '" because it' +
            ' is linked to a closed candidate with id: "' + abouBlockchainTraining.candidateId + '"');
    });

    it('should throw an exception when trying to submit an application for a training linked to a closed training offer', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const trainingOfferClosed = await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id).then(result => new TrainingOffer(result));
        ;
        expect(trainingOfferClosed.id).to.be.equal(blockchainOffer.id);
        expect(trainingOfferClosed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot submit the an application for the training with id: "' + abouBlockchainTraining.id + '" because it' +
            ' is linked to a closed training offer with id: "' + abouBlockchainTraining.trainingOfferId + '"');

    });


    //================================== accept a trainig application ===================================================//

    it('should accept a valid training application', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));

        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

    });

    it('should throw an exception when trying to fund a training not submitted', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        await expect(trainingCtrl.acceptApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot start fund training with the id: "' + abouBlockchainTraining.id +
            '" because it\'s process is expected to be "' + TrainingProcessStatus.Submitted +
            '" instead of "' + abouBlockchainTraining.trainingProcessStatus + '"');
    });


    it('should throw an exception when trying to accept an application for a closed training', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        await trainingCtrl.createTraining(abouBlockchainTraining);

        const closed = await trainingCtrl.closeTraining(abouBlockchainTraining.id).then(result => new Training((result)));

        expect(closed.id).to.be.equal(abouBlockchainTraining.id);
        expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.acceptApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot accept an application for a closed training with the id "${abouBlockchainTraining.id}"`);
    });

    it('should throw an exception when trying to accept an application for an non existing training', async () => {
        await expect(trainingCtrl.acceptApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot accept an application for non existing training with the id: "${abouBlockchainTraining.id}"`);
    });


    it('should throw an exception when trying to accept an application for a training linked to a closed candidate', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const closedCandidate = await candidateCtrl.disableCandidate(abou.id).then(result => new Candidate(result));
        expect(closedCandidate.id).to.be.equal(abou.id);
        expect(closedCandidate.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.acceptApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot accept an application for the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed candidate with the id: "' + abouBlockchainTraining.candidateId + '"');
    });

    it('should throw an exception when trying to accept an application for a training linked to a closed training offer', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const closedTrainingOffer = await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id).then(result => new TrainingOffer(result));
        expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
        expect(closedTrainingOffer.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.acceptApplication(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot accept an application for the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed training offer with the id: "' + abouBlockchainTraining.trainingOfferId + '"');
    });


    //================================== fund a training ===================================================//

    it('should fund a valid training', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    });

    it('should throw an exception when trying to fund a training not accepted', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        await expect(trainingCtrl.fundTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot start fund training with the id: "' + abouBlockchainTraining.id +
            '" because it\'s process is expected to be "' + TrainingProcessStatus.Accepted +
            '" instead of "' + abouBlockchainTraining.trainingProcessStatus + '"');
    });


    it('should throw an exception when trying to fund a closed training', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        await trainingCtrl.createTraining(abouBlockchainTraining);

        const closed = await trainingCtrl.closeTraining(abouBlockchainTraining.id).then(result => new Training((result)));

        expect(closed.id).to.be.equal(abouBlockchainTraining.id);
        expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.fundTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot fund a closed training with the id "${abouBlockchainTraining.id}"`);
    });

    it('should throw an exception when trying to fund a non existing training', async () => {
        await expect(trainingCtrl.fundTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot fund a non existing training with the id: "${abouBlockchainTraining.id}"`);
    });


    it('should throw an exception when trying to fund a training linked to a closed candidate', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const closedCandidate = await candidateCtrl.disableCandidate(abou.id).then(result => new Candidate(result));
        expect(closedCandidate.id).to.be.equal(abou.id);
        expect(closedCandidate.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.fundTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot fund the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed candidate with the id: "' + abouBlockchainTraining.candidateId + '"');
    });

    it('should throw an exception when trying to fund a training linked to a closed training offer', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const closedTrainingOffer = await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id).then(result => new TrainingOffer(result));
        expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
        expect(closedTrainingOffer.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.fundTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot fund the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed training offer with the id: "' + abouBlockchainTraining.trainingOfferId + '"');
    });


    //================================== start a training ===================================================//

    it('should start a valid training', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const started = await trainingCtrl.startTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(started.id).to.equal(abouBlockchainTraining.id);
        expect(started.trainingProcessStatus).to.equal(TrainingProcessStatus.InProgress);

    });

    it('should throw an exception when trying to start a closed training', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const closed = await trainingCtrl.closeTraining(abouBlockchainTraining.id).then(result => new Training((result)));
        expect(closed.id).to.be.equal(abouBlockchainTraining.id);
        expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.startTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot start a closed training with the id "${abouBlockchainTraining.id}"`);
    });

    it('should throw an exception when trying to start a training not funded', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        await expect(trainingCtrl.startTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot start the training with the id: "' + abouBlockchainTraining.id +
            '" because it\'s process is expected to be "' + TrainingProcessStatus.Funded + '" instead of "' + abouBlockchainTraining.trainingProcessStatus + '"');
    });

    it('should throw an exception when trying to start anon existing training', async () => {
        await expect(trainingCtrl.startTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot start a non existing training with the id: "${abouBlockchainTraining.id}"`);
    });


    it('should throw an exception when trying to start a training linked to a closed candidate', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const closedCandidate = await candidateCtrl.disableCandidate(abou.id).then(result => new Candidate(result));
        expect(closedCandidate.id).to.be.equal(abou.id);
        expect(closedCandidate.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.startTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot start the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed candidate with the id: "' + abouBlockchainTraining.candidateId + '"');
    });

    it('should throw an exception when trying to start a training linked to a closed training offer', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const closedTrainingOffer = await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id).then(result => new TrainingOffer(result));
        expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
        expect(closedTrainingOffer.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.startTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot start the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed training offer with the id: "' + abouBlockchainTraining.trainingOfferId + '"');
    });


    //================================== certify a training ===================================================//

    it('should certify a valid training', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const started = await trainingCtrl.startTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(started.id).to.equal(abouBlockchainTraining.id);
        expect(started.trainingProcessStatus).to.equal(TrainingProcessStatus.InProgress);

        const certified = await trainingCtrl.certifyTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(certified.id).to.equal(abouBlockchainTraining.id);
        expect(certified.trainingProcessStatus).to.equal(TrainingProcessStatus.Succeeded);

    });

    it('should throw an exception when trying to certify a closed training', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const started = await trainingCtrl.startTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(started.id).to.equal(abouBlockchainTraining.id);
        expect(started.trainingProcessStatus).to.equal(TrainingProcessStatus.InProgress);

        const closed = await trainingCtrl.closeTraining(abouBlockchainTraining.id).then(result => new Training((result)));
        expect(closed.id).to.be.equal(abouBlockchainTraining.id);
        expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.certifyTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot certify a closed training with the id "${abouBlockchainTraining.id}"`);
    });

    it('should throw an exception when trying to certify a training not started', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        await expect(trainingCtrl.certifyTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot certify the training with the id: "' + abouBlockchainTraining.id +
            '" because it\'s process is expected to be "' + TrainingProcessStatus.InProgress + '" instead of "'
            + abouBlockchainTraining.trainingProcessStatus + '"');
    });

    it('should throw an exception when trying to certify a non existing training', async () => {
        await expect(trainingCtrl.certifyTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot certify a non existing training with the id: "${abouBlockchainTraining.id}"`);
    });


    it('should throw an exception when trying to certify a training linked to a closed candidate', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const started = await trainingCtrl.startTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(started.id).to.equal(abouBlockchainTraining.id);
        expect(started.trainingProcessStatus).to.equal(TrainingProcessStatus.InProgress);

        const closedCandidate = await candidateCtrl.disableCandidate(abou.id).then(result => new Candidate(result));
        expect(closedCandidate.id).to.be.equal(abou.id);
        expect(closedCandidate.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.certifyTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot certify the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed candidate with the id: "' + abouBlockchainTraining.candidateId + '"');
    });

    it('should throw an exception when trying to certify  a training linked to a closed training offer', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const started = await trainingCtrl.startTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(started.id).to.equal(abouBlockchainTraining.id);
        expect(started.trainingProcessStatus).to.equal(TrainingProcessStatus.InProgress);

        const closedTrainingOffer = await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id).then(result => new TrainingOffer(result));
        expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
        expect(closedTrainingOffer.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.certifyTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot certify the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed training offer with the id: "' + abouBlockchainTraining.trainingOfferId + '"');
    });


    //================================== fail a training ===================================================//

    it('should fail a valid training', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const started = await trainingCtrl.startTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(started.id).to.equal(abouBlockchainTraining.id);
        expect(started.trainingProcessStatus).to.equal(TrainingProcessStatus.InProgress);

        const certified = await trainingCtrl.failTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(certified.id).to.equal(abouBlockchainTraining.id);
        expect(certified.trainingProcessStatus).to.equal(TrainingProcessStatus.Failed);

    });

    it('should throw an exception when trying to fail a closed training', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const started = await trainingCtrl.startTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(started.id).to.equal(abouBlockchainTraining.id);
        expect(started.trainingProcessStatus).to.equal(TrainingProcessStatus.InProgress);

        const closed = await trainingCtrl.closeTraining(abouBlockchainTraining.id).then(result => new Training((result)));
        expect(closed.id).to.be.equal(abouBlockchainTraining.id);
        expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.failTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot fail a closed training with the id "${abouBlockchainTraining.id}"`);
    });

    it('should throw an exception when trying to fail a training not started', async () => {

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        await expect(trainingCtrl.failTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot fail the training with the id: "' + abouBlockchainTraining.id +
            '" because it\'s process is expected to be "' + TrainingProcessStatus.InProgress + '" instead of "'
            + abouBlockchainTraining.trainingProcessStatus + '"');
    });

    it('should throw an exception when trying to fail a non existing training', async () => {
        await expect(trainingCtrl.failTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            `cannot fail a non existing training with the id: "${abouBlockchainTraining.id}"`);
    });


    it('should throw an exception when trying to fail a training linked to a closed candidate', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const started = await trainingCtrl.startTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(started.id).to.equal(abouBlockchainTraining.id);
        expect(started.trainingProcessStatus).to.equal(TrainingProcessStatus.InProgress);

        const closedCandidate = await candidateCtrl.disableCandidate(abou.id).then(result => new Candidate(result));
        expect(closedCandidate.id).to.be.equal(abou.id);
        expect(closedCandidate.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.failTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot fail the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed candidate with the id: "' + abouBlockchainTraining.candidateId + '"');
    });

    it('should throw an exception when trying to fail  a training linked to a closed training offer', async () => {
        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

        await trainingCtrl.createTraining(abouBlockchainTraining);

        const submitted = await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
        expect(submitted.trainingProcessStatus).to.be.equal(TrainingProcessStatus.Submitted);

        const accepted = await trainingCtrl.acceptApplication(abouBlockchainTraining.id).then(result => new Training(result));
        expect(accepted.id).to.equal(abouBlockchainTraining.id);
        expect(accepted.trainingProcessStatus).to.equal(TrainingProcessStatus.Accepted);

        const funded = await trainingCtrl.fundTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(funded.id).to.equal(abouBlockchainTraining.id);
        expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

        const started = await trainingCtrl.startTraining(abouBlockchainTraining.id).then(result => new Training(result));
        expect(started.id).to.equal(abouBlockchainTraining.id);
        expect(started.trainingProcessStatus).to.equal(TrainingProcessStatus.InProgress);

        const closedTrainingOffer = await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id).then(result => new TrainingOffer(result));
        expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
        expect(closedTrainingOffer.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

        await expect(trainingCtrl.failTraining(abouBlockchainTraining.id).catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'cannot fail the training with the id: "' + abouBlockchainTraining.id + '" because it ' +
            'is linked to a closed training offer with the id: "' + abouBlockchainTraining.trainingOfferId + '"');
    });

    it('should return the trainings linked to the candidates ids provided', async () => {
        const abouTrainings0 = await trainingCtrl.getTrainingsByCandidatesIds([abou.id]);
        expect(abouTrainings0).to.be.empty;

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        await trainingCtrl.createTraining(abouBlockchainTraining);
        const abouTrainings1 = await trainingCtrl.getTrainingsByCandidatesIds([abou.id]).then(result =>
            result.map(training => new Training(training)));
        expect(abouTrainings1).to.have.same.deep.members([abouBlockchainTraining]);

        await trainingOfferCtrl.createTrainingOffer(hyperledger);
        await trainingCtrl.createTraining(abouHyperledgerTraining);
        const abouTrainings2 = await trainingCtrl.getTrainingsByCandidatesIds([abou.id]).then(result =>
            result.map(training => new Training(training)));
        expect(abouTrainings2).to.have.same.deep.members([abouBlockchainTraining, abouHyperledgerTraining]);

        await trainingOfferCtrl.createTrainingOffer(microserviceOffer);
        await trainingCtrl.createTraining(abouMicroserviceTraining);
        const abouTrainings3 = await trainingCtrl.getTrainingsByCandidatesIds([abou.id]).then(result =>
            result.map(training => new Training(training)));
        expect(abouTrainings3).to.have.same.deep.members([abouBlockchainTraining, abouHyperledgerTraining, abouMicroserviceTraining]);

        const julieTrainings0 = await trainingCtrl.getTrainingsByCandidatesIds([julie.id]);
        expect(julieTrainings0).to.be.empty;

        await candidateCtrl.createCandidate(julie);
        await trainingCtrl.createTraining(julieBlockchainTraining);
        const julieTrainings1 = await trainingCtrl.getTrainingsByCandidatesIds([julie.id]).then(result =>
            result.map(training => new Training(training)));
        expect(julieTrainings1).to.have.same.deep.members([julieBlockchainTraining]);

        await trainingCtrl.createTraining(julieMicroserviceTraining);
        const julieTrainings2 = await trainingCtrl.getTrainingsByCandidatesIds([julie.id]).then(result =>
            result.map(training => new Training(training)));
        expect(julieTrainings2).to.have.same.deep.members([julieBlockchainTraining, julieMicroserviceTraining]);

        const julieAndAbouTrainings = await trainingCtrl.getTrainingsByCandidatesIds([julie.id, abou.id]).then(result =>
            result.map(training => new Training(training)));
        expect(julieAndAbouTrainings).to.have.same.deep.members([julieBlockchainTraining, julieMicroserviceTraining, abouBlockchainTraining,
            abouHyperledgerTraining, abouMicroserviceTraining]);

    });

    it('should return the trainings in the process status provided', async () => {
        const trainings0 = await trainingCtrl.getTrainingsByProcessStatus([TrainingProcessStatus.NotSubmitted]);
        expect(trainings0).to.be.empty;

        await candidateCtrl.createCandidate(abou);
        await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
        await trainingCtrl.createTraining(abouBlockchainTraining);
        await expect(trainingCtrl.getTrainingsByProcessStatus([TrainingProcessStatus.NotSubmitted]).then(result =>
            result.map(training => new Training(training)))).to.have.eventually.same.deep.members([abouBlockchainTraining]);
        await expect(trainingCtrl.getTrainingsByProcessStatus([TrainingProcessStatus.Submitted]).then(result =>
            result.map(training => new Training(training)))).to.be.eventually.empty;

        await trainingOfferCtrl.createTrainingOffer(hyperledger);
        await trainingCtrl.createTraining(abouHyperledgerTraining);
        await expect(trainingCtrl.getTrainingsByProcessStatus([TrainingProcessStatus.NotSubmitted]).then(result =>
            result.map(training => new Training(training)))).to.have.eventually.same.deep.members([abouHyperledgerTraining, abouBlockchainTraining]);

        await trainingCtrl.submitTrainingApplication(abouHyperledgerTraining.id);
        await expect(trainingCtrl.getTrainingsByProcessStatus([TrainingProcessStatus.NotSubmitted]).then(result =>
            result.map(training => new Training(training)))).to.have.eventually.same.deep.members([abouBlockchainTraining]);
        await expect(trainingCtrl.getTrainingsByProcessStatus([TrainingProcessStatus.Submitted]).then(result =>
            result.map(training => {
                const converted = new Training(training);
                return [converted.id, converted.trainingProcessStatus];
            }))).to.have.eventually.same.deep.members([[abouHyperledgerTraining.id, TrainingProcessStatus.Submitted]]);
    });

});