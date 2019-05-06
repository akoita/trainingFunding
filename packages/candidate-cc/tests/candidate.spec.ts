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
import {CareerAdvisorParticipantController} from "participant-cc";

describe('Candidate', () => {
    chai.use(chaiAsPromised);
    let adapter: MockControllerAdapter;
    let candidateCtrl: ConvectorControllerClient<CandidateController>;
    let careerAdvisorCtrl: ConvectorControllerClient<CareerAdvisorParticipantController>;

    let abou: Candidate;
    let juli: Candidate;
    let itachi: Candidate;

    const fakeParticipantCert = '-----BEGIN CERTIFICATE-----\n' +
        'MIICKDCCAc6gAwIBAgIRAKpIbs0yLYy65JIrr9irtugwCgYIKoZIzj0EAwIwcTEL\n' +
        'MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\n' +
        'cmFuY2lzY28xGDAWBgNVBAoTD29yZzEuaHVybGV5LmxhYjEbMBkGA1UEAxMSY2Eu\n' +
        'b3JnMS5odXJsZXkubGFiMB4XDTE5MDUwMzEzMjQwMFoXDTI5MDQzMDEzMjQwMFow\n' +
        'azELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\n' +
        'biBGcmFuY2lzY28xDzANBgNVBAsTBmNsaWVudDEeMBwGA1UEAwwVVXNlcjFAb3Jn\n' +
        'MS5odXJsZXkubGFiMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE5QS5zZd5kIlr\n' +
        'lCceMAShpkryJr3LKlev/fblhc76C6x6jfbWsYx4eilqDKGmGtoP/DL/ubiHtWxW\n' +
        'ncRs5tuu7KNNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0j\n' +
        'BCQwIoAgOrfdQBvYqeJMP2kSeYMs454SgMM0UMxVMX3smJhq1T0wCgYIKoZIzj0E\n' +
        'AwIDSAAwRQIhAKuLQTEpu7OUJVepcKR8/4agjQzP5m5dbyOhZUPi7HKzAiBromIn\n' +
        'dH9+KtMkM6VNbtSP54kS5idQg+1lXSal76P98A==\n' +
        '-----END CERTIFICATE-----\n';
    const fakeSecondParticipantCert = '-----BEGIN CERTIFICATE-----\n' +
        'MIICJzCCAc6gAwIBAgIRAM5RbRyFH9XUyE1qUrsxeSQwCgYIKoZIzj0EAwIwcTEL\n' +
        'MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\n' +
        'cmFuY2lzY28xGDAWBgNVBAoTD29yZzEuaHVybGV5LmxhYjEbMBkGA1UEAxMSY2Eu\n' +
        'b3JnMS5odXJsZXkubGFiMB4XDTE5MDUwMzEzMjQwMFoXDTI5MDQzMDEzMjQwMFow\n' +
        'azELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\n' +
        'biBGcmFuY2lzY28xDzANBgNVBAsTBmNsaWVudDEeMBwGA1UEAwwVQWRtaW5Ab3Jn\n' +
        'MS5odXJsZXkubGFiMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1xvsU/lkL31c\n' +
        'SFdvvi88NXA4jM0XHL6MkCoZ+1xQMughVf7chMN4EjCk4r6+avRnGs8TBVvkFXwM\n' +
        'DX5TTHMoJ6NNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0j\n' +
        'BCQwIoAgOrfdQBvYqeJMP2kSeYMs454SgMM0UMxVMX3smJhq1T0wCgYIKoZIzj0E\n' +
        'AwIDRwAwRAIgH+RAPxmcMPxkmolhW8tuHbc61/QuIA35j0Mzxp2K0JgCIEXkwYk6\n' +
        'K/6c2BcFc7xD3fFhwCw7Oh/Epkp/WNYnNZoW\n' +
        '-----END CERTIFICATE-----\n';


    beforeEach(async () => {
        // Mocks the blockchain execution environment
        adapter = new MockControllerAdapter();
        candidateCtrl = ClientFactory(CandidateController, adapter);
        careerAdvisorCtrl = ClientFactory(CareerAdvisorParticipantController, adapter);

        await adapter.init([
            {
                version: '*',
                controller: 'CareerAdvisorParticipantController',
                name: join(__dirname, '..', '..', 'participant-cc')
            },
            {
                version: '*',
                controller: 'CandidateController',
                name: join(__dirname, '..')
            }
        ]);

        (adapter.stub as any).usercert = fakeParticipantCert;
        await careerAdvisorCtrl.register('CareerAdvisor1', 'CareerAdvisor1Name');

        abou = Candidate.build({
            id: uuid(),
            ownerId: 'CareerAdvisor1',
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Aboubakar',
            lastName: 'Koïta',
            status: TrainingAppLifecycleStatus.Open

        });
        juli = Candidate.build({
            id: uuid(),
            ownerId: 'CareerAdvisor1',
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Aboubakar',
            lastName: 'Koïta',
            status: TrainingAppLifecycleStatus.Open

        });
        itachi = Candidate.build({
            id: uuid(),
            ownerId: 'CareerAdvisor1',
            created: Date.now(),
            modified: Date.now(),
            firstName: 'Aboubakar',
            lastName: 'Koïta',
            status: TrainingAppLifecycleStatus.Open

        })


    });


    it('should create a Training a default model', async () => {
        await candidateCtrl.createCandidate(abou);
        const justSavedModel = await Candidate.getOne(abou.id);
        expect(justSavedModel).to.be.deep.equal(abou);

    });

    it('should fail to createTraining a default model when the participant doesn\'t exist ', async () => {
        await expect(candidateCtrl.createCandidate(abou.withOwnerId('CareerAdvisor2')).catch(ex => ex.responses[0].error.message)).to.be.eventually.equal('no Career advisor participant found with the id CareerAdvisor2');

    });

    it('should fail to create a Training a default model when the owner identity doesn\'t match the caller identity', async () => {
        (adapter.stub as any).usercert = fakeSecondParticipantCert;
        await expect(candidateCtrl.createCandidate(abou).catch(ex => ex.responses[0].error.message)).to.be.eventually.equal('the transaction caller identity "56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82" does not match Career advisor participant active identity "01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57"');
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
        soumaya.ownerId = 'CareerAdvisor1',
        soumaya.created = Date.now();
        soumaya.modified = Date.now();
        soumaya.firstName = 'Soumaya';
        soumaya.lastName = 'Koïta';
        soumaya.status = TrainingAppLifecycleStatus.Open;

        const dede = new Candidate();
        dede.id = uuid();
        dede.ownerId = 'CareerAdvisor1';
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

    it('should fail to disable the candidate when the caller identity does not match the candidate owner identity', async () => {
        (adapter.stub as any).usercert = fakeSecondParticipantCert;
        await expect(candidateCtrl.createCandidate(abou).catch(ex => ex.responses[0].error.message)).to.be.eventually.equal('the transaction caller identity "56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82" does not match Career advisor participant active identity "01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57"');
    });

});