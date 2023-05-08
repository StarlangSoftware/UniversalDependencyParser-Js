import { UniversalDependencyType } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";
export declare class Candidate {
    private readonly command;
    private readonly universalDependencyType;
    constructor(command: Command, universalDependencyType: UniversalDependencyType);
    getCommand(): Command;
    getUniversalDependencyType(): UniversalDependencyType;
}
