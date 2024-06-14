import { Organization, User, UserRole } from "src/entities";

export type IUserOrganizationData = InstanceType<typeof Organization> & {
  role: UserRole;
};

export type IOrganizationMember = InstanceType<typeof User> & {
  role: UserRole;
};
