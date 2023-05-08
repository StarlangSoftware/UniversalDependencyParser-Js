import {State} from "./State";
import {
    UniversalDependencyTreeBankWord
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
import {Attribute} from "nlptoolkit-classification/dist/Attribute/Attribute";
import {
    UniversalDependencyTreeBankFeatures
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankFeatures";
import {DiscreteIndexedAttribute} from "nlptoolkit-classification/dist/Attribute/DiscreteIndexedAttribute";
import {Instance} from "nlptoolkit-classification/dist/Instance/Instance";

export abstract class InstanceGenerator {

    abstract generate(state: State, windowSize: number, command: string): Instance

    private addAttributeForFeatureType(word: UniversalDependencyTreeBankWord,
                                       attributes: Array<Attribute>,
                                       featureType: string){
        let feature = word.getFeatureValue(featureType)
        let numberOfValues = UniversalDependencyTreeBankFeatures.numberOfValues("tr", featureType) + 1
        if (feature != undefined){
            attributes.push(new DiscreteIndexedAttribute(feature, UniversalDependencyTreeBankFeatures.featureValueIndex("tr", featureType, feature) + 1, numberOfValues))
        } else {
            attributes.push(new DiscreteIndexedAttribute("null", 0, numberOfValues))
        }
    }

    protected addEmptyAttributes(attributes: Array<Attribute>){
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "PronType") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "NumType") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Number") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Case") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Definite") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Degree") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "VerbForm") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Mood") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Tense") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Aspect") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Voice") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Evident") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Polarity") + 1))
        attributes.push(new DiscreteIndexedAttribute("null", 0, UniversalDependencyTreeBankFeatures.numberOfValues("tr", "Person") + 1))
    }

    protected addFeatureAttributes(word: UniversalDependencyTreeBankWord,
                                   attributes: Array<Attribute>){
        this.addAttributeForFeatureType(word, attributes, "PronType")
        this.addAttributeForFeatureType(word, attributes, "NumType")
        this.addAttributeForFeatureType(word, attributes, "Number")
        this.addAttributeForFeatureType(word, attributes, "Case")
        this.addAttributeForFeatureType(word, attributes, "Definite")
        this.addAttributeForFeatureType(word, attributes, "Degree")
        this.addAttributeForFeatureType(word, attributes, "VerbForm")
        this.addAttributeForFeatureType(word, attributes, "Mood")
        this.addAttributeForFeatureType(word, attributes, "Tense")
        this.addAttributeForFeatureType(word, attributes, "Aspect")
        this.addAttributeForFeatureType(word, attributes, "Voice")
        this.addAttributeForFeatureType(word, attributes, "Evident")
        this.addAttributeForFeatureType(word, attributes, "Polarity")
        this.addAttributeForFeatureType(word, attributes, "Person")
    }
}