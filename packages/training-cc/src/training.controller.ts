import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Training, TrainingProcessStatus} from './training.model';
import {Candidate} from "../../candidate-cc/src";
import {TrainingOffer} from "../../trainingOffer-cc/src";

@Controller('training')
export class TrainingController extends ConvectorController<ChaincodeTx> {
    @Invokable()
    public async create(@Param(Training)    training: Training) {
        await training.save();
    }


    @Invokable()
    public async  submitTrainingApplication(@Param(Training) training: Training) {
        if(training.trainingProcessStatus!==TrainingProcessStatus.NotSubmitted){
            throw new Error("training must be in the status NotSubmitted");
        }
        training.trainingProcessStatus = TrainingProcessStatus.Submitted;
        await training.save();
    }

    @Invokable()
    public async  acceptApplication(@Param(Training) training: Training) {
        if(training.trainingProcessStatus!==TrainingProcessStatus.Submitted){
            throw new Error("training must be in the status Submitted");
        }
        training.trainingProcessStatus = TrainingProcessStatus.Accepted;
        await training.save();
    }

    @Invokable()
    public async  fundTraining(@Param(Training) training: Training) {
        if(training.trainingProcessStatus!==TrainingProcessStatus.Accepted){
            throw new Error("training must be in the status Submitted");
        }
        training.trainingProcessStatus = TrainingProcessStatus.Funded;
        await training.save();
    }

    @Invokable()
    public async  startTraining(@Param(Training) training: Training) {
        if(training.trainingProcessStatus!==TrainingProcessStatus.Funded){
            throw new Error("training must be in the status Funded");
        }
        training.trainingProcessStatus = TrainingProcessStatus.InProgress;
        await training.save();
    }

    @Invokable()
    public async  certifyCandidate(@Param(Training) training: Training) {
        if(training.trainingProcessStatus!==TrainingProcessStatus.InProgress){
            throw new Error("training must be in the status InProgress");
        }
        training.trainingProcessStatus = TrainingProcessStatus.Succeeded;
        await training.save();
    }

    @Invokable()
    public async  failCandidate(@Param(Training) training: Training) {
        if(training.trainingProcessStatus!==TrainingProcessStatus.InProgress){
            throw new Error("training must be in the status InProgress");
        }
        training.trainingProcessStatus = TrainingProcessStatus.Failed;
        await training.save();
    }

    @Invokable()
    public async getCandidateTrainings(@Param(String) namePart: string): Promise<Training[] | Training> {
        const queryObject = {
            "selector": {
                "$or": [{"candidate.firstName": namePart.toString()}, {"candidate.lastName": namePart.toString()}]
            },
            "sort":
                [{"trainingOffer.title": "asc"}]
        };

        const trainings = await Training.query(Training, JSON.stringify(queryObject));
        return trainings;
    }

    @Invokable()
    public async searchTrainingByProcessStatus(@Param(TrainingProcessStatus) trainingProcessStatus: TrainingProcessStatus): Promise<Training[] | Training> {
        const queryObject = {
            "selector": {"trainingProcessStatus": trainingProcessStatus.toString()},
            "sort": [{"trainingOffer.title": "asc"}]
        };
        const trainings = await Training.query(Training, JSON.stringify(queryObject));
        return trainings;
    }


}