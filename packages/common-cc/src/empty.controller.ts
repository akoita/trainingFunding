import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable} from '@worldsibu/convector-core';

/**
 * At least one valid Controller is required by Convector in every package of the chaincode.
 */
@Controller('empty')
export class EmptyController extends ConvectorController<ChaincodeTx> {
    @Invokable()
    public async emptyMethod() {
    }

}