import { 
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";

export class CreateTaskDto {

    id?: number;

    @IsString({ message: "El nombre debe ser un texto"})
    @IsNotEmpty()
    @MinLength(3, {message: "El nombre debe tener al menos los 3 caracteres"})
    @MaxLength(50, {message: "El nombre no debe exceder los 50 caracteres"})
    name: string;

    @IsString({ message: "La descripción debe ser un texto"})
    @IsNotEmpty()
    @MinLength(3,{ message: "La descripción debe tener al menos 3 caracteres"})
    @MaxLength(250,{ message: "La descripción no debe exceder los 250 caracteres"})
    description: string;

    @IsNotEmpty()
    @IsBoolean({ message: "El estado debe ser un valor booleano"})
    priority: boolean;

    @IsNumber({},{ message: "El ID del usuario debe ser un número"})
    @IsInt()
    user_id: number;
}