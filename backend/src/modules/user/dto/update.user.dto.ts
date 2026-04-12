import { ApiProperty } from "@nestjs/swagger";
import { 
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";

export class UpdateUserDto {

    @IsString({ message: "El nombre debe ser un texto"})
        @IsOptional()
        @MinLength(3, {message: "El nombre debe tener al menos los 3 caracteres"})
        @MaxLength(200, {message: "El nombre no debe exceder los 200 caracteres"})
        @Matches(/^[^<>]*$/, { message: "El nombre no debe contener caracteres como < o >" })
        @ApiProperty({ description: 'name', example: 'Zahir'})
        name: string;
    
        @IsString({ message: "El apellido debe ser un texto"})
        @IsOptional()
        @MinLength(3,{ message: "El apellido debe tener al menos 3 caracteres"})
        @MaxLength(250,{ message: "El apellido no debe exceder los 250 caracteres"})
        @Matches(/^[^<>]*$/, { message: "El apellido no debe contener caracteres como < o >" })
        @ApiProperty({ description: 'lastname', example: 'Rodríguez'})
        lastname: string;
    
        @IsString({ message: "El usuario debe ser un texto"})
        @IsOptional()
        @MinLength(3,{ message: "El usuario debe tener al menos 3 caracteres"})
        @MaxLength(100,{ message: "El usuario no debe exceder los 100 caracteres"})
        @Matches(/^[^<>]*$/, { message: "El usuario no debe contener caracteres como < o >" })
        @ApiProperty({ description: 'username', example: 'MrMexico2014'})
        username: string;
    
        @IsString({ message: "La contraseña debe ser un texto"})
        @IsOptional()
        @MinLength(8,{ message: "La contraseña debe tener al menos 8 caracteres"})
        @MaxLength(100,{ message: "La contraseña no debe exceder los 100 caracteres"})
        @ApiProperty({ description: 'password', example: 'MiPassword123!'})
        password: string;

        @IsOptional()
    @IsNumber({}, { message: "El ID del rol debe ser un número" })
    rol_id?: number;

}