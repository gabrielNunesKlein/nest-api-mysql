import { PartialType } from "@nestjs/mapped-types";
import { CreateDTO } from "./create-user.dto";

export class UpdatePatchUserDTO extends PartialType(CreateDTO) {

}