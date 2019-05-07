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

import {
  TrainingDomain,
  TrainingOffer,
  TrainingOfferController,
  TrainingOfferLevel,
  TrainingOfferParams
} from "../src";
import { TrainingAppLifecycleStatus } from "common-cc";
import { TrainingCompanyParticipantController } from "participant-cc";
import { Builder } from "builder-pattern";

function extractTrainingOfferParams(
  trainingOffer: TrainingOffer
): TrainingOfferParams {
  return Builder<TrainingOfferParams>()
    .id(trainingOffer.id)
    .ownerId(trainingOffer.ownerId)
    .title(trainingOffer.title)
    .description(trainingOffer.description)
    .domain(trainingOffer.domain)
    .level(trainingOffer.level)
    .build();
}

describe("TrainingOffer", () => {
  chai.use(chaiAsPromised);
  let adapter: MockControllerAdapter;
  let trainingOfferCtrl: ConvectorControllerClient<TrainingOfferController>;
  let trainingCompanyCtrl: ConvectorControllerClient<
    TrainingCompanyParticipantController
  >;

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
    adapter = new MockControllerAdapter();
    trainingOfferCtrl = ClientFactory(TrainingOfferController, adapter);
    trainingCompanyCtrl = ClientFactory(
      TrainingCompanyParticipantController,
      adapter
    );

    await adapter.init([
      {
        version: "*",
        controller: "TrainingOfferController",
        name: join(__dirname, "..")
      },
      {
        version: "*",
        controller: "TrainingCompanyParticipantController",
        name: join(__dirname, "..", "..", "participant-cc")
      }
    ]);
    (adapter.stub as any).usercert = fakeParticipantCert;
    await trainingCompanyCtrl.register(
      "TrainingCompany1",
      "TrainingCompany1Name"
    );

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
  });

  it("should create a Training Offer", async () => {
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    const justSavedModel = await TrainingOffer.getOne(blockchainOffer.id);
    expect(justSavedModel).to.include(blockchainOffer);
    expect(justSavedModel.status).to.eql(TrainingAppLifecycleStatus.Open);
  });

  it("should fail to create a Training Offer when the supposed owner does not exist", async () => {
    blockchainOffer.ownerId = "falseId";
    await expect(
      trainingOfferCtrl
        .createTrainingOffer(blockchainOffer)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      "no Training company participant found with the id falseId"
    );
  });

  it("should close the training offer", async () => {
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);

    await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
    const saved = await TrainingOffer.getOne(blockchainOffer.id);
    expect(saved.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    await expect(
      trainingOfferCtrl
        .closeTrainingOffer("noExistingID")
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      "no existing training offer found with the id: noExistingID"
    );
  });

  it("should close the training offer when the caller identity is different from the owner identity", async () => {
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    (adapter.stub as any).usercert = fakeSecondParticipantCert;
    await expect(
      trainingOfferCtrl
        .closeTrainingOffer(blockchainOffer.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      'the transaction caller identity "56:74:69:D7:C5:A4:C5:2D:4B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82" does not match Training company  participant active identity "01:46:C7:C0:A7:11:54:33:7F:19:31:7B:9D:66:DC:07:35:FF:28:57"'
    );
  });

  it("should fail to close a training offer already closed", async () => {
    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    await trainingOfferCtrl.closeTrainingOffer(blockchainOffer.id);
    const saved = await TrainingOffer.getOne(blockchainOffer.id);
    expect(saved.status).to.be.equal(TrainingAppLifecycleStatus.Closed);

    await expect(
      trainingOfferCtrl
        .closeTrainingOffer(blockchainOffer.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal("training offer's status is already closed");
  });

  it("should fail to close a not existing training offer", async () => {
    await expect(
      trainingOfferCtrl
        .closeTrainingOffer(blockchainOffer.id)
        .catch(ex => ex.responses[0].error.message)
    ).to.be.eventually.equal(
      `no existing training offer found with the id: ${blockchainOffer.id}`
    );
  });

  it("should return all training offers", async () => {
    expect(await trainingOfferCtrl.listTrainingOffers()).to.be.empty;

    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    const allData = await trainingOfferCtrl.listTrainingOffers().then(models =>
      models.map(model => {
        return new TrainingOffer(model);
      })
    );
    expect(
      allData.map(d => extractTrainingOfferParams(d))
    ).to.have.same.deep.members([blockchainOffer]);

    await trainingOfferCtrl.createTrainingOffer(microserviceOffer);
    const allData2 = await trainingOfferCtrl.listTrainingOffers().then(models =>
      models.map(model => {
        return new TrainingOffer(model);
      })
    );

    expect(
      allData2.map(d => extractTrainingOfferParams(d))
    ).to.have.same.deep.members([blockchainOffer, microserviceOffer]);

    await trainingOfferCtrl.createTrainingOffer(englishOffer);
    const allData3 = await trainingOfferCtrl.listTrainingOffers().then(models =>
      models.map(model => {
        return new TrainingOffer(model);
      })
    );
    expect(
      allData3.map(d => extractTrainingOfferParams(d))
    ).to.have.same.deep.members([
      blockchainOffer,
      microserviceOffer,
      englishOffer
    ]);
  });

  it("should search the training offers by title or description", async () => {
    let result = await trainingOfferCtrl.searchTrainingOffersByTitleOrDescription(
      "blockchain"
    );
    if (Array.isArray(result)) {
      expect(result).to.be.empty;
    }

    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    result = await trainingOfferCtrl.searchTrainingOffersByTitleOrDescription(
      "blockchain"
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([blockchainOffer]);
    }

    await trainingOfferCtrl.createTrainingOffer(hyperledger);
    result = await trainingOfferCtrl.searchTrainingOffersByTitleOrDescription(
      "blockchain"
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([blockchainOffer, hyperledger]);
    }

    await trainingOfferCtrl.createTrainingOffer(microserviceOffer);
    result = await trainingOfferCtrl.searchTrainingOffersByTitleOrDescription(
      "Microservice"
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([microserviceOffer]);
    }

    result = await trainingOfferCtrl.searchTrainingOffersByTitleOrDescription(
      "General"
    );
    if (Array.isArray(result)) {
      expect(result).to.be.empty;
    }

    await trainingOfferCtrl.createTrainingOffer(englishOffer);
    result = await trainingOfferCtrl.searchTrainingOffersByTitleOrDescription(
      "english"
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([englishOffer]);
    }
  });

  it("should search the training offers by domain", async () => {
    let result = await trainingOfferCtrl.searchTrainingOffersByDomain(
      TrainingDomain.General
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return model;
        })
      ).to.be.empty;
    }

    await trainingOfferCtrl.createTrainingOffer(englishOffer);
    result = await trainingOfferCtrl.searchTrainingOffersByDomain(
      TrainingDomain.General
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([englishOffer]);
    }

    result = await trainingOfferCtrl.searchTrainingOffersByDomain(
      TrainingDomain.SoftwareDevelopment
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return new TrainingOffer(model);
        })
      ).to.be.empty;
    }

    await trainingOfferCtrl.createTrainingOffer(microserviceOffer);
    result = await trainingOfferCtrl.searchTrainingOffersByDomain(
      TrainingDomain.SoftwareDevelopment
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([microserviceOffer]);
    }

    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    result = await trainingOfferCtrl.searchTrainingOffersByDomain(
      TrainingDomain.SoftwareDevelopment
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([blockchainOffer, microserviceOffer]);
    }
  });

  it("should search the training offers by domain and level", async () => {
    let result = await trainingOfferCtrl.searchTrainingOffersByDomainAndLevel(
      TrainingDomain.SoftwareDevelopment,
      TrainingOfferLevel.Intermediate
    );
    if (Array.isArray(result)) {
      expect(result).to.be.empty;
    }

    await trainingOfferCtrl.createTrainingOffer(blockchainOffer);
    result = await trainingOfferCtrl.searchTrainingOffersByDomainAndLevel(
      TrainingDomain.SoftwareDevelopment,
      TrainingOfferLevel.Intermediate
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([blockchainOffer]);
    }

    result = await trainingOfferCtrl.searchTrainingOffersByDomainAndLevel(
      TrainingDomain.SoftwareDevelopment,
      TrainingOfferLevel.Advanced
    );
    if (Array.isArray(result)) {
      expect(result).to.be.empty;
    }
    await trainingOfferCtrl.createTrainingOffer(hyperledger);
    result = await trainingOfferCtrl.searchTrainingOffersByDomainAndLevel(
      TrainingDomain.SoftwareDevelopment,
      TrainingOfferLevel.Intermediate
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([blockchainOffer, hyperledger]);
    }

    result = await trainingOfferCtrl.searchTrainingOffersByDomainAndLevel(
      TrainingDomain.SoftwareDevelopment,
      TrainingOfferLevel.Advanced
    );
    if (Array.isArray(result)) {
      expect(result).to.be.empty;
    }
    await trainingOfferCtrl.createTrainingOffer(microserviceOffer);
    result = await trainingOfferCtrl.searchTrainingOffersByDomainAndLevel(
      TrainingDomain.SoftwareDevelopment,
      TrainingOfferLevel.Advanced
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([microserviceOffer]);
    }

    result = await trainingOfferCtrl.searchTrainingOffersByDomainAndLevel(
      TrainingDomain.General,
      TrainingOfferLevel.Advanced
    );
    if (Array.isArray(result)) {
      expect(result).to.be.empty;
    }
    await trainingOfferCtrl.createTrainingOffer(englishOffer);
    result = await trainingOfferCtrl.searchTrainingOffersByDomainAndLevel(
      TrainingDomain.General,
      TrainingOfferLevel.Intermediate
    );
    if (Array.isArray(result)) {
      expect(
        result.map(model => {
          return extractTrainingOfferParams(new TrainingOffer(model));
        })
      ).to.have.same.deep.members([englishOffer]);
    }
  });
});
