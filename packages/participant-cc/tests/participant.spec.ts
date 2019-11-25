// tslint:disable:no-unused-expression
import {join} from 'path';
import {MockControllerAdapter} from '@worldsibu/convector-adapter-mock';
import {ClientFactory, ConvectorControllerClient} from '@worldsibu/convector-core';
import 'mocha';
import * as chai from 'chai';
import {expect} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {
    CareerAdvisorParticipantController, InvestorParticipantController, TrainingCompanyParticipantController
} from "../dist/src";
import {TrainingAppLifecycleStatus} from "common-cc";
import {CareerAdvisorParticipant, InvestorParticipant, TrainingCompanyParticipant} from "../src";

describe('Participant', () => {
    chai.use(chaiAsPromised);
    let mockAdapter: MockControllerAdapter;
    let careerAdvisorParticipantCtrl: ConvectorControllerClient<CareerAdvisorParticipantController>;
    let trainingCompanyParticipantCtrl: ConvectorControllerClient<TrainingCompanyParticipantController>;
    let investorParticipantCtrl: ConvectorControllerClient<InvestorParticipantController>;

    const fakeParticipantCert = '-----BEGIN CERTIFICATE-----\n' + 'MIICKDCCAc6gAwIBAgIRAKpIbs0yLYy65JIrr9irtugwCgYIKoZIzj0EAwIwcTEL\n' + 'MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\n' + 'cmFuY2lzY28xGDAWBgNVBAoTD29yZzEuaHVybGV5LmxhYjEbMBkGA1UEAxMSY2Eu\n' + 'b3JnMS5odXJsZXkubGFiMB4XDTE5MDUwMzEzMjQwMFoXDTI5MDQzMDEzMjQwMFow\n' + 'azELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\n' + 'biBGcmFuY2lzY28xDzANBgNVBAsTBmNsaWVudDEeMBwGA1UEAwwVVXNlcjFAb3Jn\n' + 'MS5odXJsZXkubGFiMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE5QS5zZd5kIlr\n' + 'lCceMAShpkryJr3LKlev/fblhc76C6x6jfbWsYx4eilqDKGmGtoP/DL/ubiHtWxW\n' + 'ncRs5tuu7KNNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0j\n' + 'BCQwIoAgOrfdQBvYqeJMP2kSeYMs454SgMM0UMxVMX3smJhq1T0wCgYIKoZIzj0E\n' + 'AwIDSAAwRQIhAKuLQTEpu7OUJVepcKR8/4agjQzP5m5dbyOhZUPi7HKzAiBromIn\n' + 'dH9+KtMkM6VNbtSP54kS5idQg+1lXSal76P98A==\n' + '-----END CERTIFICATE-----\n';
    const fakeSecondAdminCert = '-----BEGIN CERTIFICATE-----\n' + 'MIIC7DCCApOgAwIBAgIUcg3DffC8hY03iz6zRC6GZQUch7EwCgYIKoZIzj0EAwIw\n' + 'cTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\n' + 'biBGcmFuY2lzY28xGDAWBgNVBAoTD29yZzEuaHVybGV5LmxhYjEbMBkGA1UEAxMS\n' + 'Y2Eub3JnMS5odXJsZXkubGFiMB4XDTE5MDUwNjA4NDEwMFoXDTIwMDUwNTA4NDYw\n' + 'MFowfzELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYD\n' + 'VQQKEwtIeXBlcmxlZGdlcjEwMA0GA1UECxMGY2xpZW50MAsGA1UECxMEb3JnMTAS\n' + 'BgNVBAsTC2RlcGFydG1lbnQxMQ8wDQYDVQQDEwZhZG1pbjIwWTATBgcqhkjOPQIB\n' + 'BggqhkjOPQMBBwNCAATdhgd0fRPq4AYSvS9tiS7vcZamCG3PDAb0QM4UGyFADdWi\n' + 'RsQjglz2/MnId4rLkU6srIAJUhDZI+QYGGkDhZlBo4H6MIH3MA4GA1UdDwEB/wQE\n' + 'AwIHgDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBSbHq5DcRCcBt0+y4miDuzLOq80\n' + '8TArBgNVHSMEJDAigCD9XKUjIbuooHek1fmgbE768dWTkHdGpqGn8v/YEeBbyDAR\n' + 'BgNVHREECjAIggZ1YnVudHUweAYIKgMEBQYHCAEEbHsiYXR0cnMiOnsiYWRtaW4i\n' + 'OiJ0cnVlIiwiaGYuQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwiaGYu\n' + 'RW5yb2xsbWVudElEIjoiYWRtaW4yIiwiaGYuVHlwZSI6ImNsaWVudCJ9fTAKBggq\n' + 'hkjOPQQDAgNHADBEAiAzUQos0hPVPf3DuZaCW3gX+LlxL2G5d7iY1ZUh1murgwIg\n' + 'dkQIssMaMwkireuglUubT/Chee4jFgnhJqffnG+qCHs=\n' + '-----END CERTIFICATE-----\n';

    beforeEach(async () => {
        // Mocks the blockchain execution environment
        mockAdapter = new MockControllerAdapter();
        careerAdvisorParticipantCtrl = ClientFactory(CareerAdvisorParticipantController, mockAdapter);
        trainingCompanyParticipantCtrl = ClientFactory(TrainingCompanyParticipantController, mockAdapter);
        investorParticipantCtrl = ClientFactory(InvestorParticipantController, mockAdapter);

        await mockAdapter.init([{
            version: '*',
            controller: 'CareerAdvisorParticipantController',
            name: join(__dirname, '..', '..', 'participant-cc')
        }, {
            version: '*',
            controller: 'TrainingCompanyParticipantController',
            name: join(__dirname, '..', '..', 'participant-cc')
        }, {
            version: '*',
            controller: 'InvestorParticipantController',
            name: join(__dirname, '..', '..', 'participant-cc')
        }]);
        (mockAdapter.stub as any).usercert = fakeParticipantCert;
    });

    it('should create a participant', async () => {
        // CareerAdvisorParticipant
        await careerAdvisorParticipantCtrl.register('CareerAdvisor1', 'CareerAdvisor1Name');
        const careerAdvisor1 = await careerAdvisorParticipantCtrl.getParticipantById('CareerAdvisor1').then(result => {
            return new CareerAdvisorParticipant(result)
        });
        expect(careerAdvisor1).to.include(
            {id: 'CareerAdvisor1', name: 'CareerAdvisor1Name', status: TrainingAppLifecycleStatus.Open});
        expect(careerAdvisor1.identities).to.have.lengthOf(1);
        expect(careerAdvisor1.identities[0]).to.include({
                                                            status: TrainingAppLifecycleStatus.Open,
                                                            fingerprint: '01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57'
                                                        });

        // TrainingCompanyParticipant
        await trainingCompanyParticipantCtrl.register('TrainingCompany1', 'TrainingCompany1Name');
        const trainingCompany = await trainingCompanyParticipantCtrl.getParticipantById('TrainingCompany1').then(
            res => {
                return new TrainingCompanyParticipant(res)
            });
        expect(trainingCompany).to.include(
            {id: 'TrainingCompany1', name: 'TrainingCompany1Name', status: TrainingAppLifecycleStatus.Open});
        expect(trainingCompany.identities).to.have.lengthOf(1);
        expect(trainingCompany.identities[0]).to.include({
                                                             status: TrainingAppLifecycleStatus.Open,
                                                             fingerprint: '01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57'
                                                         });

        // InvestorParticipant
        await investorParticipantCtrl.register('Investor1', 'Investor1Name');
        const investor1 = await investorParticipantCtrl.getParticipantById('Investor1').then(res => {
            return new InvestorParticipant(res)
        });
        expect(investor1).to.to.include(
            {id: 'Investor1', name: 'Investor1Name', status: TrainingAppLifecycleStatus.Open});
        expect(investor1.identities).to.have.lengthOf(1);
        expect(investor1.identities[0]).to.include({
                                                       status: TrainingAppLifecycleStatus.Open,
                                                       fingerprint: '01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57'
                                                   });

    });


    it('should fail to create a participant with an existing id', async () => {
        // CareerAdvisorParticipant
        await careerAdvisorParticipantCtrl.register('CareerAdvisor1', 'CareerAdvisor1Name');
        const careerAdvisor1 = await careerAdvisorParticipantCtrl.getParticipantById('CareerAdvisor1').then(result => {
            return new CareerAdvisorParticipant(result)
        });
        expect(careerAdvisor1.id).to.be.eql('CareerAdvisor1');
        await expect(careerAdvisorParticipantCtrl.register('CareerAdvisor1', 'CareerAdvisor2Name').catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'a participant already exists with the id "CareerAdvisor1"');

        // TrainingCompanyParticipant
        await trainingCompanyParticipantCtrl.register('TrainingCompany1', 'TrainingCompany1Name');
        const trainingCompany = await trainingCompanyParticipantCtrl.getParticipantById('TrainingCompany1').then(
            res => {
                return new TrainingCompanyParticipant(res)
            });
        expect(trainingCompany.id).to.be.eql('TrainingCompany1');
        await expect(trainingCompanyParticipantCtrl.register('TrainingCompany1', 'TrainingCompany2Name').catch(
            ex => ex.responses[0].error.message)).to.be.eventually.equal(
            'a participant already exists with the id "TrainingCompany1"');

        // InvestorParticipant
        await investorParticipantCtrl.register('Investor1', 'Investor1Name');
        const investor1 = await investorParticipantCtrl.getParticipantById('Investor1').then(res => {
            return new InvestorParticipant(res)
        });
        expect(investor1.id).to.be.eql('Investor1');
        await expect(
            investorParticipantCtrl.register('Investor1', 'Investor2Name').catch(ex => ex.responses[0].error.message))
            .to.be.eventually.equal('a participant already exists with the id "Investor1"');
    });


    it('should change the active identity of a participant', async () => {
        //=======================   Create CareerAdvisorParticipant   ===========================
        await careerAdvisorParticipantCtrl.register('CareerAdvisor1', 'CareerAdvisor1Name');
        const careerAdvisor1 = await careerAdvisorParticipantCtrl.getParticipantById('CareerAdvisor1').then(result => {
            return new CareerAdvisorParticipant(result)
        });
        expect(careerAdvisor1.id).to.be.eql('CareerAdvisor1');
        expect(careerAdvisor1.identities).to.have.lengthOf(1);
        expect(careerAdvisor1.identities[0]).to.include({
                                                            status: TrainingAppLifecycleStatus.Open,
                                                            fingerprint: '01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57'
                                                        });

        //======================================= Create TrainingCompanyParticipant   ==========================================
        await trainingCompanyParticipantCtrl.register('TrainingCompany1', 'TrainingCompany1Name');
        const trainingCompany = await trainingCompanyParticipantCtrl.getParticipantById('TrainingCompany1').then(
            res => {
                return new TrainingCompanyParticipant(res)
            });
        expect(trainingCompany.identities).to.have.lengthOf(1);
        expect(trainingCompany.identities[0]).to.include({
                                                             status: TrainingAppLifecycleStatus.Open,
                                                             fingerprint: '01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57'
                                                         });

        //============================================= Create InvestorParticipant   ==========================================
        await investorParticipantCtrl.register('Investor1', 'Investor1Name');
        const investor1 = await investorParticipantCtrl.getParticipantById('Investor1').then(res => {
            return new InvestorParticipant(res)
        });
        expect(investor1.identities).to.have.lengthOf(1);
        expect(investor1.identities[0]).to.include({
                                                       status: TrainingAppLifecycleStatus.Open,
                                                       fingerprint: '01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57'
                                                   });


        // admin identity is required to change the idendity of a participant
        (mockAdapter.stub as any).usercert = fakeSecondAdminCert;


        //==========================================   Change identity of CareerAdvisorParticipant   ===========================
        await careerAdvisorParticipantCtrl.changeIdentity(
            'CareerAdvisor1', '56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82');
        const careerAdvisor1Updated = await careerAdvisorParticipantCtrl.getParticipantById('CareerAdvisor1').then(
            result => {
                return new CareerAdvisorParticipant(result)
            });
        expect(careerAdvisor1Updated.id).to.be.eql('CareerAdvisor1');
        expect(careerAdvisor1Updated.identities).to.have.lengthOf(2);
        expect(careerAdvisor1Updated.findActiveIdentity()).to.include({
                                                                          status: TrainingAppLifecycleStatus.Open,
                                                                          fingerprint: '56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82'
                                                                      });
        expect(careerAdvisor1Updated.identities[0]).to.include({
                                                                   status: TrainingAppLifecycleStatus.Closed,
                                                                   fingerprint: '01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57'
                                                               });


        //====================================  Change identity of  TrainingCompanyParticipant   ===================================
        await trainingCompanyParticipantCtrl.changeIdentity(
            'TrainingCompany1', '56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82');

        const trainingCompanyUpdated = await trainingCompanyParticipantCtrl.getParticipantById('TrainingCompany1').then(
            res => {
                return new TrainingCompanyParticipant(res)
            });
        expect(trainingCompanyUpdated.id).to.be.eql('TrainingCompany1');
        expect(trainingCompanyUpdated.findActiveIdentity()).to.include({
                                                                           status: TrainingAppLifecycleStatus.Open,
                                                                           fingerprint: '56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82'
                                                                       });
        expect(trainingCompanyUpdated.identities).to.have.lengthOf(2);
        expect(trainingCompanyUpdated.identities[0]).to.include({
                                                                    status: TrainingAppLifecycleStatus.Closed,
                                                                    fingerprint: '01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57'
                                                                });

        //====================================  Change identity of  InvestorParticipant   ==========================================
        await investorParticipantCtrl.changeIdentity(
            'Investor1', '56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82');

        const investor1Updated = await investorParticipantCtrl.getParticipantById('Investor1').then(res => {
            return new InvestorParticipant(res)
        });
        expect(investor1Updated.id).to.be.eql('Investor1');
        expect(investor1Updated.findActiveIdentity()).to.include({
                                                                     status: TrainingAppLifecycleStatus.Open,
                                                                     fingerprint: '56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82'
                                                                 });
        expect(investor1Updated.identities).to.have.lengthOf(2);
        expect(investor1Updated.identities[0]).to.include({
                                                              status: TrainingAppLifecycleStatus.Closed,
                                                              fingerprint: '01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57'
                                                          });


    });
});