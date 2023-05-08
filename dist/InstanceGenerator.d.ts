import { State } from "./State";
import { UniversalDependencyTreeBankWord } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
import { Attribute } from "nlptoolkit-classification/dist/Attribute/Attribute";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
export declare abstract class InstanceGenerator {
    abstract generate(state: State, windowSize: number, command: string): Instance;
    private addAttributeForFeatureType;
    protected addEmptyAttributes(attributes: Array<Attribute>): void;
    protected addFeatureAttributes(word: UniversalDependencyTreeBankWord, attributes: Array<Attribute>): void;
}
