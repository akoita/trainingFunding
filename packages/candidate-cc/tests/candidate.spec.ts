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

    before(async () => {
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
        const modelSample = new Candidate({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Aboubakar',
            lastName: 'Koïta',
            status: TrainingAppLifecycleStatus.Open
        });

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
        const modelSample = new Candidate({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Aboubakar',
            lastName: 'Koïta',
            status: TrainingAppLifecycleStatus.Closed
        });

        await expect(candidateCtrl.createCandidate(modelSample).catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal('new candidate must be in open status');

    });

});