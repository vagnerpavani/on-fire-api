export class NotTodayPostException extends Error {
  constructor() {
    super('Passed post id is not from today.');
  }
}

export class DailyReadAlreadyExistException extends Error {
  constructor() {
    super('Current daily read already registered');
  }
}

export class UserNotFoundException extends Error {
  constructor() {
    super('Current user was not found!');
  }
}
