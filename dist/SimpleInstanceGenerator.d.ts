import { InstanceGenerator } from "./InstanceGenerator";
import { State } from "./State";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
export declare class SimpleInstanceGenerator extends InstanceGenerator {
    constructor();
    generate(state: State, windowSize: number, command: string): Instance;
}
