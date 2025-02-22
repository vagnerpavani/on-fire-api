import { Read } from './Read';
import { User } from './User';

export class Post {
  constructor(
    public readonly id: string,
    public title: string,
    public publishedAt: string,
    public beehivId: string,
    public readonly createdAt?: string,
    public updatedAt?: string,
  ) {}

  users?: User[];
  reads?: Read[];
}
