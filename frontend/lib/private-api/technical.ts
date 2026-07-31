import clientApi from "./clientApi";
import { TechnicalFormsType } from '../../types/technical';

export async function GetTechnicalForm() {
    const { data, status, statusText } = await clientApi.get("/v1/technical_form/all");
    switch (status) {
        case 200:
            return data as TechnicalFormsType[];
        case 401:
            throw new Error(statusText);
        default:
            throw new Error(statusText);
    }
}