import { InstanceGenerator } from "./InstanceGenerator";
import { State } from "./State";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
export declare class SimpleInstanceGenerator extends InstanceGenerator {
    constructor();
    /**
     * Generates an instance based on the state, window size, and command.
     * @param state The current state of the parser, which includes the stack and word list.
     * @param windowSize The size of the window used for feature extraction.
     * @param command The command to be associated with the generated instance.
     * @return The generated {@link Instance} object with attributes based on the state and command.
     */
    generate(state: State, windowSize: number, command: string): Instance;
}
