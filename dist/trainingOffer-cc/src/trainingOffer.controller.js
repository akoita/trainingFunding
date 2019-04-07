"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var convector_core_1 = require("@worldsibu/convector-core");
var trainingOffer_model_1 = require("./trainingOffer.model");
var src_1 = require("../../common-cc/dist/src");
var TrainingOfferController = (function (_super) {
    tslib_1.__extends(TrainingOfferController, _super);
    function TrainingOfferController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrainingOfferController.prototype.createTrainingOffer = function (trainingOffer) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (trainingOffer.status === src_1.TrainingAppLifecycleStatus.Closed) {
                            throw new Error("new Training offer status can't be closed");
                        }
                        return [4, trainingOffer.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TrainingOfferController.prototype.closeTrainingOffer = function (trainingOffer) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (trainingOffer.status == src_1.TrainingAppLifecycleStatus.Closed) {
                            throw new Error("training offer's status is already closed");
                        }
                        trainingOffer.status = src_1.TrainingAppLifecycleStatus.Closed;
                        return [4, trainingOffer.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TrainingOfferController.prototype.listTrainingOffers = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var trainingOffers;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, trainingOffer_model_1.TrainingOffer.getAll()];
                    case 1:
                        trainingOffers = _a.sent();
                        return [2, trainingOffers];
                }
            });
        });
    };
    TrainingOfferController.prototype.listTrainingOffersContainingKeyword = function (keyword) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queryObject, trainingOffers;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryObject = {
                            "selector": {
                                "$or": [{ "title": keyword }, { "description": keyword }]
                            },
                            "sort": [{ "title": "asc" }]
                        };
                        return [4, trainingOffer_model_1.TrainingOffer.query(trainingOffer_model_1.TrainingOffer, JSON.stringify(queryObject))];
                    case 1:
                        trainingOffers = _a.sent();
                        return [2, trainingOffers];
                }
            });
        });
    };
    TrainingOfferController.prototype.listTrainingOffersForDomain = function (domain) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queryObject, trainingOffers;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryObject = {
                            "selector": { "domain": domain.toString() },
                            "sort": [{ "title": "asc" }]
                        };
                        return [4, trainingOffer_model_1.TrainingOffer.query(trainingOffer_model_1.TrainingOffer, JSON.stringify(queryObject))];
                    case 1:
                        trainingOffers = _a.sent();
                        return [2, trainingOffers];
                }
            });
        });
    };
    TrainingOfferController.prototype.listTrainingOffersForDomainAndLevel = function (domain, level) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queryObject, trainingOffers;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryObject = {
                            "selector": {
                                "$and": [{ "domain": domain.toString() }, { "level": level.toString() }]
                            },
                            "sort": [{ "title": "asc" }]
                        };
                        return [4, trainingOffer_model_1.TrainingOffer.query(trainingOffer_model_1.TrainingOffer, JSON.stringify(queryObject))];
                    case 1:
                        trainingOffers = _a.sent();
                        return [2, trainingOffers];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(trainingOffer_model_1.TrainingOffer))
    ], TrainingOfferController.prototype, "createTrainingOffer", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(trainingOffer_model_1.TrainingOffer))
    ], TrainingOfferController.prototype, "closeTrainingOffer", null);
    tslib_1.__decorate([
        convector_core_1.Invokable()
    ], TrainingOfferController.prototype, "listTrainingOffers", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(String))
    ], TrainingOfferController.prototype, "listTrainingOffersContainingKeyword", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(trainingOffer_model_1.Domain))
    ], TrainingOfferController.prototype, "listTrainingOffersForDomain", null);
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(trainingOffer_model_1.Domain)), tslib_1.__param(1, convector_core_1.Param(trainingOffer_model_1.TrainingOfferLevel))
    ], TrainingOfferController.prototype, "listTrainingOffersForDomainAndLevel", null);
    TrainingOfferController = tslib_1.__decorate([
        convector_core_1.Controller('trainingOffer')
    ], TrainingOfferController);
    return TrainingOfferController;
}(convector_core_1.ConvectorController));
exports.TrainingOfferController = TrainingOfferController;
//# sourceMappingURL=trainingOffer.controller.js.map