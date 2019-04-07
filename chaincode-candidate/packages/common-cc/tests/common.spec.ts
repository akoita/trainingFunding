// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Common, CommonController } from '../src';

describe('Common', () => {
  let adapter: MockControllerAdapter;
  let commonCtrl: ConvectorControllerClient<CommonController>;
  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    commonCtrl = ClientFactory(CommonController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'CommonController',
        name: join(__dirname, '..')
      }
    ]);
  });
  
  it('should create a default model', async () => {
    const modelSample = new Common({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await commonCtrl.create(modelSample);
  
    const justSavedModel = await adapter.getById<Common>(modelSample.id);
  
    expect(justSavedModel.id).to.exist;
  });
});