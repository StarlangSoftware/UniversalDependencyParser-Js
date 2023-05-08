(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./InstanceGenerator", "nlptoolkit-classification/dist/Instance/Instance", "nlptoolkit-classification/dist/Attribute/DiscreteIndexedAttribute", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankFeatures"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleInstanceGenerator = void 0;
    const InstanceGenerator_1 = require("./InstanceGenerator");
    const Instance_1 = require("nlptoolkit-classification/dist/Instance/Instance");
    const DiscreteIndexedAttribute_1 = require("nlptoolkit-classification/dist/Attribute/DiscreteIndexedAttribute");
    const UniversalDependencyTreeBankFeatures_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankFeatures");
    class SimpleInstanceGenerator extends InstanceGenerator_1.InstanceGenerator {
        constructor() {
            super();
        }
        generate(state, windowSize, command) {
            let instance = new Instance_1.Instance(command);
            let attributes = new Array();
            for (let i = 0; i < windowSize; i++) {
                let word = state.getStackWord(i);
                if (word == null) {
                    attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, 18));
                    this.addEmptyAttributes(attributes);
                }
                else {
                    if (word.getName() == "root") {
                        attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("root", 0, 18));
                        this.addEmptyAttributes(attributes);
                    }
                    else {
                        attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute(word.getUpos().toString(), UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.posIndex(word.getUpos().toString()) + 1, 18));
                        this.addFeatureAttributes(word, attributes);
                    }
                }
            }
            for (let i = 0; i < windowSize; i++) {
                let word = state.getWordListWord(i);
                if (word != null) {
                    attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute(word.getUpos().toString(), UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.posIndex(word.getUpos().toString()) + 1, 18));
                    this.addFeatureAttributes(word, attributes);
                }
                else {
                    attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("root", 0, 18));
                    this.addEmptyAttributes(attributes);
                }
            }
            for (let attribute of attributes) {
                instance.addAttribute(attribute);
            }
            return instance;
        }
    }
    exports.SimpleInstanceGenerator = SimpleInstanceGenerator;
});
//# sourceMappingURL=SimpleInstanceGenerator.js.map