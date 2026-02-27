import { ApiProperty } from "@nestjs/swagger";
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
    @ApiProperty({ description: 'name', example: 'Zahir'})
    name: string;

    @IsString({ message: "La descripción debe ser un texto"})
    @IsNotEmpty()
    @MinLength(3,{ message: "La descripción debe tener al menos 3 caracteres"})
    @MaxLength(250,{ message: "La descripción no debe exceder los 250 caracteres"})
    @ApiProperty({ description: 'description', example: 'This is a description'})
    description: string;

    @IsNotEmpty()
    @IsBoolean({ message: "El estado debe ser un valor booleano"})
    @ApiProperty({ description: 'priority', example: false})
    priority: boolean;

    @IsNumber({},{ message: "El ID del usuario debe ser un número"})
    @IsInt()
    @ApiProperty({ description: 'user_id', example: 1})
    user_id: number;
}