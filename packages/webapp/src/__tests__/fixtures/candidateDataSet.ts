import {Candidate} from 'candidate-cc';
import {TrainingAppLifecycleStatus} from 'common-cc';

export class CandidateDataSet {
  public static abou = Candidate.build({
    id: 'c1',
    created: Date.now(),
    modified: Date.now(),
    firstName: 'Aboubakar',
    lastName: 'Koïta',
    status: TrainingAppLifecycleStatus.Open,
  });

  public static julie = Candidate.build({
    id: 'c2',
    created: Date.now(),
    modified: Date.now(),
    firstName: 'Julie',
    lastName: 'Gayet',
    status: TrainingAppLifecycleStatus.Open,
  });

  public static itachi = Candidate.build({
    id: 'c3',
    created: Date.now(),
    modified: Date.now(),
    firstName: 'Itachi',
    lastName: 'Uchiha',
    status: TrainingAppLifecycleStatus.Open,
  });
}
