export type StageId = string;
export type PlayerRole = "admin" | "player";

export interface CheckpointQuiz {
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface CheckpointStaffPasscode {
  instruction: string;
  staffLabel?: string;
}

export interface Checkpoint {
  id: StageId;
  title: string;
  description: string;
  videoUrl: string;
  quiz?: CheckpointQuiz;
  staffPasscode?: CheckpointStaffPasscode;
}

export interface PlayerState {
  playerUid: number | null;
  score: number;
  isRedeemed: boolean;
  redeemTime: string | null;
  redeemRequested: boolean;
  redeemRequestTime: string | null;
  completedStages: Record<StageId, boolean>;
  unlockedStages: Record<StageId, boolean>;
  account: string;
  role: PlayerRole;
}

export interface RedeemControl {
  isOpen: boolean;
}

export interface RedeemStats {
  totalPlayers: number;
  eligiblePlayers: number;
  ineligiblePlayers: number;
  redeemedPlayers: number;
  waitingRedeemPlayers: number;
  requestedAccounts: string[];
  classStats: RedeemClassStats[];
}

export interface RedeemClassStats {
  classId: string;
  className: string;
  totalPlayers: number;
  eligiblePlayers: number;
  ineligiblePlayers: number;
  redeemedPlayers: number;
  waitingRedeemPlayers: number;
}

export interface UserSession {
  uid: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string | null;
}

export interface GameContextValue {
  loading: boolean;
  taskMessage: string;
  error: string | null;
  player: PlayerState | null;
  userProfile: UserProfile | null;
  redeemControl: RedeemControl;
  uid: string | null;
  totalCheckpoints: number;
  loginWithSchoolAccount: () => Promise<void>;
  logout: () => Promise<void>;
  refreshPlayer: () => Promise<void>;
  syncUnlockedStages: (stageIds: StageId[]) => Promise<void>;
  refreshRedeemControl: () => Promise<void>;
  setRedeemControl: (payload: RedeemControl) => Promise<void>;
  completeCheckpoint: (stageId: StageId) => Promise<void>;
  verifyStagePasscode: (stageId: StageId, code: string) => Promise<void>;
  requestRedeemTicket: () => Promise<void>;
  redeemReward: () => Promise<void>;
}

export interface ApiEnvelope<T> {
  ok: boolean;
  message: string;
  data?: T;
}