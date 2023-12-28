import { Organization, User, UserRole } from "src/entities";

export type UserOrganizationData = InstanceType<typeof Organization> & {
  role: UserRole;
};

export type OrganizationMember = InstanceType<typeof User> & {
  role: UserRole;
};
