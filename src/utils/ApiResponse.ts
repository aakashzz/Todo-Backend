class ApiResponse {
   statusCode;
   data;
   message;

   constructor(statusCode: Number, data = [], message: String) {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
   }
}
export {ApiResponse};