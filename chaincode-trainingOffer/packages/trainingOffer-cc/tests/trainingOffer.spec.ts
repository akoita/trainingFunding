// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { TrainingOffer, TrainingOfferController } from '../src';

describe('TrainingOffer', () => {
  let adapter: MockControllerAdapter;
  let trainingOfferCtrl: ConvectorControllerClient<TrainingOfferController>;
  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    trainingOfferCtrl = ClientFactory(TrainingOfferController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'TrainingOfferController',
        name: join(__dirname, '..')
      }
    ]);
  });
  
  it('should createTrainingOffer a default model', async () => {
    const modelSample = new TrainingOffer({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await trainingOfferCtrl.create(modelSample);
  
    const justSavedModel = await adapter.getById<TrainingOffer>(modelSample.id);
  
    expect(justSavedModel.id).to.exist;
  });
});