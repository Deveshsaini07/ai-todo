class ApiResponse{
    constructor(statusCode,data,message = "SUCCESS"){
        this.statusCode = statusCode;
        this.data = data || null;
        this.message = message || 'Request was successful';
        this.success = statusCode<400;
    }
}

export {ApiResponse}