export type Timestamp = number;
export type URL = string;

export interface AdminData {
  id: string;
  name: string;
  createdAt: Timestamp;
  password: string;
  avatar: URL;
  email: string;
}
