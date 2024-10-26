export class ApplicationException extends Error {
    errorCode: number;
    statusCode: number;

    constructor(errorCode : ErrorDetail) {
        super(errorCode.message);
        this.errorCode = errorCode.code;
        this.statusCode = errorCode.statusCode;
    }
}

type ErrorDetail = {
    code: number,
    message: string,
    statusCode: number
}

export const ErrorCode: Record<string, ErrorDetail> = {
    UNKNOWN_EXCEPTION: {
        code: 9999,
        message: 'Lỗi không rõ',
        statusCode: 500,
    },
    API_CALL_EXCEPTION: {
        code: 1000,
        message: 'Lỗi khi gọi api',
        statusCode: 500,
    },
};
