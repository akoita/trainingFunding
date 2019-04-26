import {WebappApplication} from '../..';
import {Client} from '@loopback/testlab';
import {setupApplication} from './test-helper';
import {expect} from 'chai';
import 'mocha';
import {CandidateDataSet} from '../fixtures/candidateDataSet';
import {Candidate} from 'candidate-cc';

describe('CandidateWebController', () => {
  let app: WebappApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('create and get candidate', async () => {
    const res1 = await client.get('/candidates').expect(200);
    /* tslint:disable */
    expect(res1.body).to.be.empty;

    await client
      .post('/candidate/create')
      .send(CandidateDataSet.abou.toJSON())
      .expect(204);
    const res2 = await client.get('/candidates').expect(200);
    expect(
      (<Candidate[]>res2.body).map(m => new Candidate(m)),
    ).to.have.same.deep.members([CandidateDataSet.abou]);

    await client
      .post('/candidate/create')
      .send(CandidateDataSet.itachi.toJSON())
      .expect(204);
    const res3 = await client.get('/candidates').expect(200);
    expect(
      (<Candidate[]>res3.body).map(m => new Candidate(m)),
    ).to.have.same.deep.members([
      CandidateDataSet.abou,
      CandidateDataSet.itachi,
    ]);

    await client
      .post('/candidate/create')
      .send(CandidateDataSet.julie.toJSON())
      .expect(204);
    const res4 = await client.get('/candidates').expect(200);
    expect(
      (<Candidate[]>res4.body).map(m => new Candidate(m)),
    ).to.have.same.deep.members([
      CandidateDataSet.abou,
      CandidateDataSet.itachi,
      CandidateDataSet.julie,
    ]);
  });
});
