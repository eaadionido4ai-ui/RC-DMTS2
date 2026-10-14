import type { ComponentType } from 'react';
import { AboutManual } from './about';
import { AdminActivity, AdminCodes, AdminPositions } from './admin';
import { AidEvacMap, AidHotlines, AidId, AidSos } from './aid';
import { AlagaList } from './alaga';
import { ElistaRegister, ElistaRoster, ElistaScan, ElistaStatus } from './elista';
import { GabAsk, GabBrief } from './gab';
import { GateHome } from './GateHome';
import { ActivityLog, AlertsList, Overview } from './home';
import { KamaligDispatched, KamaligRequests, KamaligStock } from './kamalig';
import { SipatMap, SipatReport, SipatTeams } from './sipat';

/** Content for each `<view>_<tab>` key, plus `gate` for the sign-in screen. */
export const SCREENS: Record<string, ComponentType> = {
  gate: GateHome,

  home_overview: Overview,
  home_alerts: AlertsList,
  home_log: ActivityLog,

  elista_status: ElistaStatus,
  elista_scan: ElistaScan,
  elista_register: ElistaRegister,
  elista_roster: ElistaRoster,

  sipat_map: SipatMap,
  sipat_teams: SipatTeams,
  sipat_report: SipatReport,

  kamalig_requests: KamaligRequests,
  kamalig_stock: KamaligStock,
  kamalig_dispatched: KamaligDispatched,

  gab_brief: GabBrief,
  gab_ask: GabAsk,

  alaga_queue: AlagaList,
  alaga_pipeline: AlagaList,
  alaga_done: AlagaList,

  aid_id: AidId,
  aid_sos: AidSos,
  aid_alerts: AlertsList,
  aid_map: AidEvacMap,
  aid_hotlines: AidHotlines,

  admin_positions: AdminPositions,
  admin_codes: AdminCodes,
  admin_activity: AdminActivity,

  about_manual: AboutManual,
};
