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
import { Builder } from "builder-pattern";

import {
  Training,
  TrainingController,
  TrainingParams,
  TrainingProcessStatus
} from "../src";
import { Candidate, CandidateController, CandidateParams } from "candidate-cc";
import { TrainingAppLifecycleStatus } from "common-cc";
import {
  TrainingDomain,
  TrainingOffer,
  TrainingOfferController,
  TrainingOfferLevel,
  TrainingOfferParams
} from "trainingOffer-cc";
import {
  CareerAdvisorParticipantController,
  InvestorParticipantController,
  TrainingCompanyParticipantController
} from "participant-cc";

function extractTrainingParams(t: Training): TrainingParams {
  return Builder<TrainingParams>()
    .id(t.id)
    .trainingOfferId(t.trainingOfferId)
    .candidateId(t.candidateId)
    .ownerId(t.ownerId)
    .build();
}

describe("Training", () => {
  chai.use(chaiAsPromised);
  // mock adapter
  let mockAdapter: MockControllerAdapter;
  // assets controllers
  let trainingCtrl: ConvectorControllerClient<TrainingController>;
  let candidateCtrl: ConvectorControllerClient<CandidateController>;
  let trainingOfferCtrl: ConvectorControllerClient<TrainingOfferController>;
  // participants controllers
  let careerAdvisorParticipantCtrl: ConvectorControllerClient<CareerAdvisorParticipantController>;
  let trainingCompanyParticipantCtrl: ConvectorControllerClient<TrainingCompanyParticipantController>;
  let investorParticipantCtrl: ConvectorControllerClient<InvestorParticipantController>;

  let abouBlockchainTraining: TrainingParams;
  let abouHyperledgerTraining: TrainingParams;
  let abouMicroserviceTraining: TrainingParams;
  let abouEngkishTraining: TrainingParams;

  let itachiBlockchainTraining: TrainingParams;
  let itachiHyperledgerTraining: TrainingParams;
  let itachiEngkishTraining: TrainingParams;

  let julieBlockchainTraining: TrainingParams;
  let julieMicroserviceTraining: TrainingParams;
  let julieEngkishTraining: TrainingParams;

  let abou: CandidateParams;
  let julie: CandidateParams;
  let itachi: CandidateParams;

  let blockchainOffer: TrainingOfferParams;
  let hyperledger: TrainingOfferParams;
  let microserviceOffer: TrainingOfferParams;
  let englishOffer: TrainingOfferParams;

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
    mockAdapter = new MockControllerAdapter();
    trainingCtrl = ClientFactory(TrainingController, mockAdapter);
    candidateCtrl = ClientFactory(CandidateController, mockAdapter);
    trainingOfferCtrl = ClientFactory(TrainingOfferController, mockAdapter);
    careerAdvisorParticipantCtrl = ClientFactory(
      CareerAdvisorParticipantController,
      mockAdapter
    );
    trainingCompanyParticipantCtrl = ClientFactory(
      TrainingCompanyParticipantController,
      mockAdapter
    );
    investorParticipantCtrl = ClientFactory(
      InvestorParticipantController,
      mockAdapter
    );

    await mockAdapter.init([
      {
        version: "*",
        controller: TrainingController.name,
        name: join(__dirname, "..", "..", "training-cc")
      },
      {
        version: "*",
        controller: CandidateController.name,
        name: join(__dirname, "..", "..", "candidate-cc")
      },
      {
        version: "*",
        controller: TrainingOfferController.name,
        name: join(__dirname, "..", "..", "trainingOffer-cc")
      },
      {
        version: "*",
        controller: "CareerAdvisorParticipantController",
        name: join(__dirname, "..", "..", "participant-cc")
      },
      {
        version: "*",
        controller: "TrainingCompanyParticipantController",
        name: join(__dirname, "..", "..", "participant-cc")
      },
      {
        version: "*",
        controller: "InvestorParticipantController",
        name: join(__dirname, "..", "..", "participant-cc")
      }
    ]);
    (mockAdapter.stub as any).usercert = fakeParticipantCert;
    await careerAdvisorParticipantCtrl.register(
      "CareerAdvisor1",
      "CareerAdvisor1Name"
    );
    await trainingCompanyParticipantCtrl.register(
      "TrainingCompany1",
      "TrainingCompany1Name"
    );
    await investorParticipantCtrl.register("Investor1", "Investor1Name");

    /**
     * ****************************** Training Offers**************************************
     */
    abou = Builder<CandidateParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .firstName("Aboubakar")
      .lastName("Koïta")
      .build();

    julie = Builder<CandidateParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .firstName("Julie")
      .lastName("Gayet")
      .build();

    itachi = Builder<CandidateParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .firstName("Itachi")
      .lastName("Uchiha")
      .build();

    /**
     * ****************************** Training Offers**************************************
     */

    blockchainOffer = Builder<TrainingOfferParams>()
      .id(uuid())
      .ownerId("TrainingCompany1")
      .level(TrainingOfferLevel.Intermediate)
      .domain(TrainingDomain.SoftwareDevelopment)
      .description("An introduction training on blockchain technology")
      .title("Introduction to blockchain")
      .build();

    hyperledger = Builder<TrainingOfferParams>()
      .id(uuid())
      .ownerId("TrainingCompany1")
      .level(TrainingOfferLevel.Intermediate)
      .domain(TrainingDomain.SoftwareDevelopment)
      .description("Mastering Hyperledger Fabric blockchain")
      .title("Hyperledger Fabric blockchain")
      .build();

    microserviceOffer = Builder<TrainingOfferParams>()
      .id(uuid())
      .ownerId("TrainingCompany1")
      .level(TrainingOfferLevel.Advanced)
      .domain(TrainingDomain.SoftwareDevelopment)
      .description(
        "Learn what is the microservice architecture, and how to build it"
      )
      .title("Build Microservice architecture")
      .build();

    englishOffer = Builder<TrainingOfferParams>()
      .id(uuid())
      .ownerId("TrainingCompany1")
      .level(TrainingOfferLevel.Intermediate)
      .domain(TrainingDomain.General)
      .description("Basic level in english vocabulary and grammar")
      .title("Learning English")
      .build();

    /**
     * ****************************** Trainings **************************************
     */
    abouBlockchainTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(abou.id)
      .trainingOfferId(blockchainOffer.id)
      .build();

    abouHyperledgerTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(abou.id)
      .trainingOfferId(hyperledger.id)
      .build();

    abouMicroserviceTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(abou.id)
      .trainingOfferId(microserviceOffer.id)
      .build();

    abouEngkishTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(abou.id)
      .trainingOfferId(englishOffer.id)
      .build();

    itachiBlockchainTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(itachi.id)
      .trainingOfferId(blockchainOffer.id)
      .build();

    itachiHyperledgerTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(itachi.id)
      .trainingOfferId(hyperledger.id)
      .build();

    itachiEngkishTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(itachi.id)
      .trainingOfferId(englishOffer.id)
      .build();

    julieBlockchainTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(julie.id)
      .trainingOfferId(blockchainOffer.id)
      .build();

    julieMicroserviceTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(julie.id)
      .trainingOfferId(microserviceOffer.id)
      .build();

    julieEngkishTraining = Builder<TrainingParams>()
      .id(uuid())
      .ownerId("CareerAdvisor1")
      .candidateId(julie.id)
      .trainingOfferId(englishOffer.id)
      .build();
  });

  //========================================= Create a training ===================================================//
  it("should create a Training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    const justSavedModel = await Training.getOne(abouBlockchainTraining.id);
    expect(justSavedModel).to.include(abouBlockchainTraining);
  });

  it("should throw an exception when trying to create and existing training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    const justSavedModel = await Training.getOne(abouBlockchainTraining.id);
    expect(justSavedModel).to.include(abouBlockchainTraining);

    await expect(
      trainingCtrl
        .createTraining(abouBlockchainTraining)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `found an existing training with the id: "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to create a training linked to a non-existing candidate", async () => {
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    await expect(
      trainingCtrl
        .createTraining(abouBlockchainTraining)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `a new training can't be linked to a non existing candidate with id: "${abouBlockchainTraining.candidateId}"`
    );
  });

  it("should throw an exception when trying to create a training linked to a non-existing offer", async () => {
    await candidateCtrl.createCandidate(abou);
    await expect(
      trainingCtrl
        .createTraining(abouBlockchainTraining)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `a new training can't be linked to a non existing training offer with id: "${abouBlockchainTraining.trainingOfferId}"`
    );
  });

  it("should throw an exception when trying to create a training linked to a closed candidate", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    await candidateCtrl.disableCandidate(abou.id);

    await expect(
      trainingCtrl
        .createTraining(abouBlockchainTraining)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `a new training can't linked to a closed candidate - closed candidate id: "${abouBlockchainTraining.candidateId}"`
    );
  });

  it("should throw an exception when trying to create a training linked to a closed training offer", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);

    await expect(
      trainingCtrl
        .createTraining(abouBlockchainTraining)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `a new training can't linked to a closed training offer - closed training offer id: "${abouBlockchainTraining.trainingOfferId}"`
    );
  });

  //================================== Close training===================================================//
  it("should close an existing training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    const justSavedModel = await Training.getOne(abouBlockchainTraining.id);
    expect(justSavedModel).to.include(abouBlockchainTraining);
    expect(justSavedModel.status).to.be.equal(TrainingAppLifecycleStatus.Open);

    await trainingCtrl.closeTraining(abouBlockchainTraining.id);
    const closed = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(closed.id).to.be.equal(abouBlockchainTraining.id);
    expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);
  });

  it("should throw an exception when trying to close a non existing training", async () => {
    await expect(
      trainingCtrl
        .closeTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot close a non existing training with the id: "${abouBlockchainTraining.id}"`
    );
  });

  it("should thow an exception when trying to close an already closed training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    const justSavedModel = await Training.getOne(abouBlockchainTraining.id);
    expect(justSavedModel).to.include(abouBlockchainTraining);
    expect(justSavedModel.status).to.be.equal(TrainingAppLifecycleStatus.Open);

    await trainingCtrl.closeTraining(abouBlockchainTraining.id);
    const closed = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(closed.id).to.be.equal(abouBlockchainTraining.id);
    expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    await expect(
      trainingCtrl
        .closeTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot close an already closed training with the id: "${abouBlockchainTraining.id}"`
    );
  });

  //================================== Submit training application ===================================================//

  it("should submit the training application", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);

    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));

    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );
  });

  it("should throw an exception when trying to submit an application for a closed training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.closeTraining(abouBlockchainTraining.id);

    const closed = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));

    expect(closed.id).to.be.equal(abouBlockchainTraining.id);
    expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    await expect(
      trainingCtrl
        .submitTrainingApplication(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `the training with the id "${abouBlockchainTraining.id}" is not expected to be closed`
    );
  });

  it("should throw an exception when trying to submit an application for non existing training", async () => {
    await expect(
      trainingCtrl
        .submitTrainingApplication(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot submit an application for non existing training with the id: "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to submit an application for training linked to a closed candidate", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await candidateCtrl.disableCandidate(abou.id);
    const closedCandidate = await candidateCtrl
      .getCandidateById(abou.id)
      .then(result => new Candidate(result));
    expect(closedCandidate.id).to.be.equal(abou.id);
    expect(closedCandidate.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .submitTrainingApplication(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot submit an application for the training with id: "' +
        abouBlockchainTraining.id +
        '" because it' +
        ' is linked to a closed candidate with id: "' +
        abouBlockchainTraining.candidateId +
        '"'
    );
  });

  it("should throw an exception when trying to submit an application for a training linked to a closed training offer", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
    const trainingOfferClosed = await trainingOfferCtrl
      .getTrainingOfferById(blockchainOffer.id)
      .then(result => new TrainingOffer(result));
    expect(trainingOfferClosed.id).to.be.equal(blockchainOffer.id);
    expect(trainingOfferClosed.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .submitTrainingApplication(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot submit an application for the training with id: "' +
        abouBlockchainTraining.id +
        '" because it' +
        ' is linked to a closed training offer with id: "' +
        abouBlockchainTraining.trainingOfferId +
        '"'
    );
  });

  //================================== accept a trainig application ===================================================//

  it("should accept a valid training application", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));

    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );
  });

  it("should throw an exception when trying to fund a training not submitted", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await expect(
      trainingCtrl
        .acceptApplication(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot start fund training with the id: "' +
        abouBlockchainTraining.id +
        '" because it\'s process is expected to be "' +
        TrainingProcessStatus.Submitted +
        '" instead of "' +
        TrainingProcessStatus.NotSubmitted +
        '"'
    );
  });

  it("should throw an exception when trying to accept an application for a closed training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.closeTraining(abouBlockchainTraining.id);
    const closed = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));

    expect(closed.id).to.be.equal(abouBlockchainTraining.id);
    expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    await expect(
      trainingCtrl
        .acceptApplication(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot accept an application for a closed training with the id "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to accept an application for an non existing training", async () => {
    await expect(
      trainingCtrl
        .acceptApplication(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot accept an application for non existing training with the id: "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to accept an application for a training linked to a closed candidate", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await candidateCtrl.disableCandidate(abou.id);
    const closedCandidate = await candidateCtrl
      .getCandidateById(abou.id)
      .then(result => new Candidate(result));
    expect(closedCandidate.id).to.be.equal(abou.id);
    expect(closedCandidate.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .acceptApplication(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot accept an application for the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed candidate with the id: "' +
        abouBlockchainTraining.candidateId +
        '"'
    );
  });

  it("should throw an exception when trying to accept an application for a training linked to a closed training offer", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
    const closedTrainingOffer = await trainingOfferCtrl
      .getTrainingOfferById(blockchainOffer.id)
      .then(result => new TrainingOffer(result));
    expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
    expect(closedTrainingOffer.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .acceptApplication(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot accept an application for the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed training offer with the id: "' +
        abouBlockchainTraining.trainingOfferId +
        '"'
    );
  });

  //================================== fund a training ===================================================//

  it("should fund a valid training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);
  });

  it("should throw an exception when trying to fund a training not accepted", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await expect(
      trainingCtrl
        .fundTraining(abouBlockchainTraining.id, "Investor1")
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot start fund training with the id: "' +
        abouBlockchainTraining.id +
        '" because it\'s process is expected to be "' +
        TrainingProcessStatus.Accepted +
        '" instead of "' +
        TrainingProcessStatus.NotSubmitted +
        '"'
    );
  });

  it("should throw an exception when trying to fund a closed training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.closeTraining(abouBlockchainTraining.id);
    const closed = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));

    expect(closed.id).to.be.equal(abouBlockchainTraining.id);
    expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    await expect(
      trainingCtrl
        .fundTraining(abouBlockchainTraining.id, "Investor1")
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot fund a closed training with the id "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to fund a non existing training", async () => {
    await expect(
      trainingCtrl
        .fundTraining(abouBlockchainTraining.id, "TrainingCompany1")
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot fund a non existing training with the id: "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to fund a training linked to a closed candidate", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await candidateCtrl.disableCandidate(abou.id);
    const closedCandidate = await candidateCtrl
      .getCandidateById(abou.id)
      .then(result => new Candidate(result));
    expect(closedCandidate.id).to.be.equal(abou.id);
    expect(closedCandidate.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .fundTraining(abouBlockchainTraining.id, "Investor1")
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot fund the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed candidate with the id: "' +
        abouBlockchainTraining.candidateId +
        '"'
    );
  });

  it("should throw an exception when trying to fund a training linked to a closed training offer", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
    const closedTrainingOffer = await trainingOfferCtrl
      .getTrainingOfferById(blockchainOffer.id)
      .then(result => new TrainingOffer(result));
    expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
    expect(closedTrainingOffer.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .fundTraining(abouBlockchainTraining.id, "Investor1")
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot fund the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed training offer with the id: "' +
        abouBlockchainTraining.trainingOfferId +
        '"'
    );
  });

  //================================== start a training ===================================================//

  it("should start a valid training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.startTraining(abouBlockchainTraining.id);
    const started = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(started.id).to.equal(abouBlockchainTraining.id);
    expect(started.trainingProcessStatus).to.equal(
      TrainingProcessStatus.InProgress
    );
  });

  it("should throw an exception when trying to start a closed training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.closeTraining(abouBlockchainTraining.id);
    const closed = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(closed.id).to.be.equal(abouBlockchainTraining.id);
    expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    await expect(
      trainingCtrl
        .startTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot start a closed training with the id "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to start a training not funded", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    console.log(abouBlockchainTraining.id);
    await trainingCtrl.createTraining(abouBlockchainTraining);

    await expect(
      trainingCtrl
        .startTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot start the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it\'s process is expected to be "' +
        TrainingProcessStatus.Funded +
        '" instead of "' +
        TrainingProcessStatus.NotSubmitted +
        '"'
    );
  });

  it("should throw an exception when trying to start anon existing training", async () => {
    await expect(
      trainingCtrl
        .startTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot start a non existing training with the id: "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to start a training linked to a closed candidate", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await candidateCtrl.disableCandidate(abou.id);
    const closedCandidate = await candidateCtrl
      .getCandidateById(abou.id)
      .then(result => new Candidate(result));
    expect(closedCandidate.id).to.be.equal(abou.id);
    expect(closedCandidate.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .startTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot start the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed candidate with the id: "' +
        abouBlockchainTraining.candidateId +
        '"'
    );
  });

  it("should throw an exception when trying to start a training linked to a closed training offer", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
    const closedTrainingOffer = await trainingOfferCtrl
      .getTrainingOfferById(blockchainOffer.id)
      .then(result => new TrainingOffer(result));
    expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
    expect(closedTrainingOffer.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .startTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot start the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed training offer with the id: "' +
        abouBlockchainTraining.trainingOfferId +
        '"'
    );
  });

  //================================== certify a training ===================================================//

  it("should certify a valid training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));

    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.startTraining(abouBlockchainTraining.id);
    const started = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(started.id).to.equal(abouBlockchainTraining.id);
    expect(started.trainingProcessStatus).to.equal(
      TrainingProcessStatus.InProgress
    );

    await trainingCtrl.certifyTraining(abouBlockchainTraining.id);
    const certified = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(certified.id).to.equal(abouBlockchainTraining.id);
    expect(certified.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Succeeded
    );
  });

  it("should throw an exception when trying to certify a closed training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.startTraining(abouBlockchainTraining.id);
    const started = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(started.id).to.equal(abouBlockchainTraining.id);
    expect(started.trainingProcessStatus).to.equal(
      TrainingProcessStatus.InProgress
    );

    await trainingCtrl.closeTraining(abouBlockchainTraining.id);
    const closed = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(closed.id).to.be.equal(abouBlockchainTraining.id);
    expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    await expect(
      trainingCtrl
        .certifyTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot certify a closed training with the id "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to certify a training not started", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await expect(
      trainingCtrl
        .certifyTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot certify the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it\'s process is expected to be "' +
        TrainingProcessStatus.InProgress +
        '" instead of "' +
        TrainingProcessStatus.NotSubmitted +
        '"'
    );
  });

  it("should throw an exception when trying to certify a non existing training", async () => {
    await expect(
      trainingCtrl
        .certifyTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot certify a non existing training with the id: "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to certify a training linked to a closed candidate", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.startTraining(abouBlockchainTraining.id);
    const started = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(started.id).to.equal(abouBlockchainTraining.id);
    expect(started.trainingProcessStatus).to.equal(
      TrainingProcessStatus.InProgress
    );

    await candidateCtrl.disableCandidate(abou.id);
    const closedCandidate = await candidateCtrl
      .getCandidateById(abou.id)
      .then(result => new Candidate(result));
    expect(closedCandidate.id).to.be.equal(abou.id);
    expect(closedCandidate.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .certifyTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot certify the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed candidate with the id: "' +
        abouBlockchainTraining.candidateId +
        '"'
    );
  });

  it("should throw an exception when trying to certify  a training linked to a closed training offer", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.startTraining(abouBlockchainTraining.id);
    const started = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(started.id).to.equal(abouBlockchainTraining.id);
    expect(started.trainingProcessStatus).to.equal(
      TrainingProcessStatus.InProgress
    );

    await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
    const closedTrainingOffer = await trainingOfferCtrl
      .getTrainingOfferById(blockchainOffer.id)
      .then(result => new TrainingOffer(result));
    expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
    expect(closedTrainingOffer.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .certifyTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot certify the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed training offer with the id: "' +
        abouBlockchainTraining.trainingOfferId +
        '"'
    );
  });

  //================================== fail a training ===================================================//

  it("should fail a valid training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.startTraining(abouBlockchainTraining.id);
    const started = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(started.id).to.equal(abouBlockchainTraining.id);
    expect(started.trainingProcessStatus).to.equal(
      TrainingProcessStatus.InProgress
    );

    await trainingCtrl.failTraining(abouBlockchainTraining.id);
    const certified = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(certified.id).to.equal(abouBlockchainTraining.id);
    expect(certified.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Failed
    );
  });

  it("should throw an exception when trying to fail a closed training", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.startTraining(abouBlockchainTraining.id);
    const started = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(started.id).to.equal(abouBlockchainTraining.id);
    expect(started.trainingProcessStatus).to.equal(
      TrainingProcessStatus.InProgress
    );

    await trainingCtrl.closeTraining(abouBlockchainTraining.id);
    const closed = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(closed.id).to.be.equal(abouBlockchainTraining.id);
    expect(closed.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    await expect(
      trainingCtrl
        .failTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot fail a closed training with the id "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to fail a training not started", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await expect(
      trainingCtrl
        .failTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot fail the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it\'s process is expected to be "' +
        TrainingProcessStatus.InProgress +
        '" instead of "' +
        TrainingProcessStatus.NotSubmitted +
        '"'
    );
  });

  it("should throw an exception when trying to fail a non existing training", async () => {
    await expect(
      trainingCtrl
        .failTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `cannot fail a non existing training with the id: "${abouBlockchainTraining.id}"`
    );
  });

  it("should throw an exception when trying to fail a training linked to a closed candidate", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.startTraining(abouBlockchainTraining.id);
    const started = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(started.id).to.equal(abouBlockchainTraining.id);
    expect(started.trainingProcessStatus).to.equal(
      TrainingProcessStatus.InProgress
    );

    await candidateCtrl.disableCandidate(abou.id);
    const closedCandidate = await candidateCtrl
      .getCandidateById(abou.id)
      .then(result => new Candidate(result));
    expect(closedCandidate.id).to.be.equal(abou.id);
    expect(closedCandidate.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .failTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot fail the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed candidate with the id: "' +
        abouBlockchainTraining.candidateId +
        '"'
    );
  });

  it("should throw an exception when trying to fail  a training linked to a closed training offer", async () => {
    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingCtrl.createTraining(abouBlockchainTraining);

    await trainingCtrl.submitTrainingApplication(abouBlockchainTraining.id);
    const submitted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(submitted.id).to.be.equal(abouBlockchainTraining.id);
    expect(submitted.trainingProcessStatus).to.be.equal(
      TrainingProcessStatus.Submitted
    );

    await trainingCtrl.acceptApplication(abouBlockchainTraining.id);
    const accepted = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(accepted.id).to.equal(abouBlockchainTraining.id);
    expect(accepted.trainingProcessStatus).to.equal(
      TrainingProcessStatus.Accepted
    );

    await trainingCtrl.fundTraining(abouBlockchainTraining.id, "Investor1");
    const funded = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(funded.id).to.equal(abouBlockchainTraining.id);
    expect(funded.trainingProcessStatus).to.equal(TrainingProcessStatus.Funded);

    await trainingCtrl.startTraining(abouBlockchainTraining.id);
    const started = await trainingCtrl
      .getTrainingById(abouBlockchainTraining.id)
      .then(result => new Training(result));
    expect(started.id).to.equal(abouBlockchainTraining.id);
    expect(started.trainingProcessStatus).to.equal(
      TrainingProcessStatus.InProgress
    );

    await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
    const closedTrainingOffer = await trainingOfferCtrl
      .getTrainingOfferById(blockchainOffer.id)
      .then(result => new TrainingOffer(result));
    expect(closedTrainingOffer.id).to.be.equal(blockchainOffer.id);
    expect(closedTrainingOffer.status).to.be.equal(
      TrainingAppLifecycleStatus.Closed
    );

    await expect(
      trainingCtrl
        .failTraining(abouBlockchainTraining.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'cannot fail the training with the id: "' +
        abouBlockchainTraining.id +
        '" because it ' +
        'is linked to a closed training offer with the id: "' +
        abouBlockchainTraining.trainingOfferId +
        '"'
    );
  });

  it("should return the trainings linked to the candidates ids provided", async () => {
    const abouTrainings0 = await trainingCtrl.getTrainingsByCandidatesIds([
      abou.id
    ]);
    expect(abouTrainings0).to.be.empty;

    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    await trainingCtrl.createTraining(abouBlockchainTraining);
    const abouTrainings1 = await trainingCtrl
      .getTrainingsByCandidatesIds([abou.id])
      .then(result => result.map(training => new Training(training)));
    expect(
      abouTrainings1.map(t => extractTrainingParams(t))
    ).to.have.same.deep.members([abouBlockchainTraining]);

    await trainingOfferCtrl.createTrainingOffer(hyperledger);
    await trainingCtrl.createTraining(abouHyperledgerTraining);
    const abouTrainings2 = await trainingCtrl
      .getTrainingsByCandidatesIds([abou.id])
      .then(result => result.map(training => new Training(training)));
    expect(
      abouTrainings2.map(t => extractTrainingParams(t))
    ).to.have.same.deep.members([
      abouBlockchainTraining,
      abouHyperledgerTraining
    ]);

    await trainingOfferCtrl.createTrainingOffer(microserviceOffer);
    await trainingCtrl.createTraining(abouMicroserviceTraining);
    const abouTrainings3 = await trainingCtrl
      .getTrainingsByCandidatesIds([abou.id])
      .then(result => result.map(training => new Training(training)));
    expect(
      abouTrainings3.map(t => extractTrainingParams(t))
    ).to.have.same.deep.members([
      abouBlockchainTraining,
      abouHyperledgerTraining,
      abouMicroserviceTraining
    ]);

    const julieTrainings0 = await trainingCtrl.getTrainingsByCandidatesIds([
      julie.id
    ]);
    expect(julieTrainings0).to.be.empty;

    await candidateCtrl.createCandidate(julie);
    await trainingCtrl.createTraining(julieBlockchainTraining);
    const julieTrainings1 = await trainingCtrl
      .getTrainingsByCandidatesIds([julie.id])
      .then(result => result.map(training => new Training(training)));
    expect(
      julieTrainings1.map(t => extractTrainingParams(t))
    ).to.have.same.deep.members([julieBlockchainTraining]);

    await trainingCtrl.createTraining(julieMicroserviceTraining);
    const julieTrainings2 = await trainingCtrl
      .getTrainingsByCandidatesIds([julie.id])
      .then(result => result.map(training => new Training(training)));
    expect(
      julieTrainings2.map(t => extractTrainingParams(t))
    ).to.have.same.deep.members([
      julieBlockchainTraining,
      julieMicroserviceTraining
    ]);

    const julieAndAbouTrainings = await trainingCtrl
      .getTrainingsByCandidatesIds([julie.id, abou.id])
      .then(result => result.map(training => new Training(training)));
    expect(
      julieAndAbouTrainings.map(t => extractTrainingParams(t))
    ).to.have.same.deep.members([
      julieBlockchainTraining,
      julieMicroserviceTraining,
      abouBlockchainTraining,
      abouHyperledgerTraining,
      abouMicroserviceTraining
    ]);
  });

  it("should return the trainings in the process status provided", async () => {
    const trainings0 = await trainingCtrl.getTrainingsByProcessStatus([
      TrainingProcessStatus.NotSubmitted
    ]);
    expect(trainings0).to.be.empty;

    await candidateCtrl.createCandidate(abou);
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    await trainingCtrl.createTraining(abouBlockchainTraining);
    await expect(
      trainingCtrl
        .getTrainingsByProcessStatus([TrainingProcessStatus.NotSubmitted])
        .then(result =>
          result.map(training => extractTrainingParams(new Training(training)))
        )
    ).to.have.eventually.same.deep.members([abouBlockchainTraining]);
    await expect(
      trainingCtrl
        .getTrainingsByProcessStatus([TrainingProcessStatus.Submitted])
        .then(result => result.map(training => new Training(training)))
    ).to.be.eventually.empty;

    await trainingOfferCtrl.createTrainingOffer(hyperledger);
    await trainingCtrl.createTraining(abouHyperledgerTraining);
    await expect(
      trainingCtrl
        .getTrainingsByProcessStatus([TrainingProcessStatus.NotSubmitted])
        .then(result =>
          result.map(training => extractTrainingParams(new Training(training)))
        )
    ).to.have.eventually.same.deep.members([
      abouHyperledgerTraining,
      abouBlockchainTraining
    ]);

    await trainingCtrl.submitTrainingApplication(abouHyperledgerTraining.id);
    await expect(
      trainingCtrl
        .getTrainingsByProcessStatus([TrainingProcessStatus.NotSubmitted])
        .then(result =>
          result.map(training => extractTrainingParams(new Training(training)))
        )
    ).to.have.eventually.same.deep.members([abouBlockchainTraining]);
    await expect(
      trainingCtrl
        .getTrainingsByProcessStatus([TrainingProcessStatus.Submitted])
        .then(result =>
          result.map(training => {
            const converted = new Training(training);
            return [converted.id, converted.trainingProcessStatus];
          })
        )
    ).to.have.eventually.same.deep.members([
      [abouHyperledgerTraining.id, TrainingProcessStatus.Submitted]
    ]);
  });
});
