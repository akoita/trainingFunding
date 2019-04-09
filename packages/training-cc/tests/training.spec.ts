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
import {Candidate} from "candidate-cc";
import {TrainingAppLifecycleStatus} from "common-cc";
import {Domain, TrainingOffer, TrainingOfferLevel} from "trainingOffer-cc";

describe('Training', () => {
    chai.use(chaiAsPromised);
    let adapter: MockControllerAdapter;
    let trainingCtrl: ConvectorControllerClient<TrainingController>;

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
        adapter = new MockControllerAdapter();
        trainingCtrl = ClientFactory(TrainingController, adapter);

        await adapter.init([
            {
                version: '*',
                controller: 'TrainingController',
                name: join(__dirname, '..')
            }
        ]);


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
            trainingOffer: blockchainOffer,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: abou
        });
        abouHyperledgerTraining =  Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOffer: hyperledger,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: abou
        });
        abouMicroserviceTraining =  Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOffer: microserviceOffer,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: abou
        });
        abouEngkishTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOffer: englishOffer,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: abou
        });

        itachiBlockchainTraining =  Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOffer: blockchainOffer,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: itachi
        });

        itachiHyperledgerTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOffer: hyperledger,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: itachi
        });
        itachiEngkishTraining  = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOffer: englishOffer,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: itachi
        });

        julieBlockchainTraining = Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOffer: blockchainOffer,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: julie
        });
        julieMicroserviceTraining= Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOffer: microserviceOffer,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: julie
        });
        julieEngkishTraining= Training.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            status: TrainingAppLifecycleStatus.Open,
            trainingOffer: englishOffer,
            trainingProcessStatus: TrainingProcessStatus.NotSubmitted,
            candidate: julie
        });


    });

    it('should create a default model', async () => {
        const modelSample = new Training({
            id: uuid(),
            name: 'Test',
            created: Date.now(),
            modified: Date.now()
        });

        await trainingCtrl.create(modelSample);

        const justSavedModel = await adapter.getById<Training>(modelSample.id);

        expect(justSavedModel.id).to.exist;
    });
});