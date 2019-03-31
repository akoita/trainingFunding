// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { AbstractTrainingAsset, AbstractTrainingParticipant } from '../src';

describe('AbstractTrainingAsset', () => {
  let adapter: MockControllerAdapter;

  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();


    await adapter.init([
      {
        version: '*',
        controller: 'CommonController',
        name: join(__dirname, '..')
      }
    ]);
  });
});