"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_model_1 = require("@worldsibu/convector-core-model");
var AbstractTrainingParticipant = (function (_super) {
    tslib_1.__extends(AbstractTrainingParticipant, _super);
    function AbstractTrainingParticipant() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'io.worldsibu.abstractTrainingParticipant';
        return _this;
    }
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required()
    ], AbstractTrainingParticipant.prototype, "type", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], AbstractTrainingParticipant.prototype, "id", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], AbstractTrainingParticipant.prototype, "firstName", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], AbstractTrainingParticipant.prototype, "lastName", void 0);
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.number())
    ], AbstractTrainingParticipant.prototype, "description", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.number())
    ], AbstractTrainingParticipant.prototype, "modified", void 0);
    return AbstractTrainingParticipant;
}(convector_core_model_1.ConvectorModel));
exports.AbstractTrainingParticipant = AbstractTrainingParticipant;
//# sourceMappingURL=abstractTrainingParticipant.model.js.map