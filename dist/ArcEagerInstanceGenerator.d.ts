import { InstanceGenerator } from "./InstanceGenerator";
import { State } from "./State";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
export declare class ArcEagerInstanceGenerator extends InstanceGenerator {
    private suitable;
    generate(state: State, windowSize: number, command: string): Instance;
}
