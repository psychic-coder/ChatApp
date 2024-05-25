class ErrorHandler extends Error{
    constructor(message,statusCode){
        //super is used to call the parent class constructor , as in this case its Error ,
        super(message);
        this.statusCode=statusCode;
    }
}
export  { ErrorHandler};