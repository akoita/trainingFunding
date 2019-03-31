"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var convector_core_1 = require("@worldsibu/convector-core");
var trainingOffer_model_1 = require("./trainingOffer.model");
var TrainingOfferController = (function (_super) {
    tslib_1.__extends(TrainingOfferController, _super);
    function TrainingOfferController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrainingOfferController.prototype.create = function (trainingOffer) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, trainingOffer.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(trainingOffer_model_1.TrainingOffer))
    ], TrainingOfferController.prototype, "create", null);
    TrainingOfferController = tslib_1.__decorate([
        convector_core_1.Controller('trainingOffer')
    ], TrainingOfferController);
    return TrainingOfferController;
}(convector_core_1.ConvectorController));
exports.TrainingOfferController = TrainingOfferController;
//# sourceMappingURL=trainingOffer.controller.js.map