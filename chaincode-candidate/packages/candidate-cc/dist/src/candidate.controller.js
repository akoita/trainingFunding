"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_1 = require("@worldsibu/convector-core");
var candidate_model_1 = require("./candidate.model");
var common_cc_1 = require("common-cc");
var CandidateController = (function (_super) {
    tslib_1.__extends(CandidateController, _super);
    function CandidateController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CandidateController.prototype.createCandidate = function (candidate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debugger;
                        if (candidate.status !== common_cc_1.TrainingAppLifecycleStatus.Open) {
                            throw new Error('new candidate must be in open status');
                        }
                        return [4, candidate.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    CandidateController.prototype.listCandidates = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                debugger;
                return [2, candidate_model_1.Candidate.getAll()];
            });
        });
    };
    CandidateController.prototype.searchCandidate = function (namePart) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queryObject, candidates;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debugger;
                        queryObject = {
                            "selector": {
                                $and: [{ "type": new candidate_model_1.Candidate().type }, { $or: [{ "firstName": { $regex: ".*?" + namePart + ".*" } }, { "lastName": { $regex: ".*?" + namePart + ".*" } }] }]
                            },
                            "use_index": ["_design/indexCandidateDoc", "indexCandidate"],
                            "sort": [{ "firstName": "asc" }]
                        };
                        debugger;
                        return [4, candidate_model_1.Candidate.query(candidate_model_1.Candidate, JSON.stringify(queryObject))];
                    case 1:
                        candidates = _a.sent();
                        return [2, candidates];
                }
            });
        });
    };
    CandidateController.prototype.disableCandidate = function (candidate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(candidate.status === common_cc_1.TrainingAppLifecycleStatus.Closed)) return [3, 1];
                        throw new Error("Candidate is already disabled");
                    case 1:
                        candidate.status = common_cc_1.TrainingAppLifecycleStatus.Closed;
                        return [4, candidate.save()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(candidate_model_1.Candidate))
    ], CandidateController.prototype, "createCandidate", null);
    tslib_1.__decorate([
        convector_core_1.Invokable()
    ], CandidateController.prototype, "listCandidates", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(yup.string()))
    ], CandidateController.prototype, "searchCandidate", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(candidate_model_1.Candidate))
    ], CandidateController.prototype, "disableCandidate", null);
    CandidateController = tslib_1.__decorate([
        convector_core_1.Controller('candidate')
    ], CandidateController);
    return CandidateController;
}(convector_core_1.ConvectorController));
exports.CandidateController = CandidateController;
//# sourceMappingURL=candidate.controller.js.map