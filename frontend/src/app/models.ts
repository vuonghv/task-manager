export class AccessToken {
    key: string;
    created: string;
    expired_time: string; // tslint:disable-line: variable-name
}

export class User {
    id: number;
    email: string;
    username: string;
    first_name: string; // tslint:disable-line: variable-name
    last_name: string; // tslint:disable-line: variable-name
    date_joined: string; // tslint:disable-line: variable-name
    is_active: boolean; // tslint:disable-line: variable-name
}
