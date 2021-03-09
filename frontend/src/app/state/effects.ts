import { UserEffects } from './user/user.effects';
import { ReportingEffects } from './reporting/reporting.effects';
import { StatsEffects } from './stats/stats.effects';
import { ConfigEffects } from './config/config.effects';

export const effects = [
  UserEffects,
  ReportingEffects,
  StatsEffects,
  ConfigEffects,
];
