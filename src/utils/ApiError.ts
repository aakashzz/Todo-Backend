class ApiError extends Error{
    statusCode;
    message;
    error;
    constructor(statusCode:Number,message:string,error=[]){
        super(message)
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
    }
}

export {ApiError}