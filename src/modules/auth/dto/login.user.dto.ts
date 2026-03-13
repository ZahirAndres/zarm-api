import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: "El usuario debe tener al menos 3 caracteres" })
    @MaxLength(100, { message: "El usuario no debe exceder los 100 caracteres" })
    @ApiProperty({ description: 'username', example: 'MrMexico2014' })
    username: string;

    @IsString({ message: "La contraseña debe ser un texto" })
    @IsNotEmpty()
    @MinLength(3, { message: "La contraseña debe tener al menos 3 caracteres" })
    @MaxLength(10, { message: "La contraseña no debe exceder los 10 caracteres" })
    @ApiProperty({ description: 'password', example: 'Linux2024!' })
    password: string;
}