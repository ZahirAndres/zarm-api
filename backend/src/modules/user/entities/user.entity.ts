export class User {
    id: number;
    name: string;
    lastname: string;
    username?: string;
    password?: string;
    rol_id?: number| undefined| null;
    hash? : string | null | undefined;
    created_at: Date;
}