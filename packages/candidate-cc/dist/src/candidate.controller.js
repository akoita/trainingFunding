"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var convector_core_1 = require("@worldsibu/convector-core");
var candidate_model_1 = require("./candidate.model");
var CandidateController = (function (_super) {
    tslib_1.__extends(CandidateController, _super);
    function CandidateController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CandidateController.prototype.create = function (candidate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, candidate.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(candidate_model_1.Candidate))
    ], CandidateController.prototype, "create", null);
    CandidateController = tslib_1.__decorate([
        convector_core_1.Controller('candidate')
    ], CandidateController);
    return CandidateController;
}(convector_core_1.ConvectorController));
exports.CandidateController = CandidateController;
//# sourceMappingURL=candidate.controller.js.map