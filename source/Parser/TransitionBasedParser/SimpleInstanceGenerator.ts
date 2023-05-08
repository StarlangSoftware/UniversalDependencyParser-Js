import {InstanceGenerator} from "./InstanceGenerator";
import {State} from "./State";
import {Instance} from "nlptoolkit-classification/dist/Instance/Instance";
import {DiscreteIndexedAttribute} from "nlptoolkit-classification/dist/Attribute/DiscreteIndexedAttribute";
import {
    UniversalDependencyTreeBankFeatures
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankFeatures";
import {Attribute} from "nlptoolkit-classification/dist/Attribute/Attribute";

export class SimpleInstanceGenerator extends InstanceGenerator{

    constructor() {
        super();
    }

    generate(state: State, windowSize: number, command: string): Instance {
        let instance = new Instance(command)
        let attributes = new Array<Attribute>()
        for (let i = 0; i < windowSize; i++) {
            let word = state.getStackWord(i);
            if (word == null) {
                attributes.push(new DiscreteIndexedAttribute("null", 0, 18))
                this.addEmptyAttributes(attributes)
            } else {
                if (word.getName() == "root") {
                    attributes.push(new DiscreteIndexedAttribute("root", 0, 18))
                    this.addEmptyAttributes(attributes)
                } else {
                    attributes.push(new DiscreteIndexedAttribute(word.getUpos().toString(), UniversalDependencyTreeBankFeatures.posIndex(word.getUpos().toString()) + 1, 18))
                    this.addFeatureAttributes(word, attributes)
                }
            }
        }
        for (let i = 0; i < windowSize; i++) {
            let word = state.getWordListWord(i)
            if (word != null) {
                attributes.push(new DiscreteIndexedAttribute(word.getUpos().toString(), UniversalDependencyTreeBankFeatures.posIndex(word.getUpos().toString()) + 1, 18))
                this.addFeatureAttributes(word, attributes)
            } else {
                attributes.push(new DiscreteIndexedAttribute("root", 0, 18))
                this.addEmptyAttributes(attributes)
            }
        }
        for (let attribute of attributes) {
            instance.addAttribute(attribute)
        }
        return instance
    }

}