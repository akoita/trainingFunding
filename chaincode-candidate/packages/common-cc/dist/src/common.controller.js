"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var convector_core_1 = require("@worldsibu/convector-core");
var common_model_1 = require("./common.model");
var CommonController = (function (_super) {
    tslib_1.__extends(CommonController, _super);
    function CommonController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommonController.prototype.create = function (common) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, common.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_1.Invokable(),
        tslib_1.__param(0, convector_core_1.Param(common_model_1.Common))
    ], CommonController.prototype, "create", null);
    CommonController = tslib_1.__decorate([
        convector_core_1.Controller('common')
    ], CommonController);
    return CommonController;
}(convector_core_1.ConvectorController));
exports.CommonController = CommonController;
//# sourceMappingURL=common.controller.js.map