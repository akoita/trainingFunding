import {join, resolve} from 'path';
import {
  chaincode,
  channel,
  identityName,
  keyStore,
  networkProfile,
} from './env';
import * as fs from 'fs';
import {FabricControllerAdapter} from '@worldsibu/convector-adapter-fabric';
import {ClientFactory} from '@worldsibu/convector-core';

import {Candidate, CandidateController} from 'candidate-cc';
import {TrainingOfferController} from 'trainingOffer-cc';
import {TrainingController} from 'training-cc';

const adapter = new FabricControllerAdapter({
  txTimeout: 300000,
  user: identityName,
  channel,
  chaincode,
  keyStore: resolve(__dirname, keyStore),
  networkProfile: resolve(__dirname, networkProfile),
  // userMspPath: keyStore
});

export const initAdapter = adapter.init();
export const CandidateControllerBackEnd = ClientFactory(
  CandidateController,
  adapter,
);
export const TrainingOfferControllerBackEnd = ClientFactory(
  TrainingOfferController,
  adapter,
);
export const TrainingControllerBackEnd = ClientFactory(
  TrainingController,
  adapter,
);

//#region Optional

/**
 * Check if the identity has been initialized in the chaincode.
 */
export async function InitServerIdentity() {
  await initAdapter;
  const candidates = await CandidateControllerBackEnd.listCandidates();
  try {
    const candidate = new Candidate(candidates[0]).toJSON();
    if (!candidate || !candidate.id) {
      throw new Error('no candidate found');
    } else {
      console.log('a candidate found');
    }
  } catch (ex) {
    console.log(JSON.stringify(ex));
  }
}

const contextPath = join(keyStore + '/' + identityName);
fs.readFile(contextPath, 'utf8', async function(err, data) {
  if (err) {
    throw new Error(
      `Context in ${contextPath} doesn't exist. Make sure that path resolves to your key stores folder`,
    );
  } else {
    console.log('Context path with cryptographic materials exists');
  }
});

//#endregion
