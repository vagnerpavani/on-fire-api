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

export class PostNotFoundException extends Error {
  constructor() {
    super('Current post was not found!');
  }
}

export type StreakStatus = 'streak' | 'no-streak' | null;
