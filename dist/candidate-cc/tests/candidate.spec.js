"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = require("path");
var chai = require("chai");
var chai_1 = require("chai");
var chaiAsPromised = require("chai-as-promised");
var uuid = require("uuid/v4");
var convector_adapter_mock_1 = require("@worldsibu/convector-adapter-mock");
var convector_core_1 = require("@worldsibu/convector-core");
require("mocha");
var src_1 = require("../src");
var common_cc_1 = require("common-cc");
describe('Candidate', function () {
    chai.use(chaiAsPromised);
    var adapter;
    var candidateCtrl;
    beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adapter = new convector_adapter_mock_1.MockControllerAdapter();
                    candidateCtrl = convector_core_1.ClientFactory(src_1.CandidateController, adapter);
                    return [4, adapter.init([
                            {
                                version: '*',
                                controller: 'CandidateController',
                                name: path_1.join(__dirname, '..')
                            }
                        ])];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('should create a default model', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var modelSample, justSavedModel;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    modelSample = new src_1.Candidate();
                    modelSample.id = uuid(),
                        modelSample.created = Date.now();
                    modelSample.modified = Date.now();
                    modelSample.firstName = 'Aboubakar';
                    modelSample.lastName = 'Koïta';
                    modelSample.status = common_cc_1.TrainingAppLifecycleStatus.Open;
                    return [4, candidateCtrl.createCandidate(modelSample)];
                case 1:
                    _a.sent();
                    return [4, adapter.getById(modelSample.id)];
                case 2:
                    justSavedModel = _a.sent();
                    chai_1.expect(justSavedModel.id).to.equal(modelSample.id);
                    chai_1.expect(justSavedModel.created).to.equal(modelSample.created);
                    chai_1.expect(justSavedModel.modified).to.equal(modelSample.modified);
                    chai_1.expect(justSavedModel.firstName).to.equal(modelSample.firstName);
                    chai_1.expect(justSavedModel.lastName).to.equal(modelSample.lastName);
                    chai_1.expect(justSavedModel.status).to.equal(modelSample.status);
                    return [2];
            }
        });
    }); });
    it('should fail to create a candidate with closed status', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var modelSample;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    modelSample = new src_1.Candidate();
                    modelSample.id = uuid(),
                        modelSample.created = Date.now();
                    modelSample.modified = Date.now();
                    modelSample.firstName = 'Aboubakar';
                    modelSample.lastName = 'Koïta';
                    modelSample.status = common_cc_1.TrainingAppLifecycleStatus.Closed;
                    return [4, chai_1.expect(candidateCtrl.createCandidate(modelSample).catch(function (ex) { return ex.responses[0].error.message; }))
                            .to.be.eventually.equal('new candidate must be in open status')];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('should get the list of all candidates', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var modelSample1, modelSample2, modelSample3, modelSample4, candidateList;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    modelSample1 = new src_1.Candidate();
                    modelSample1.id = uuid();
                    modelSample1.created = Date.now();
                    modelSample1.modified = Date.now();
                    modelSample1.firstName = 'Aboubakar';
                    modelSample1.lastName = 'Koïta';
                    modelSample1.status = common_cc_1.TrainingAppLifecycleStatus.Open;
                    modelSample2 = new src_1.Candidate();
                    modelSample2.id = uuid();
                    modelSample2.created = Date.now();
                    modelSample2.modified = Date.now();
                    modelSample2.firstName = 'Aboubakar';
                    modelSample2.lastName = 'Koïta';
                    modelSample2.status = common_cc_1.TrainingAppLifecycleStatus.Open;
                    modelSample3 = new src_1.Candidate();
                    2;
                    modelSample3.id = uuid();
                    modelSample3.created = Date.now();
                    modelSample3.modified = Date.now();
                    modelSample3.firstName = 'Aboubakar';
                    modelSample3.lastName = 'Koïta';
                    modelSample3.status = common_cc_1.TrainingAppLifecycleStatus.Open;
                    modelSample4 = new src_1.Candidate();
                    modelSample4.id = uuid();
                    modelSample4.created = Date.now();
                    modelSample4.modified = Date.now();
                    modelSample4.firstName = 'Aboubakar';
                    modelSample4.lastName = 'Koïta';
                    modelSample4.status = common_cc_1.TrainingAppLifecycleStatus.Open;
                    console.log(JSON.stringify(modelSample1));
                    console.log(JSON.stringify(modelSample2));
                    console.log(JSON.stringify(modelSample3));
                    console.log(JSON.stringify(modelSample4));
                    4;
                    return [4, candidateCtrl.createCandidate(modelSample1)];
                case 1:
                    _a.sent();
                    return [4, candidateCtrl.createCandidate(modelSample2)];
                case 2:
                    _a.sent();
                    return [4, candidateCtrl.createCandidate(modelSample3)];
                case 3:
                    _a.sent();
                    return [4, candidateCtrl.createCandidate(modelSample4)];
                case 4:
                    _a.sent();
                    return [4, candidateCtrl.listCandidates().then(function (models) { return models.map(function (model) {
                            return new src_1.Candidate(model);
                        }); })];
                case 5:
                    candidateList = _a.sent();
                    return [4, chai_1.expect(candidateList).to.have.lengthOf(4)];
                case 6:
                    _a.sent();
                    chai_1.expect(candidateList).to.have.same.deep.members([modelSample1, modelSample2, modelSample3, modelSample4]);
                    return [2];
            }
        });
    }); });
    it('should find the candidate matching given name', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var modelSample1, soumaya, dede, candidates, candidates2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    modelSample1 = new src_1.Candidate();
                    modelSample1.id = uuid();
                    modelSample1.created = Date.now();
                    modelSample1.modified = Date.now();
                    modelSample1.firstName = 'Aboubakar';
                    modelSample1.lastName = 'Koïta';
                    modelSample1.status = common_cc_1.TrainingAppLifecycleStatus.Open;
                    soumaya = new src_1.Candidate();
                    soumaya.id = uuid();
                    soumaya.created = Date.now();
                    soumaya.modified = Date.now();
                    soumaya.firstName = 'Soumaya';
                    soumaya.lastName = 'Koïta';
                    soumaya.status = common_cc_1.TrainingAppLifecycleStatus.Open;
                    dede = new src_1.Candidate();
                    2;
                    dede.id = uuid();
                    dede.created = Date.now();
                    dede.modified = Date.now();
                    dede.firstName = 'Dede';
                    dede.lastName = 'Koïta';
                    dede.status = common_cc_1.TrainingAppLifecycleStatus.Open;
                    return [4, candidateCtrl.createCandidate(modelSample1)];
                case 1:
                    _a.sent();
                    return [4, candidateCtrl.createCandidate(soumaya)];
                case 2:
                    _a.sent();
                    return [4, candidateCtrl.createCandidate(dede)];
                case 3:
                    _a.sent();
                    return [4, candidateCtrl.searchCandidate("oït")];
                case 4:
                    candidates = _a.sent();
                    if (Array.isArray(candidates)) {
                        chai_1.expect(candidates.map(function (c) { return new src_1.Candidate(c); })).to.have.same.deep.members([modelSample1, soumaya, dede]);
                    }
                    else {
                        throw new Error('no candidate matching name "Koïta"');
                    }
                    return [4, candidateCtrl.searchCandidate("Abouba")];
                case 5:
                    candidates2 = _a.sent();
                    if (Array.isArray(candidates2)) {
                        chai_1.expect(candidates2.map(function (c) { return new src_1.Candidate(c); })).to.have.same.deep.members([modelSample1, soumaya, dede]);
                    }
                    else {
                        throw new Error('no candidate matching name "Koïta"');
                    }
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=candidate.spec.js.map