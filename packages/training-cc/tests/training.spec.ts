// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Training, TrainingController } from '../src';

describe('Training', () => {
  let adapter: MockControllerAdapter;
  let trainingCtrl: ConvectorControllerClient<TrainingController>;
  
  before(async () => {
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