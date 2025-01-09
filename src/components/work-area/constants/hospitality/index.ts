import { accommodationRoles } from './accommodation-roles';
import { foodAndBeverageRoles } from './fb-roles';
import { tourismRoles } from './tourism-roles';
import { eventManagementRoles } from './event-roles';
import { hospitalityMarketingRoles } from './marketing-roles';
import { customerServiceRoles } from './customer-service-roles';
import { operationsRoles } from './operations-roles';
import { luxuryRoles } from './luxury-roles';
import { sustainabilityRoles } from './sustainability-roles';
import { leadershipRoles } from './leadership-roles';

export const hospitalityRoles = {
  accommodationRoles,
  foodAndBeverageRoles,
  tourismRoles,
  eventManagementRoles,
  hospitalityMarketingRoles,
  customerServiceRoles,
  operationsRoles,
  luxuryRoles,
  sustainabilityRoles,
  leadershipRoles
};

export const allHospitalityRoles = [
  ...accommodationRoles,
  ...foodAndBeverageRoles,
  ...tourismRoles,
  ...eventManagementRoles,
  ...hospitalityMarketingRoles,
  ...customerServiceRoles,
  ...operationsRoles,
  ...luxuryRoles,
  ...sustainabilityRoles,
  ...leadershipRoles
];