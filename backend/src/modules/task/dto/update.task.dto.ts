import { 
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";

export class UpdateTaskDto {

    @IsString({ message: "El nombre debe ser un texto"})
    @IsOptional()
    @MinLength(3, {message: "El nombre debe tener al menos los 3 caracteres"})
    @MaxLength(150, {message: "El nombre no debe exceder los 150 caracteres"})
    @Matches(/^[^<>]*$/, { message: "El nombre no debe contener caracteres como < o >" })
    name?: string;

    @IsString({ message: "La descripción debe ser un texto"})
    @IsOptional()
    @MinLength(3,{ message: "La descripción debe tener al menos 3 caracteres"})
    @MaxLength(200,{ message: "La descripción no debe exceder los 200 caracteres"})
    @Matches(/^[^<>]*$/, { message: "La descripción no debe contener caracteres como < o >" })
    description?: string;

    @IsOptional()
    @IsBoolean({ message: "El estado debe ser un valor booleano"})
    priority?: boolean;

    @IsOptional()
    @IsNumber({}, { message: "El ID del jugador debe ser un número" })
    user_id?: number

}