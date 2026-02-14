import { State } from "./State";
import { UniversalDependencyTreeBankWord } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
import { Attribute } from "nlptoolkit-classification/dist/Attribute/Attribute";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
export declare abstract class InstanceGenerator {
    /**
     * Abstract method for generating an instance based on the current state, window size, and command.
     * @param state The current state of the parser.
     * @param windowSize The size of the window used for feature extraction.
     * @param command The command to be used for generating the instance.
     * @return The generated {@link Instance} object.
     */
    abstract generate(state: State, windowSize: number, command: string): Instance;
    /**
     * Adds an attribute for a specific feature type of a given word to the list of attributes.
     * @param word The word whose feature value is used to create the attribute.
     * @param attributes The list of attributes to which the new attribute will be added.
     * @param featureType The type of the feature to be extracted from the word.
     */
    private addAttributeForFeatureType;
    /**
     * Adds a set of default (empty) attributes to the list of attributes. These attributes represent
     * various feature types with default "null" values.
     * @param attributes The list of attributes to which the default attributes will be added.
     */
    protected addEmptyAttributes(attributes: Array<Attribute>): void;
    /**
     * Adds attributes for various feature types of a given word to the list of attributes.
     * @param word The word whose feature values are used to create the attributes.
     * @param attributes The list of attributes to which the new attributes will be added.
     */
    protected addFeatureAttributes(word: UniversalDependencyTreeBankWord, attributes: Array<Attribute>): void;
}
