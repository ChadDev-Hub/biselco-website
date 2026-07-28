export type User = {
    id: string;
    user_name: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: Roles[];
    photo: string;
}

export type Roles = {
    id: number;
    name: string
}