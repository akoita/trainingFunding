import {WebappApplication} from '../..';
import {Client, createRestAppClient, givenHttpServerConfig,} from '@loopback/testlab';
import {MockControllerAdapter} from "@worldsibu/convector-adapter-mock";
import {CandidateController} from "candidate-cc";
import {join} from "path";

import {ClientFactory} from '@worldsibu/convector-core';
import {TrainingController} from "training-cc";
import {TrainingOfferController} from "trainingOffer-cc";
import {TrainingControllerBackEnd, TrainingOfferControllerBackEnd} from "../../convector";

export async function setupApplication(): Promise<AppWithClient> {

    const trainingCtrlAdapter = new MockControllerAdapter();
    const trainingFabricCtrl = ClientFactory(TrainingController, trainingCtrlAdapter);
    const candidateFabricCtrl = ClientFactory(CandidateController, trainingCtrlAdapter);
    const trainingFabricOfferCtrl = ClientFactory(TrainingOfferController, trainingCtrlAdapter);

    await trainingCtrlAdapter.init([
        {
            version: '*',
            controller: TrainingController.name,
            name: join(__dirname, '..', '..', '..', '..', 'training-cc')
        },
        {
            version: '*',
            controller: CandidateController.name,
            name: join(__dirname, '..', '..', '..', '..', 'candidate-cc')
        },
        {
            version: '*',
            controller: TrainingOfferController.name,
            name: join(__dirname, '..', '..', '..', '..', 'trainingOffer-cc')
        }
    ]);

    const restConfig = givenHttpServerConfig({
        // Customize the server configuration here.
        // Empty values (undefined, '') will be ignored by the helper.
        //
        // host: process.env.HOST,
        // port: +process.env.PORT,
    });

    const app = new WebappApplication({
        rest: restConfig,
    });

    app.bind('CandidateControllerBackEnd').to(candidateFabricCtrl);
    app.bind('TrainingOfferControllerBackEnd').to(trainingFabricOfferCtrl);
    app.bind('TrainingControllerBackEnd').to(trainingFabricCtrl);

    await app.boot();
    await app.start();

    const client = createRestAppClient(app);

    return {app, client};
}

export interface AppWithClient {
    app: WebappApplication;
    client: Client;
}
