import { UniversalDependencyType } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";
import { Command } from "./Command";
export declare class Candidate {
    private readonly command;
    private readonly universalDependencyType;
    constructor(command: Command, universalDependencyType: UniversalDependencyType);
    getCommand(): Command;
    getUniversalDependencyType(): UniversalDependencyType;
}
