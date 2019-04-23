import {WebappApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {CandidateControllerBackEnd, TrainingOfferControllerBackEnd, TrainingControllerBackEnd} from './convector';

export {WebappApplication};

export async function main(options: ApplicationConfig = {}) {
   const app = new WebappApplication(options);
  app.bind('CandidateControllerBackEnd').to(CandidateControllerBackEnd);
  app.bind('TrainingOfferControllerBackEnd').to(TrainingOfferControllerBackEnd);
  app.bind('TrainingControllerBackEnd').to(TrainingControllerBackEnd);
  await app.boot();
  await app.start();



  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
