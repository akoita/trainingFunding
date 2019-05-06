import * as yup from 'yup';
import {ConvectorModel, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';
import {Param} from '@worldsibu/convector-core';
import {BaseStorage} from '@worldsibu/convector-core-storage';


export enum TrainingAppLifecycleStatus {
    Open = "Open",
    Closed = "Closed"
}

const trainingAppLifecycleStatusSchema = () => yup.string().oneOf(Object.keys(TrainingAppLifecycleStatus).map(k => TrainingAppLifecycleStatus[k]));

export abstract class AbstractTrainingConceptModel<T extends AbstractTrainingConceptModel<any>> extends ConvectorModel<T> {
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
    @Validate(trainingAppLifecycleStatusSchema())
    public status: TrainingAppLifecycleStatus;


    public withCreated(@Param(yup.number)created: number): this {
        this.created = created;
        return this;
    }

    public withModified(@Param(yup.number)modified: number): this {
        this.modified = modified;
        return this;
    }

    public withStatus(@Param(trainingAppLifecycleStatusSchema())status: TrainingAppLifecycleStatus): this {
        this.status = status;
        return this;
    }


    public isClosed(): boolean {
        return this.status === TrainingAppLifecycleStatus.Closed;
    }

    /**
     * This method overrides the method ConvectorModel.getOne that does not manage correctly ID collision(https://github.com/hyperledger-labs/convector/issues/82)
     *
     * Fetch one model by its id and instantiate the result
     *
     * @param this The extender type
     * @param id The ID used to fetch the model
     * @param type The type to use for instantiation, if not provided, the extender type is used
     */
    public static async getOne<T extends ConvectorModel<any>>(
        this: new (content: any) => T,
        id: string,
        type?: new (content: any) => T,
        storageOptions?: any
    ): Promise<T> {
        type = type || this;
        const content = await BaseStorage.current.get(id, storageOptions);
        const model = new type(content);
        /**
         * The value of the constant field model.type has probably been overwritten by the conversion of the JSON in Convector model.
         * So we must find another way to try the correct value of model.type like follow:
         */
        const modelType = new type("fakeId").type;
        if ((content && model) && content.type !== modelType) {
            throw new Error(`Possible ID collision, element with id ${id} type's is ${content.type} and not ${modelType}`);
        }
        return model;
    }

}