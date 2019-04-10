import * as yup from 'yup';
import {ConvectorModel, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';


export enum TrainingAppLifecycleStatus {
    Open = "Open",
    Closed = "Closed"
}

export abstract class AbstractTrainingAsset<T extends AbstractTrainingAsset<any>> extends ConvectorModel<T> {
    @ReadOnly()
    @Required()
    @Validate(yup.string())
    public id: string;

    @ReadOnly()
    @Required()
    @Validate(yup.number())
    public created: number;

    @Required()
    @Validate(yup.number())
    public modified: number;


    @Required()
    @Validate(yup.string().oneOf(Object.keys(TrainingAppLifecycleStatus).map(k => TrainingAppLifecycleStatus[k])))
    public status: TrainingAppLifecycleStatus;
    //
    // // @Required()
    // // @Validate(AbstractTrainingParticipant)
    // // public owner: AbstractTrainingParticipant<any>;
    //
    // constructor(object: {id: string, created: number, modified: number, status: TrainingAppLifecycleStatus}) {
    //   super(object.id);
    //   this.id= object.id;
    //   this.created =object.created;
    //   this.modified = object.modified;
    //   this.status = object.status;
    // }
}