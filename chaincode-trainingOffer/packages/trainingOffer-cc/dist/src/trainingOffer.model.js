"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_model_1 = require("@worldsibu/convector-core-model");
var TrainingOffer = (function (_super) {
    tslib_1.__extends(TrainingOffer, _super);
    function TrainingOffer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'io.worldsibu.trainingOffer';
        return _this;
    }
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required()
    ], TrainingOffer.prototype, "type", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], TrainingOffer.prototype, "firstName", void 0);
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.number())
    ], TrainingOffer.prototype, "description", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.number())
    ], TrainingOffer.prototype, "modified", void 0);
    return TrainingOffer;
}(convector_core_model_1.ConvectorModel));
exports.TrainingOffer = TrainingOffer;
//# sourceMappingURL=trainingOffer.model.js.map