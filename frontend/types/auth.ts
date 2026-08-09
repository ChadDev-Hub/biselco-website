
export type LogoutResponseType = {
    success: boolean;
}
export type GoogleValidateType = {
    url: string;   
}

export type AccessToken = {
    key: string;
    value: string;
    expires: Date;
    http_only: boolean;
    secure: boolean;
}