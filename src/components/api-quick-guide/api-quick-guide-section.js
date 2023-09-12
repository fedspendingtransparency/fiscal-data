
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const api_quick_guide_module_scss_1 = __importDefault(require("./api-quick-guide.module.scss"));
const ApiQuickGuideSection = (props) => {
    return (react_1.default.createElement("section", { className: api_quick_guide_module_scss_1.sectionContainer },
        react_1.default.createElement("div", { className: api_quick_guide_module_scss_1.sectionHeaderContainer },
            react_1.default.createElement("div", {
              className: api_quick_guide_module_scss_1.sectionHeader,
              id: `${props.title.toLowerCase()}-header`
            }, props.title),
            props.description),
        react_1.default.createElement("div", {
          className: api_quick_guide_module_scss_1.sectionBodyContainer
        }, props.children)));
}
exports.default = ApiQuickGuideSection;
