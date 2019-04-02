"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_model_1 = require("@worldsibu/convector-core-model");
var src_1 = require("../../common-cc/dist/src");
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
    ], TrainingOffer.prototype, "title", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], TrainingOffer.prototype, "description", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required()
    ], TrainingOffer.prototype, "domain", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required()
    ], TrainingOffer.prototype, "level", void 0);
    return TrainingOffer;
}(src_1.AbstractTrainingAsset));
exports.TrainingOffer = TrainingOffer;
var TrainingOfferLevel;
(function (TrainingOfferLevel) {
    TrainingOfferLevel[TrainingOfferLevel["Intermediate"] = 0] = "Intermediate";
    TrainingOfferLevel[TrainingOfferLevel["Advanced"] = 1] = "Advanced";
})(TrainingOfferLevel = exports.TrainingOfferLevel || (exports.TrainingOfferLevel = {}));
var Domain;
(function (Domain) {
    Domain[Domain["SoftwareDeveloper"] = 0] = "SoftwareDeveloper";
    Domain[Domain["ProjectManager"] = 1] = "ProjectManager";
    Domain[Domain["Language"] = 2] = "Language";
})(Domain = exports.Domain || (exports.Domain = {}));
//# sourceMappingURL=trainingOffer.model.js.map