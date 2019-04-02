"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var convector_core_1 = require("@worldsibu/convector-core");
var training_model_1 = require("./training.model");
var TrainingController = (function (_super) {
    tslib_1.__extends(TrainingController, _super);
    function TrainingController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrainingController.prototype.create = function (training) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, training.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(training_model_1.Training))
    ], TrainingController.prototype, "create", null);
    TrainingController = tslib_1.__decorate([
        convector_core_1.Controller('training')
    ], TrainingController);
    return TrainingController;
}(convector_core_1.ConvectorController));
exports.TrainingController = TrainingController;
//# sourceMappingURL=training.controller.js.map