import {WebappApplication} from '../..';
import {Client, expect} from '@loopback/testlab';
import {setupApplication} from './test-helper';

import {CandidateDataSet} from '../fixtures/candidateDataSet';

import 'mocha';

describe('CandidateWebController', () => {
  let app: WebappApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /candidates', async () => {
    const res = await client.get('/candidates').expect(200);
    expect(res.body).to.be.empty();
  });
});
