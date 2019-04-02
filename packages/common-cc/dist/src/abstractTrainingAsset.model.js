"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_model_1 = require("@worldsibu/convector-core-model");
var abstractTrainingParticipant_model_1 = require("./abstractTrainingParticipant.model");
var AbstractTrainingAsset = (function (_super) {
    tslib_1.__extends(AbstractTrainingAsset, _super);
    function AbstractTrainingAsset() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], AbstractTrainingAsset.prototype, "id", void 0);
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.number())
    ], AbstractTrainingAsset.prototype, "created", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.number())
    ], AbstractTrainingAsset.prototype, "modified", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required()
    ], AbstractTrainingAsset.prototype, "status", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(abstractTrainingParticipant_model_1.AbstractTrainingParticipant)
    ], AbstractTrainingAsset.prototype, "owner", void 0);
    return AbstractTrainingAsset;
}(convector_core_model_1.ConvectorModel));
exports.AbstractTrainingAsset = AbstractTrainingAsset;
var TrainingAppLifecycleStatus;
(function (TrainingAppLifecycleStatus) {
    TrainingAppLifecycleStatus[TrainingAppLifecycleStatus["Open"] = 0] = "Open";
    TrainingAppLifecycleStatus[TrainingAppLifecycleStatus["Closed"] = 1] = "Closed";
})(TrainingAppLifecycleStatus = exports.TrainingAppLifecycleStatus || (exports.TrainingAppLifecycleStatus = {}));
//# sourceMappingURL=abstractTrainingAsset.model.js.map