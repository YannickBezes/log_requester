export class BadFormatException extends Error {
  constructor(message) {
      super(message);

      this.name = 'BadFormatException';
  }
}
