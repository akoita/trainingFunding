import * as yup from 'yup';
import {Required, Validate} from '@worldsibu/convector-core-model';
import {Param} from '@worldsibu/convector-core';
import {AbstractTrainingConceptModel} from "./abstractTrainingConcept.model";


export abstract class AbstractTrainingAsset<T extends AbstractTrainingConceptModel<any>> extends AbstractTrainingConceptModel<T> {

    @Required()
    @Validate(yup.string())
    public ownerId: string;

    public withOwnerId(@Param(yup.string()) ownerId: string): this {
        this.ownerId = ownerId;
        return this;
    }
}