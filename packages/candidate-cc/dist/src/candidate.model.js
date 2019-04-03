"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_model_1 = require("@worldsibu/convector-core-model");
var common_cc_1 = require("common-cc");
var Candidate = (function (_super) {
    tslib_1.__extends(Candidate, _super);
    function Candidate(object) {
        var _this = _super.call(this, { id: object.id, created: object.created, modified: object.modified, status: object.status }) || this;
        _this.type = 'io.worldsibu.candidate';
        _this.firstName = object.firstName;
        _this.lastName = object.lastName;
        return _this;
    }
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required()
    ], Candidate.prototype, "type", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], Candidate.prototype, "firstName", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], Candidate.prototype, "lastName", void 0);
    return Candidate;
}(common_cc_1.AbstractTrainingAsset));
exports.Candidate = Candidate;
//# sourceMappingURL=candidate.model.js.map