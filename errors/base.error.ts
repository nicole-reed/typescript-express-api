export default class BaseError extends Error {
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);
    Object.setPrototypeOf(this, trueProto);
  }
}
