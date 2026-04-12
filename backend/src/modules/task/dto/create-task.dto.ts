import { ApiProperty } from "@nestjs/swagger";
import { 
    IsBoolean,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";

export class CreateTaskDto {

    @IsString({ message: "El nombre debe ser un texto"})
    @IsNotEmpty()
    @MinLength(3, {message: "El nombre debe tener al menos los 3 caracteres"})
    @MaxLength(150, {message: "El nombre no debe exceder los 150 caracteres"})
    @Matches(/^[^<>]*$/, { message: "El nombre no debe contener caracteres como < o >" })
    @ApiProperty({ description: 'name', example: 'Tiros libres'})
    name: string;

    @IsString({ message: "La descripción debe ser un texto"})
    @IsNotEmpty()
    @MinLength(3,{ message: "La descripción debe tener al menos 3 caracteres"})
    @MaxLength(200,{ message: "La descripción no debe exceder los 200 caracteres"})
    @Matches(/^[^<>]*$/, { message: "La descripción no debe contener caracteres como < o >" })
    @ApiProperty({ description: 'description', example: 'Práctica de tiros libres'})
    description: string;

    @IsNotEmpty()
    @IsBoolean({ message: "El estado debe ser un valor booleano"})
    @ApiProperty({ description: 'priority', example: false})
    priority: boolean;

    @IsNotEmpty()
    @ApiProperty({ description: 'user_id', example: '1'})
    user_id: number;
}