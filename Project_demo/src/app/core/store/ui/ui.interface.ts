
/*
Copy-paste from credendo project
lock: not used in EPS webportal
 */

export interface UI {
  busy: boolean;
  lock: boolean;
  busyProcesses: string[];
  lockProcesses: string[];
}
