export class AccessToken {
    key: string;
    created: string;
    expired_time: string;
}

export class User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    date_joined: string;
    is_active: boolean;
}