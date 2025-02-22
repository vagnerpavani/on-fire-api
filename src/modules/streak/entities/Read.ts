import { Post } from './Post';
import { User } from './User';

export class Read {
  constructor(
    public readonly id: string,
    public userId: string,
    public postId: string,
    public utmSource: string | null,
    public utmMedium: string | null,
    public utmCampaign: string | null,
    public utmChannel: string | null,
    public readonly createdAt?: string,
    public updatedAt?: string,
  ) {}

  users?: User[];
  posts?: Post[];
}
