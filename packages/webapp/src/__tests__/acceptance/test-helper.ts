import {WebappApplication} from '../..';
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {MockControllerAdapter} from '@worldsibu/convector-adapter-mock';
import {Candidate, CandidateController, CandidateParams} from 'candidate-cc';
import {join} from 'path';

import {ClientFactory} from '@worldsibu/convector-core';
import {TrainingController} from 'training-cc';
import {TrainingOfferController} from 'trainingOffer-cc';
import {
  CareerAdvisorParticipantController,
  InvestorParticipantController,
  TrainingCompanyParticipantController,
} from 'participant-cc';

export function extractCandidateParams(candidate: Candidate): CandidateParams {
  return {
    id: candidate.id,
    ownerId: candidate.ownerId,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
  };
}

export async function setupApplication(): Promise<AppWithClient> {
  const fabrickMockAdapter = new MockControllerAdapter();
  const candidateFabricCtrl = ClientFactory(
    CandidateController,
    fabrickMockAdapter,
  );
  const trainingFabricCtrl = ClientFactory(
    TrainingController,
    fabrickMockAdapter,
  );
  const trainingOfferFabricCtrl = ClientFactory(
    TrainingOfferController,
    fabrickMockAdapter,
  );
  const careerAdvisorParticipantCtrl = ClientFactory(
    CareerAdvisorParticipantController,
    fabrickMockAdapter,
  );
  const trainingCompanyParticipantCtrl = ClientFactory(
    TrainingCompanyParticipantController,
    fabrickMockAdapter,
  );
  const investorParticipantCtrl = ClientFactory(
    InvestorParticipantController,
    fabrickMockAdapter,
  );

  await fabrickMockAdapter.init([
    {
      version: '*',
      controller: 'TrainingController',
      name: join(__dirname, '..', '..', '..', '..', 'training-cc'),
    },
    {
      version: '*',
      controller: 'CandidateController',
      name: join(__dirname, '..', '..', '..', '..', 'candidate-cc'),
    },
    {
      version: '*',
      controller: 'TrainingOfferController',
      name: join(__dirname, '..', '..', '..', '..', 'trainingOffer-cc'),
    },
    {
      version: '*',
      controller: 'CareerAdvisorParticipantController',
      name: join(__dirname, '..', '..', '..', '..', 'participant-cc'),
    },
    {
      version: '*',
      controller: 'TrainingCompanyParticipantController',
      name: join(__dirname, '..', '..', '..', '..', 'participant-cc'),
    },
    {
      version: '*',
      controller: 'InvestorParticipantController',
      name: join(__dirname, '..', '..', '..', '..', 'participant-cc'),
    },
  ]);

  const fakeParticipantCert =
    '-----BEGIN CERTIFICATE-----\n' +
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
  /* tslint:disable */
  const fakeSecondParticipantCert =
    '-----BEGIN CERTIFICATE-----\n' +
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
  (fabrickMockAdapter.stub as any).usercert = fakeParticipantCert;
  /* tslint:enable */
  await careerAdvisorParticipantCtrl.register(
    'CareerAdvisor1',
    'CareerAdvisor1Name',
  );
  await trainingCompanyParticipantCtrl.register(
    'TrainingCompany1',
    'TrainingCompany1Name',
  );
  await investorParticipantCtrl.register('Investor1', 'Investor1Name');

  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new WebappApplication({
    rest: restConfig,
  });

  app.bind('CandidateControllerBackEnd').to(candidateFabricCtrl);
  app.bind('TrainingOfferControllerBackEnd').to(trainingOfferFabricCtrl);
  app.bind('TrainingControllerBackEnd').to(trainingFabricCtrl);

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: WebappApplication;
  client: Client;
}
