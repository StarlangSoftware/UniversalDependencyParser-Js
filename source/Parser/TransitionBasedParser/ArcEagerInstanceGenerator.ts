import {InstanceGenerator} from "./InstanceGenerator";
import {State} from "./State";
import {Instance} from "nlptoolkit-classification/dist/Instance/Instance";
import {
    UniversalDependencyTreeBankWord
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
import {DiscreteIndexedAttribute} from "nlptoolkit-classification/dist/Attribute/DiscreteIndexedAttribute";
import {
    UniversalDependencyTreeBankFeatures
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankFeatures";
import {Attribute} from "nlptoolkit-classification/dist/Attribute/Attribute";

export class ArcEagerInstanceGenerator extends InstanceGenerator{

    /**
     * Checks if the given word has a valid relation.
     * @param word The UniversalDependencyTreeBankWord to check.
     * @return true if the relation is valid, false otherwise.
     */
    private suitable(word: UniversalDependencyTreeBankWord): boolean{
        return word.getRelation() != null
    }

    /**
     * Generates an Instance object based on the provided state, window size, and command.
     * The Instance is populated with attributes derived from the words in the state.
     * @param state The state used to generate the instance.
     * @param windowSize The size of the window used to extract words from the state.
     * @param command The command associated with the instance.
     * @return The generated Instance object.
     */
    generate(state: State, windowSize: number, command: string): Instance {
        let instance = new Instance(command)
        let attributes = new Array<Attribute>()
        for (let i = 0; i < windowSize; i++) {
            let word = state.getStackWord(i);
            if (word == null) {
                attributes.push(new DiscreteIndexedAttribute("null", 0, 18))
                this.addEmptyAttributes(attributes)
                attributes.push(new DiscreteIndexedAttribute("null", 0, 59))
            } else {
                if (word.getName() == "root") {
                    attributes.push(new DiscreteIndexedAttribute("root", 0, 18))
                    this.addEmptyAttributes(attributes)
                    attributes.push(new DiscreteIndexedAttribute("null", 0, 59))
                } else {
                    attributes.push(new DiscreteIndexedAttribute(word.getUpos().toString(), UniversalDependencyTreeBankFeatures.posIndex(word.getUpos().toString()) + 1, 18))
                    this.addFeatureAttributes(word, attributes)
                    if (this.suitable(word)) {
                        attributes.push(new DiscreteIndexedAttribute(word.getRelation().toString(), UniversalDependencyTreeBankFeatures.dependencyIndex(word.getRelation().toString()) + 1, 59))
                    } else {
                        attributes.push(new DiscreteIndexedAttribute("null", 0, 59))
                    }
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