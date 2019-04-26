import {WebappApplication} from '../..';
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {MockControllerAdapter} from '@worldsibu/convector-adapter-mock';
import {CandidateController} from 'candidate-cc';
import {join} from 'path';

import {ClientFactory} from '@worldsibu/convector-core';
import {TrainingController} from 'training-cc';
import {TrainingOfferController} from 'trainingOffer-cc';

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
  ]);

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
