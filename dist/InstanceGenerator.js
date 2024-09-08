(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankFeatures", "nlptoolkit-classification/dist/Attribute/DiscreteIndexedAttribute"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InstanceGenerator = void 0;
    const UniversalDependencyTreeBankFeatures_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankFeatures");
    const DiscreteIndexedAttribute_1 = require("nlptoolkit-classification/dist/Attribute/DiscreteIndexedAttribute");
    class InstanceGenerator {
        /**
         * Adds an attribute for a specific feature type of a given word to the list of attributes.
         * @param word The word whose feature value is used to create the attribute.
         * @param attributes The list of attributes to which the new attribute will be added.
         * @param featureType The type of the feature to be extracted from the word.
         */
        addAttributeForFeatureType(word, attributes, featureType) {
            let feature = word.getFeatureValue(featureType);
            let numberOfValues = UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", featureType) + 1;
            if (feature != undefined) {
                attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute(feature, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.featureValueIndex("tr", featureType, feature) + 1, numberOfValues));
            }
            else {
                attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, numberOfValues));
            }
        }
        /**
         * Adds a set of default (empty) attributes to the list of attributes. These attributes represent
         * various feature types with default "null" values.
         * @param attributes The list of attributes to which the default attributes will be added.
         */
        addEmptyAttributes(attributes) {
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "PronType") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "NumType") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Number") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Case") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Definite") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Degree") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "VerbForm") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Mood") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Tense") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Aspect") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Voice") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Evident") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Polarity") + 1));
            attributes.push(new DiscreteIndexedAttribute_1.DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures_1.UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Person") + 1));
        }
        /**
         * Adds attributes for various feature types of a given word to the list of attributes.
         * @param word The word whose feature values are used to create the attributes.
         * @param attributes The list of attributes to which the new attributes will be added.
         */
        addFeatureAttributes(word, attributes) {
            this.addAttributeForFeatureType(word, attributes, "PronType");
            this.addAttributeForFeatureType(word, attributes, "NumType");
            this.addAttributeForFeatureType(word, attributes, "Number");
            this.addAttributeForFeatureType(word, attributes, "Case");
            this.addAttributeForFeatureType(word, attributes, "Definite");
            this.addAttributeForFeatureType(word, attributes, "Degree");
            this.addAttributeForFeatureType(word, attributes, "VerbForm");
            this.addAttributeForFeatureType(word, attributes, "Mood");
            this.addAttributeForFeatureType(word, attributes, "Tense");
            this.addAttributeForFeatureType(word, attributes, "Aspect");
            this.addAttributeForFeatureType(word, attributes, "Voice");
            this.addAttributeForFeatureType(word, attributes, "Evident");
            this.addAttributeForFeatureType(word, attributes, "Polarity");
            this.addAttributeForFeatureType(word, attributes, "Person");
        }
    }
    exports.InstanceGenerator = InstanceGenerator;
});
//# sourceMappingURL=InstanceGenerator.js.map