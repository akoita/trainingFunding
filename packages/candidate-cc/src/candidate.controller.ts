import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Candidate} from './candidate.model';
import {TrainingAppLifecycleStatus} from 'common-cc';

@Controller('candidate')
export class CandidateController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async createCandidate(@Param(Candidate) candidate: Candidate) {
    if(candidate.status!==TrainingAppLifecycleStatus.Open){
      throw new Error('new candidate must be in open status');
    }
    await candidate.save();
  }

  @Invokable()
  public async listCandidates(): Promise<Candidate[]> {
    return Candidate.getAll();
    // let promise = Candidate.getAll().then(models => models.map(model => model.toJSON()));
    // return promise as any;
  }

  @Invokable()
  public async searchCandidate(@Param(String) namePart: string): Promise<Candidate[] | Candidate> {
    const queryObject = {
      "selector": {
        "$or": [{"firstName": namePart.toString()}, {"lastName": namePart.toString()}]
      },
      "sort":
          [{"firstName": "asc"}]
    };

    const candidates = await Candidate.query(Candidate, JSON.stringify(queryObject));
    return candidates;
  }

  @Invokable()
  public async disableCandidate(@Param(Candidate) candidate: Candidate){
    if(candidate.status===TrainingAppLifecycleStatus.Closed){
      throw new Error("Candidate is already disabled");
    }else {
      candidate.status= TrainingAppLifecycleStatus.Closed;
      await candidate.save();
    }
  }
}