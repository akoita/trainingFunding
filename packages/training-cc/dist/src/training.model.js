"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var convector_core_model_1 = require("@worldsibu/convector-core-model");
var common_cc_1 = require("common-cc");
var trainingOffer_cc_1 = require("trainingOffer-cc");
var candidate_cc_1 = require("candidate-cc");
var Training = (function (_super) {
    tslib_1.__extends(Training, _super);
    function Training() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'io.worldsibu.training';
        return _this;
    }
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required()
    ], Training.prototype, "type", void 0);
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(trainingOffer_cc_1.TrainingOffer)
    ], Training.prototype, "trainingOffer", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required()
    ], Training.prototype, "trainingProcessStatus", void 0);
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(candidate_cc_1.Candidate)
    ], Training.prototype, "candidate", void 0);
    return Training;
}(common_cc_1.AbstractTrainingAsset));
exports.Training = Training;
var TrainingProcessStatus;
(function (TrainingProcessStatus) {
    TrainingProcessStatus[TrainingProcessStatus["NotSubmitted"] = 0] = "NotSubmitted";
    TrainingProcessStatus[TrainingProcessStatus["Submitted"] = 1] = "Submitted";
    TrainingProcessStatus[TrainingProcessStatus["Funded"] = 2] = "Funded";
    TrainingProcessStatus[TrainingProcessStatus["InProgress"] = 3] = "InProgress";
    TrainingProcessStatus[TrainingProcessStatus["Succeeded"] = 4] = "Succeeded";
    TrainingProcessStatus[TrainingProcessStatus["Failed"] = 5] = "Failed";
    TrainingProcessStatus[TrainingProcessStatus["Accepted"] = 6] = "Accepted";
})(TrainingProcessStatus = exports.TrainingProcessStatus || (exports.TrainingProcessStatus = {}));
//# sourceMappingURL=training.model.js.map