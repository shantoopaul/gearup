import type { Response } from 'express';

interface Meta {
    page?: number;
    limit?: number;
    total?: number;
}

interface SendResponsePayload<T> {
    statusCode: number;
    message: string;
    data?: T;
    meta?: Meta;
}

interface SuccessResponse<T> extends SendResponsePayload<T> {
    success: true;
}

const sendResponse = <T>(res: Response, payload: SendResponsePayload<T>): void => {
    const { statusCode, message, data, meta } = payload;

    const response: SuccessResponse<T> = {
        success: true,
        statusCode,
        message,
    };

    if (data !== undefined) {
        response.data = data;
    }

    if (meta !== undefined) {
        response.meta = meta;
    }

    res.status(statusCode).json(response);
};

export default sendResponse;