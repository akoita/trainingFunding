// tslint:disable:no-unused-expression
import { join } from "path";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as uuid from "uuid/v4";
import { MockControllerAdapter } from "@worldsibu/convector-adapter-mock";
import {
  ClientFactory,
  ConvectorControllerClient
} from "@worldsibu/convector-core";
import "mocha";

import { Candidate, CandidateController, CandidateParams } from "../src";
import { TrainingAppLifecycleStatus } from "common-cc";
import { CareerAdvisorParticipantController } from "participant-cc";

describe("Candidate", () => {
  chai.use(chaiAsPromised);
  let adapter: MockControllerAdapter;
  let candidateCtrl: ConvectorControllerClient<CandidateController>;
  let careerAdvisorCtrl: ConvectorControllerClient<
    CareerAdvisorParticipantController
  >;

  let abou: CandidateParams;
  let juli: CandidateParams;
  let itachi: CandidateParams;

  const fakeParticipantCert =
    "-----BEGIN CERTIFICATE-----\n" +
    "MIICKDCCAc6gAwIBAgIRAKpIbs0yLYy65JIrr9irtugwCgYIKoZIzj0EAwIwcTEL\n" +
    "MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\n" +
    "cmFuY2lzY28xGDAWBgNVBAoTD29yZzEuaHVybGV5LmxhYjEbMBkGA1UEAxMSY2Eu\n" +
    "b3JnMS5odXJsZXkubGFiMB4XDTE5MDUwMzEzMjQwMFoXDTI5MDQzMDEzMjQwMFow\n" +
    "azELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\n" +
    "biBGcmFuY2lzY28xDzANBgNVBAsTBmNsaWVudDEeMBwGA1UEAwwVVXNlcjFAb3Jn\n" +
    "MS5odXJsZXkubGFiMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE5QS5zZd5kIlr\n" +
    "lCceMAShpkryJr3LKlev/fblhc76C6x6jfbWsYx4eilqDKGmGtoP/DL/ubiHtWxW\n" +
    "ncRs5tuu7KNNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0j\n" +
    "BCQwIoAgOrfdQBvYqeJMP2kSeYMs454SgMM0UMxVMX3smJhq1T0wCgYIKoZIzj0E\n" +
    "AwIDSAAwRQIhAKuLQTEpu7OUJVepcKR8/4agjQzP5m5dbyOhZUPi7HKzAiBromIn\n" +
    "dH9+KtMkM6VNbtSP54kS5idQg+1lXSal76P98A==\n" +
    "-----END CERTIFICATE-----\n";
  const fakeSecondParticipantCert =
    "-----BEGIN CERTIFICATE-----\n" +
    "MIICJzCCAc6gAwIBAgIRAM5RbRyFH9XUyE1qUrsxeSQwCgYIKoZIzj0EAwIwcTEL\n" +
    "MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\n" +
    "cmFuY2lzY28xGDAWBgNVBAoTD29yZzEuaHVybGV5LmxhYjEbMBkGA1UEAxMSY2Eu\n" +
    "b3JnMS5odXJsZXkubGFiMB4XDTE5MDUwMzEzMjQwMFoXDTI5MDQzMDEzMjQwMFow\n" +
    "azELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\n" +
    "biBGcmFuY2lzY28xDzANBgNVBAsTBmNsaWVudDEeMBwGA1UEAwwVQWRtaW5Ab3Jn\n" +
    "MS5odXJsZXkubGFiMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1xvsU/lkL31c\n" +
    "SFdvvi88NXA4jM0XHL6MkCoZ+1xQMughVf7chMN4EjCk4r6+avRnGs8TBVvkFXwM\n" +
    "DX5TTHMoJ6NNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0j\n" +
    "BCQwIoAgOrfdQBvYqeJMP2kSeYMs454SgMM0UMxVMX3smJhq1T0wCgYIKoZIzj0E\n" +
    "AwIDRwAwRAIgH+RAPxmcMPxkmolhW8tuHbc61/QuIA35j0Mzxp2K0JgCIEXkwYk6\n" +
    "K/6c2BcFc7xD3fFhwCw7Oh/Epkp/WNYnNZoW\n" +
    "-----END CERTIFICATE-----\n";

  beforeEach(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    candidateCtrl = ClientFactory(CandidateController, adapter);
    careerAdvisorCtrl = ClientFactory(
      CareerAdvisorParticipantController,
      adapter
    );

    await adapter.init([
      {
        version: "*",
        controller: "CareerAdvisorParticipantController",
        name: join(__dirname, "..", "..", "participant-cc")
      },
      {
        version: "*",
        controller: "CandidateController",
        name: join(__dirname, "..")
      }
    ]);

    (adapter.stub as any).usercert = fakeParticipantCert;
    await careerAdvisorCtrl.register("CareerAdvisor1", "CareerAdvisor1Name");

    abou = {
      id: uuid(),
      ownerId: "CareerAdvisor1",
      firstName: "Aboubakar",
      lastName: "Koïta"
    };
    juli = {
      id: uuid(),
      ownerId: "CareerAdvisor1",
      firstName: "Aboubakar",
      lastName: "Koïta"
    };

    itachi = {
      id: uuid(),
      ownerId: "CareerAdvisor1",
      firstName: "Aboubakar",
      lastName: "Koïta"
    };
  });

  it("should create a candidate default model", async () => {
    await candidateCtrl.createCandidate(abou);
    const justSavedModel = await Candidate.getOne(abou.id);
    expect(justSavedModel).to.include(abou);
    expect(justSavedModel.status).to.be.equal(TrainingAppLifecycleStatus.Open);
  });

  it("should fail to create a createCandidate when the participant doesn't exist ", async () => {
    abou.ownerId = "CareerAdvisor2";
    await expect(
      candidateCtrl
        .createCandidate(abou)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      "no Career advisor participant found with the id CareerAdvisor2"
    );
  });

  it("should fail to create a createCandidate default model when the owner identity doesn't match the caller identity", async () => {
    (adapter.stub as any).usercert = fakeSecondParticipantCert;
    await expect(
      candidateCtrl
        .createCandidate(abou)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'the transaction caller identity "56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82" does not match Career advisor participant active identity "01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57"'
    );
  });

  it("should get the list of all candidates", async () => {
    await candidateCtrl.createCandidate(abou);
    await candidateCtrl.createCandidate(juli);
    await candidateCtrl.createCandidate(itachi);

    const candidateList = await candidateCtrl.listCandidates().then(models =>
      models.map(model => {
        const model2 = new Candidate(model);
        return {
          id: model2.id,
          ownerId: model2.ownerId,
          firstName: model2.firstName,
          lastName: model2.lastName
        };
      })
    );
    expect(candidateList).to.have.same.deep.members([abou, juli, itachi]);
  });

  it("should find the candidate matching given name", async () => {
    const soumaya = {
      id: uuid(),
      ownerId: "CareerAdvisor1",
      firstName: "Soumaya",
      lastName: "Koïta"
    };

    const dede = {
      id: uuid(),
      ownerId: "CareerAdvisor1",
      firstName: "Dede",
      lastName: "Koïta"
    };

    await candidateCtrl.createCandidate(abou);
    await candidateCtrl.createCandidate(soumaya);
    await candidateCtrl.createCandidate(dede);

    const candidates = await candidateCtrl
      .searchCandidate("Koïta")
      .then(models =>
        models.map(model => {
          const model2 = new Candidate(model);
          return {
            id: model2.id,
            ownerId: model2.ownerId,
            firstName: model2.firstName,
            lastName: model2.lastName
          };
        })
      );
    expect(candidates).to.have.same.deep.members([abou, soumaya, dede]);

    const candidates2 = await candidateCtrl
      .searchCandidate("Abouba")
      .then(models =>
        models.map(model => {
          const model2 = new Candidate(model);
          return {
            id: model2.id,
            ownerId: model2.ownerId,
            firstName: model2.firstName,
            lastName: model2.lastName
          };
        })
      );
    expect(candidates2).to.have.same.deep.members([abou]);

    const candidates3 = await candidateCtrl.searchCandidate("noExistingUser");
    expect(candidates3).to.be.empty;
  });

  it("should disable the candidate", async () => {
    await candidateCtrl.createCandidate(abou);

    await candidateCtrl.disableCandidate(abou.id);
    let one = await Candidate.getOne(abou.id);
    await expect(one.status).to.be.eql(TrainingAppLifecycleStatus.Closed);

    await expect(
      candidateCtrl
        .disableCandidate(abou.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal("Candidate is already disabled");

    await expect(
      candidateCtrl
        .disableCandidate("noExistingID")
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      "no existing candidate found with the id: noExistingID"
    );
  });

  it("should fail to disable the candidate when the caller identity does not match the candidate owner identity", async () => {
    (adapter.stub as any).usercert = fakeSecondParticipantCert;
    await expect(
      candidateCtrl
        .createCandidate(abou)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'the transaction caller identity "56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82" does not match Career advisor participant active identity "01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57"'
    );
  });
});
