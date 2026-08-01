export type StageId = string;

export interface Checkpoint {
  id: StageId;
  title: string;
  description: string;
  videoUrl: string;
}

export interface PlayerState {
  score: number;
  isRedeemed: boolean;
  redeemTime: string | null;
  completedStages: Record<StageId, boolean>;
}

export interface UserSession {
  uid: string;
}

export interface GameContextValue {
  loading: boolean;
  taskMessage: string;
  error: string | null;
  player: PlayerState | null;
  uid: string | null;
  totalCheckpoints: number;
  loginWithSchoolAccount: (email: string, password: string) => Promise<void>;
  refreshPlayer: () => Promise<void>;
  completeCheckpoint: (stageId: StageId) => Promise<void>;
  redeemReward: () => Promise<void>;
}

export interface ApiEnvelope<T> {
  ok: boolean;
  message: string;
  data?: T;
}