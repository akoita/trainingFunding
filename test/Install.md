# Setup and test
After cloning the projet, install Convector-Cli and hurley

```
npm install -g @worldsibu/convector-cli

npm i -g @worldsibu/hurley
```

Enter in the folder of the project, and install it:
```
npm i
```

Deploy a development environment of Fabric with hurley:
```
hurl new
```

Deploy the chaincodes in this dev environment:
```
npm run cc:start -- training

# npm run cc:start -- candidate

# npm run cc:start -- trainingOffer

```
This command will read the deployment configuration in the project and make the deployment.


Once the chaincodes deployed, we can make invocations and requests on them. Let's defin the test data sample:

```
export CAREER_ADVISOR1='careerAdvisor1 careerAdvisor1Name'
export TRANING_COMPANY1='trainingCompany1 trainingCompany1Name'
export INVESTOR1='Investor1 Investor1Name'


export CANDIDATE1='{"type":"io.worldsibu.candidate","id":"c1","firstName":"Aboubakar","lastName":"Koïta","status":"Open"}'
export CANDIDATE2='{"type":"io.worldsibu.candidate","id":"c2","firstName":"Soumaya","lastName":"Koïta","created":1554525542494,"modified":1554525542494,"status":"Open"}'
export CANDIDATE3='{"type":"io.worldsibu.candidate","id":"c3","firstName":"Dede","lastName":"Koïta","created":1554525542495,"modified":1554525542495,"status":"Open"}'
export CANDIDATE4='{"type":"io.worldsibu.candidate","id":"c4","firstName":"Bafanta","lastName":"Koïta","created":1554525542495,"modified":1554525542495,"status":"Open"}'


export OTRAINING1='{"id":"to1","type":"io.worldsibu.trainingOffer","title":"Introduction to blockchain","description":"An introduction training on blockchain technology","domain":"SoftwareDevelopment","level":"Intermediate","created":1555719374171,"modified":1555719374171,"status":"Open"}'
export OTRAINING2='{"id":"to2","type":"io.worldsibu.trainingOffer","title":"Hyperledger Fabric blockchain","description":"Mastering Hyperledger Fabric blockchain","domain":"SoftwareDevelopment","level":"Intermediate","created":1555719374175,"modified":1555719374175,"status":"Open"}'
export OTRAINING3='{"id":"to3","type":"io.worldsibu.trainingOffer","title":"Build Microservice architecture","description":"Learn what is the microservice architecture, and how to build it","domain":"SoftwareDevelopment","level":"Advanced","created":1555719374175,"modified":1555719374175,"status":"Open"}'
export OTRAINING4='{"id":"to4","type":"io.worldsibu.trainingOffer","title":"Learning English","description":"Basic level in english vocabulary and grammar","domain":"General","level":"Intermediate","created":1555719374176,"modified":1555719374176,"status":"Open"}'

export TRAINING1='{"id":"t1","type":"io.worldsibu.training","trainingOfferId":"to1","candidateId":"c1","trainingProcessStatus":"NotSubmitted","created":1555771546985,"modified":1555771546985,"status":"Open"}'
export TRAINING2='{"id":"t2","type":"io.worldsibu.training","trainingOfferId":"to3","candidateId":"c1","trainingProcessStatus":"NotSubmitted","created":1555771546985,"modified":1555771546985,"status":"Open"}'
export TRAINING3='{"id":"t3","type":"io.worldsibu.training","trainingOfferId":"to1","candidateId":"c2","trainingProcessStatus":"NotSubmitted","created":1555771546982,"modified":1555771546982,"status":"Open"}'
export TRAINING4='{"id":"t4","type":"io.worldsibu.training","trainingOfferId":"to2","candidateId":"c2","trainingProcessStatus":"NotSubmitted","created":1555771546983,"modified":1555771546983,"status":"Open"}'
export TRAINING5='{"id":"t5","type":"io.worldsibu.training","trainingOfferId":"to3","candidateId":"c3","trainingProcessStatus":"NotSubmitted","created":1555771546983,"modified":1555771546983,"status":"Open"}'

```

Now let's invok the contracts to create somme resources and request them in the blockchain.

First, let's create the participants:
``` 
hurl invoke training careerAdvisor_register $CAREER_ADVISOR1
hurl invoke training careerAdvisor_getParticipantById "careerAdvisor1"

hurl invoke training trainingCompany_register $TRANING_COMPANY1
hurl invoke training trainingCompany_getParticipantById "trainingCompany1"

hurl invoke training investor_register $INVESTOR1
hurl invoke training investor_getParticipantById "Investor1"
```

Then the candidates: 
```
hurl invoke training candidate_createCandidate "$CANDIDATE1"
hurl invoke training candidate_createCandidate "$CANDIDATE2"
hurl invoke training candidate_createCandidate "$CANDIDATE3"
hurl invoke training candidate_createCandidate "$CANDIDATE4"

hurl invoke training candidate_listCandidates

hurl invoke training candidate_getCandidateById c1

hurl invoke training candidate_searchCandidate "Aboubakar"

docker logs peer0.org1.hurley.lab  2>&1 | grep "CouchDB index"
```

Then the training offers:
```
hurl invoke training trainingOffer_createTrainingOffer "$OTRAINING1"
hurl invoke training trainingOffer_createTrainingOffer "$OTRAINING2"
hurl invoke training trainingOffer_createTrainingOffer "$OTRAINING3"
hurl invoke training trainingOffer_createTrainingOffer "$OTRAINING4"


hurl invoke training trainingOffer_listTrainingOffers
            training
hurl invoke training trainingOffer_searchTrainingOffersByTitleAndDescription block
            training
hurl invoke training trainingOffer_searchTrainingOffersByDomain SoftwareDevelopment
²           training
hurl invoke training trainingOffer_searchTrainingOffersByDomain General
            training
hurl invoke training trainingOffer_searchTrainingOffersByDomainAndLevel SoftwareDevelopment Intermediate
            training
hurl invoke training trainingOffer_searchTrainingOffersByDomainAndLevel SoftwareDevelopment Advanced
```

Then the training:
```

hurl invoke training training_createTraining "$TRAINING1"
hurl invoke training training_createTraining "$TRAINING2"
hurl invoke training training_createTraining "$TRAINING3"
hurl invoke training training_createTraining "$TRAINING4"
hurl invoke training training_createTraining "$TRAINING5"

hurl invoke training training_getTrainingById t1

hurl invoke training training_getTrainingsByCandidatesIds '["c1","c2","c3"]'

hurl invoke training training_getTrainingsByProcessStatus '["NotSubmitted"]'

hurl invoke training training_submitTrainingApplication t1

hurl invoke training training_submitTrainingApplication t2

hurl invoke training training_submitTrainingApplication t3

hurl invoke training training_submitTrainingApplication t4

hurl invoke training training_getTrainingsByProcessStatus '["Submitted"]'

hurl invoke training training_getTrainingsByProcessStatus '["Accepted"]'
hurl invoke training training_acceptApplication t4
hurl invoke training training_acceptApplication t3
hurl invoke training training_acceptApplication t2
hurl invoke training training_getTrainingsByProcessStatus '["Accepted"]'

hurl invoke training training_getTrainingsByProcessStatus '["Funded"]'
hurl invoke training training_fundTraining t4
hurl invoke training training_fundTraining t3
hurl invoke training training_getTrainingsByProcessStatus '["Funded"]'

hurl invoke training training_getTrainingsByProcessStatus '["InProgress"]'
hurl invoke training training_startTraining t4
hurl invoke training training_startTraining t3
hurl invoke training training_getTrainingsByProcessStatus '["InProgress"]'

hurl invoke training training_getTrainingsByProcessStatus '["Succeeded","Failed"]'
hurl invoke training training_failTraining t4
hurl invoke training training_certifyTraining t3
hurl invoke training training_getTrainingsByProcessStatus '["Succeeded","Failed"]'

hurl invoke training training_getTrainingById t1
hurl invoke training training_closeTraining t1
hurl invoke training training_getTrainingById t1
```

## Start REST server
The  REST server exposes the API allowing to invoke the chaincodes's operations from the blockchain.
Here's how to start it. 


```
npm install pm2 -g

npx lerna run start --scope webapp --stream

```

===============================================================================================================


=================================================================================================================================
============================== Backend with loopback ===================================
===========================================================================================================================

npm i -g @loopback/cli

lb4 webapp

npm i @loopback/build

npm install @types/dotenv


npx lerna add common-cc --scope webapp
npx lerna add candidate-cc --scope webapp
npx lerna add trainingOffer-cc --scope webapp
npx lerna add training-cc --scope webapp

npx lerna add @worldsibu/convector-platform-fabric --scope webapp
npx lerna add @worldsibu/convector-storage-couchdb --scope webapp
npx lerna add node-couchdb --scope webapp
npx lerna add dotenv --scope webapp


npx lerna bootstrap


npx lerna run start --scope webapp --stream

npx lerna run clean --scope webapp --stream; npx lerna run start --scope webapp --stream

npx lerna run build --scope webapp


npm run prettier:check -- --write

lb4 controller

npm install pm2 -g

pm2 completion install

pm2 init

npm install pm2 --save

pm2 restart all

pm2 stop  all

pm2 logs

================================================
