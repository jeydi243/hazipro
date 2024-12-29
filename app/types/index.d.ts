import type { Avatar } from "#ui/types";

export type UserStatus = "subscribed" | "unsubscribed" | "bounced";

export interface Audit {
  created: Date | string;
  created_by: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: Avatar;
  status: UserStatus;
  location: string;
}

export interface Mail {
  id: number;
  unread?: boolean;
  from: User;
  subject: string;
  body: string;
  date: string;
}

export interface Member {
  name: string;
  username: string;
  role: "member" | "owner";
  avatar: Avatar;
}

export interface Notification {
  id: number;
  unread?: boolean;
  sender: User;
  body: string;
  date: string;
}
export interface Classe extends Audit {
  id: string;
  unread?: boolean;
  name?: string;
  description?: string;
  code?: string;
  sender: User;
  from: User;
  body: string;
  date: string;
}
export interface Lookups extends Audit {
  id: string;
  classe_id: Classe;
  name: string;
  code: string;
  description: string;
  parent_lookups_id?: string;
}
export interface Organisation extends Audit {
  id: string;
  lookup_id: Classe;
  name: string;
  code: string;
  description: string;
  adresse: string;
  email: string;
  organisation_parent_id?: string;
}
export type Period = "daily" | "weekly" | "monthly";

export interface Range {
  start: Date;
  end: Date;
}
