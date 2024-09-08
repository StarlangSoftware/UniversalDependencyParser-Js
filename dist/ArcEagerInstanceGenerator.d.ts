import { InstanceGenerator } from "./InstanceGenerator";
import { State } from "./State";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
export declare class ArcEagerInstanceGenerator extends InstanceGenerator {
    /**
     * Checks if the given word has a valid relation.
     * @param word The UniversalDependencyTreeBankWord to check.
     * @return true if the relation is valid, false otherwise.
     */
    private suitable;
    /**
     * Generates an Instance object based on the provided state, window size, and command.
     * The Instance is populated with attributes derived from the words in the state.
     * @param state The state used to generate the instance.
     * @param windowSize The size of the window used to extract words from the state.
     * @param command The command associated with the instance.
     * @return The generated Instance object.
     */
    generate(state: State, windowSize: number, command: string): Instance;
}
