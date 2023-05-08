import {UniversalDependencyType} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";

export class Candidate {
    private readonly command: Command;
    private readonly universalDependencyType: UniversalDependencyType

    constructor(command: Command, universalDependencyType: UniversalDependencyType) {
        this.command = command
        this.universalDependencyType = universalDependencyType
    }

    getCommand(): Command{
        return this.command
    }

    getUniversalDependencyType(): UniversalDependencyType{
        return this.universalDependencyType
    }

}