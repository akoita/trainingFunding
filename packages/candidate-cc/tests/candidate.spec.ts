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

    let abou: Candidate;
    let juli: Candidate;
    let itachi: Candidate;

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


        abou = Candidate.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Aboubakar',
            lastName: 'Koïta',
            status: TrainingAppLifecycleStatus.Open

        });
        juli = Candidate.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Aboubakar',
            lastName: 'Koïta',
            status: TrainingAppLifecycleStatus.Open

        });
        itachi = Candidate.build({
            id: uuid(),
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Aboubakar',
            lastName: 'Koïta',
            status: TrainingAppLifecycleStatus.Open

        })


    });


    it('should createTraining a default model', async () => {
        await candidateCtrl.createCandidate(abou);
        const justSavedModel = await Candidate.getOne(abou.id);
        expect(justSavedModel).to.be.deep.equal(abou);

    });

    it('should fail to createTraining a candidate with closed status', async () => {
        abou.status = TrainingAppLifecycleStatus.Closed;

        await expect(candidateCtrl.createCandidate(abou).catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal('new candidate must be in open status');

    });


    it('should get the list of all candidates', async () => {

        await candidateCtrl.createCandidate(abou);
        await candidateCtrl.createCandidate(juli);
        await candidateCtrl.createCandidate(itachi);

        const candidateList = await candidateCtrl.listCandidates().then(models => models.map(model => {
            return new Candidate(model);
        }));
        expect(candidateList).to.have.same.deep.members([abou, juli, itachi]);
    });


    it('should find the candidate matching given name', async () => {
        const soumaya = new Candidate();
        soumaya.id = uuid();
        soumaya.created = Date.now();
        soumaya.modified = Date.now();
        soumaya.firstName = 'Soumaya';
        soumaya.lastName = 'Koïta';
        soumaya.status = TrainingAppLifecycleStatus.Open;

        const dede = new Candidate();
        dede.id = uuid();
        dede.created = Date.now();
        dede.modified = Date.now();
        dede.firstName = 'Dede';
        dede.lastName = 'Koïta';
        dede.status = TrainingAppLifecycleStatus.Open;

        await candidateCtrl.createCandidate(abou);
        await candidateCtrl.createCandidate(soumaya);
        await candidateCtrl.createCandidate(dede);

        const candidates = await candidateCtrl.searchCandidate("Koïta");
        if (Array.isArray(candidates)) {
            expect(candidates.map(c => new Candidate(c))).to.have.same.deep.members([abou, soumaya, dede]);
        } else {
            throw new Error('no candidate matching name "Koïta"');
        }

        const candidates2 = await candidateCtrl.searchCandidate("Abouba");
        if (Array.isArray(candidates2)) {
            expect(candidates2.map(c => new Candidate(c))).to.have.same.deep.members([abou]);
        } else {
            throw new Error('no candidate matching name "Abouba"');
        }

        const candidates3 = await candidateCtrl.searchCandidate("noExistingUser");
        if (Array.isArray(candidates3)) {
            expect(candidates3.map(c => new Candidate(c))).to.be.empty;
        } else {
            throw new Error('expecting empty array');
        }

    });


    it('should disable the candidate', async () => {

        await candidateCtrl.createCandidate(abou);

        await candidateCtrl.disableCandidate(abou.id);
        let one = await Candidate.getOne(abou.id);
        await expect(one.status).to.be.eql(TrainingAppLifecycleStatus.Closed);

        await expect(candidateCtrl.disableCandidate(abou.id).catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal('Candidate is already disabled');

        await expect(candidateCtrl.disableCandidate("noExistingID").catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal('no existing candidate found with the id: noExistingID');

    });

});