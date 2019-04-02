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
    TrainingController.prototype.submitTrainingApplication = function (training) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (training.trainingProcessStatus !== training_model_1.TrainingProcessStatus.NotSubmitted) {
                            throw new Error("training must be in the status NotSubmitted");
                        }
                        training.trainingProcessStatus = training_model_1.TrainingProcessStatus.Submitted;
                        return [4, training.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TrainingController.prototype.acceptApplication = function (training) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (training.trainingProcessStatus !== training_model_1.TrainingProcessStatus.Submitted) {
                            throw new Error("training must be in the status Submitted");
                        }
                        training.trainingProcessStatus = training_model_1.TrainingProcessStatus.Accepted;
                        return [4, training.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TrainingController.prototype.fundTraining = function (training) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (training.trainingProcessStatus !== training_model_1.TrainingProcessStatus.Accepted) {
                            throw new Error("training must be in the status Submitted");
                        }
                        training.trainingProcessStatus = training_model_1.TrainingProcessStatus.Funded;
                        return [4, training.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TrainingController.prototype.startTraining = function (training) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (training.trainingProcessStatus !== training_model_1.TrainingProcessStatus.Funded) {
                            throw new Error("training must be in the status Funded");
                        }
                        training.trainingProcessStatus = training_model_1.TrainingProcessStatus.InProgress;
                        return [4, training.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TrainingController.prototype.certifyCandidate = function (training) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (training.trainingProcessStatus !== training_model_1.TrainingProcessStatus.InProgress) {
                            throw new Error("training must be in the status InProgress");
                        }
                        training.trainingProcessStatus = training_model_1.TrainingProcessStatus.Succeeded;
                        return [4, training.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TrainingController.prototype.failCandidate = function (training) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (training.trainingProcessStatus !== training_model_1.TrainingProcessStatus.InProgress) {
                            throw new Error("training must be in the status InProgress");
                        }
                        training.trainingProcessStatus = training_model_1.TrainingProcessStatus.Failed;
                        return [4, training.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TrainingController.prototype.getCandidateTrainings = function (namePart) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queryObject, trainings;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryObject = {
                            "selector": {
                                "$or": [{ "candidate.firstName": namePart.toString() }, { "candidate.lastName": namePart.toString() }]
                            },
                            "sort": [{ "trainingOffer.title": "asc" }]
                        };
                        return [4, training_model_1.Training.query(training_model_1.Training, JSON.stringify(queryObject))];
                    case 1:
                        trainings = _a.sent();
                        return [2, trainings];
                }
            });
        });
    };
    TrainingController.prototype.searchTrainingByProcessStatus = function (trainingProcessStatus) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queryObject, trainings;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryObject = {
                            "selector": { "trainingProcessStatus": trainingProcessStatus.toString() },
                            "sort": [{ "trainingOffer.title": "asc" }]
                        };
                        return [4, training_model_1.Training.query(training_model_1.Training, JSON.stringify(queryObject))];
                    case 1:
                        trainings = _a.sent();
                        return [2, trainings];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(training_model_1.Training))
    ], TrainingController.prototype, "create", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(training_model_1.Training))
    ], TrainingController.prototype, "submitTrainingApplication", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(training_model_1.Training))
    ], TrainingController.prototype, "acceptApplication", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(training_model_1.Training))
    ], TrainingController.prototype, "fundTraining", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(training_model_1.Training))
    ], TrainingController.prototype, "startTraining", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(training_model_1.Training))
    ], TrainingController.prototype, "certifyCandidate", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(training_model_1.Training))
    ], TrainingController.prototype, "failCandidate", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(String))
    ], TrainingController.prototype, "getCandidateTrainings", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(training_model_1.TrainingProcessStatus))
    ], TrainingController.prototype, "searchTrainingByProcessStatus", null);
    TrainingController = tslib_1.__decorate([
        convector_core_1.Controller('training')
    ], TrainingController);
    return TrainingController;
}(convector_core_1.ConvectorController));
exports.TrainingController = TrainingController;
//# sourceMappingURL=training.controller.js.map