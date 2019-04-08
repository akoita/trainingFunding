// tslint:disable:no-unused-expression
import {join} from 'path';
import * as chai from 'chai';
import {expect} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as uuid from 'uuid/v4';
import {MockControllerAdapter} from '@worldsibu/convector-adapter-mock';
import {ClientFactory, ConvectorControllerClient} from '@worldsibu/convector-core';
import 'mocha';

import {Candidate, CandidateController} from '../src';
import {TrainingAppLifecycleStatus} from 'common-cc';

describe('Candidate', () => {
    chai.use(chaiAsPromised);
    let adapter: MockControllerAdapter;
    let candidateCtrl: ConvectorControllerClient<CandidateController>;

    beforeEach(async () => {
        // Mocks the blockchain execution environment
        adapter = new MockControllerAdapter();
        candidateCtrl = ClientFactory(CandidateController, adapter);

        await adapter.init([
            {
                version: '*',
                controller: 'CandidateController',
                name: join(__dirname, '..')
            }
        ]);
    });


    it('should create a default model', async () => {
        const modelSample = new Candidate();
        modelSample.id = uuid(),
            modelSample.created = Date.now();
        modelSample.modified = Date.now();
        modelSample.firstName = 'Aboubakar';
        modelSample.lastName = 'Koïta';
        modelSample.status = TrainingAppLifecycleStatus.Open;

        await candidateCtrl.createCandidate(modelSample);

        const justSavedModel = await adapter.getById<Candidate>(modelSample.id);

        expect(justSavedModel.id).to.equal(modelSample.id);
        expect(justSavedModel.created).to.equal(modelSample.created);
        expect(justSavedModel.modified).to.equal(modelSample.modified);
        expect(justSavedModel.firstName).to.equal(modelSample.firstName);
        expect(justSavedModel.lastName).to.equal(modelSample.lastName);
        expect(justSavedModel.status).to.equal(modelSample.status);

    });

    it('should fail to create a candidate with closed status', async () => {
        const modelSample = new Candidate();
        modelSample.id = uuid(),
            modelSample.created = Date.now();
        modelSample.modified = Date.now();
        modelSample.firstName = 'Aboubakar';
        modelSample.lastName = 'Koïta';
        modelSample.status = TrainingAppLifecycleStatus.Closed;

        await expect(candidateCtrl.createCandidate(modelSample).catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal('new candidate must be in open status');

    });


    it('should get the list of all candidates', async () => {
        const modelSample1 = new Candidate();
        modelSample1.id = uuid();
        modelSample1.created = Date.now();
        modelSample1.modified = Date.now();
        modelSample1.firstName = 'Aboubakar';
        modelSample1.lastName = 'Koïta';
        modelSample1.status = TrainingAppLifecycleStatus.Open;

        const modelSample2 = new Candidate();
        modelSample2.id = uuid();
        modelSample2.created = Date.now();
        modelSample2.modified = Date.now();
        modelSample2.firstName = 'Aboubakar';
        modelSample2.lastName = 'Koïta';
        modelSample2.status = TrainingAppLifecycleStatus.Open;

        const modelSample3 = new Candidate();2
        modelSample3.id = uuid();
        modelSample3.created = Date.now();
        modelSample3.modified = Date.now();
        modelSample3.firstName = 'Aboubakar';
        modelSample3.lastName = 'Koïta';
        modelSample3.status = TrainingAppLifecycleStatus.Open;

        const modelSample4 = new Candidate();
        modelSample4.id = uuid();
        modelSample4.created = Date.now();
        modelSample4.modified = Date.now();
        modelSample4.firstName = 'Aboubakar';
        modelSample4.lastName = 'Koïta';
        modelSample4.status = TrainingAppLifecycleStatus.Open;

        console.log(JSON.stringify(modelSample1));
        console.log(JSON.stringify(modelSample2));
        console.log(JSON.stringify(modelSample3));
        console.log(JSON.stringify(modelSample4));
4
        await candidateCtrl.createCandidate(modelSample1);
        await candidateCtrl.createCandidate(modelSample2);
        await candidateCtrl.createCandidate(modelSample3);
        await candidateCtrl.createCandidate(modelSample4);


        const candidateList = await candidateCtrl.listCandidates().then(models => models.map(model => {
            return new Candidate(model);
        }));

        await expect(candidateList).to.have.lengthOf(4);
        expect(candidateList).to.have.same.deep.members([modelSample1, modelSample2, modelSample3, modelSample4]);
    });


    it('should find the candidate matching given name', async()=>{
        const aboubakar = new Candidate();
        aboubakar.id = uuid();
        aboubakar.created = Date.now();
        aboubakar.modified = Date.now();
        aboubakar.firstName = 'Aboubakar';
        aboubakar.lastName = 'Koïta';
        aboubakar.status = TrainingAppLifecycleStatus.Open;

        const soumaya = new Candidate();
        soumaya.id = uuid();
        soumaya.created = Date.now();
        soumaya.modified = Date.now();
        soumaya.firstName = 'Soumaya';
        soumaya.lastName = 'Koïta';
        soumaya.status = TrainingAppLifecycleStatus.Open;

        const dede = new Candidate();2
        dede.id = uuid();
        dede.created = Date.now();
        dede.modified = Date.now();
        dede.firstName = 'Dede';
        dede.lastName = 'Koïta';
        dede.status = TrainingAppLifecycleStatus.Open;

        await candidateCtrl.createCandidate(aboubakar);
        await candidateCtrl.createCandidate(soumaya);
        await candidateCtrl.createCandidate(dede);

        const candidates = await candidateCtrl.searchCandidate("Koïta");
        if(Array.isArray(candidates)){
            expect(candidates.map(c => new Candidate(c))).to.have.same.deep.members([aboubakar, soumaya, dede]);
        }else{
            throw new Error('no candidate matching name "Koïta"');
        }

        const candidates2 = await candidateCtrl.searchCandidate("Abouba");
        if(Array.isArray(candidates2)){
            expect(candidates2.map(c => new Candidate(c))).to.have.same.deep.members([aboubakar]);
        }else{
            throw new Error('no candidate matching name "Abouba"');
        }

        const candidates3 = await candidateCtrl.searchCandidate("noExistingUser");
        if(Array.isArray(candidates3)){
            expect(candidates3.map(c => new Candidate(c))).to.be.empty;
        }else{
            throw new Error('expecting empty array');
        }

    });

});