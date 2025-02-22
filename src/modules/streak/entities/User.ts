import { Post } from './Post';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public recordStreak: number,
    public currentStreak: number,
    public readonly createdAt?: string,
    public updatedAt?: string,
  ) {}

  posts?: Post[];
}
