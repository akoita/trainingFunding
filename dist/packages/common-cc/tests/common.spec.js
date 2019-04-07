"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = require("path");
var chai_1 = require("chai");
var uuid = require("uuid/v4");
var convector_adapter_mock_1 = require("@worldsibu/convector-adapter-mock");
var convector_core_1 = require("@worldsibu/convector-core");
require("mocha");
var src_1 = require("../src");
describe('Common', function () {
    var adapter;
    var commonCtrl;
    before(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adapter = new convector_adapter_mock_1.MockControllerAdapter();
                    commonCtrl = convector_core_1.ClientFactory(src_1.CommonController, adapter);
                    return [4, adapter.init([
                            {
                                version: '*',
                                controller: 'CommonController',
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
                    modelSample = new src_1.Common({
                        id: uuid(),
                        name: 'Test',
                        created: Date.now(),
                        modified: Date.now()
                    });
                    return [4, commonCtrl.create(modelSample)];
                case 1:
                    _a.sent();
                    return [4, adapter.getById(modelSample.id)];
                case 2:
                    justSavedModel = _a.sent();
                    chai_1.expect(justSavedModel.id).to.exist;
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=common.spec.js.map