/** Publishing rules. Collection never auto-publishes political or contested material. */

const HUMAN_REQUIRED =
  /arrest|indict|charg|murder|rape|assassin|elect|ballot|poll|martial law|impeach|persecut|dissolut|cult|heretic|hate|genocide|covid|vaccine|diagnos|edited video|deepfake|criminal/i;

export function requiresHumanApproval(text: string): boolean {
  return HUMAN_REQUIRED.test(text);
}

export function singlePostIsNotConfirmation(independentSourceCount: number): boolean {
  return independentSourceCount < 2;
}

export function canAutoPublishOfficialRecord(args: {
  kind: string;
  independentSourceCount: number;
  contested: boolean;
  text: string;
}): boolean {
  if (args.contested) return false;
  if (requiresHumanApproval(args.text)) return false;
  if (args.kind === 'record' && args.independentSourceCount >= 1) return true;
  return false;
}
