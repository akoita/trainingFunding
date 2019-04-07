import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { ConvectorController } from '@worldsibu/convector-core';
import { Common } from './common.model';
export declare class CommonController extends ConvectorController<ChaincodeTx> {
    create(common: Common): Promise<void>;
}
