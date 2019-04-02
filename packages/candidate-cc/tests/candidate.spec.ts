// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Candidate, CandidateController } from '../src';

describe('Candidate', () => {
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
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await candidateCtrl.create(modelSample);
  
    const justSavedModel = await adapter.getById<Candidate>(modelSample.id);
  
    expect(justSavedModel.id).to.exist;
  });
});