export default class ResponseObject {
  status: number;
  message: string;
  data: any;
  err: any;

  constructor(status: number, message: string, data: any, err: any) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.err = err;
  }
}
