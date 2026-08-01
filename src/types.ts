export type CheckpointId = "welcome" | "map" | "safety" | "club" | "final";

export type Checkpoint = {
  id: CheckpointId;
  title: string;
  description: string;
  videoUrl: string;
  rewardLabel: string;
  order: number;
  accent: "acid" | "coral" | "sky" | "violet" | "gold";
};

export type ProgressDocument = {
  score: number;
  isRedeemed: boolean;
  redeemTime: string | null;
  completedStages: Record<string, string>;
  updatedAt: string | null;
};

export type GameUser = {
  uid: string;
  isAnonymous: boolean;
  displayName: string;
};

export type GameState = {
  status: "loading" | "ready" | "error";
  source: "firebase" | "local";
  user: GameUser | null;
  progress: ProgressDocument | null;
  error: string | null;
};

export type GameContextValue = GameState & {
  checkpoints: Checkpoint[];
  totalCheckpoints: number;
  completedCount: number;
  completedIds: string[];
  nextCheckpoint: Checkpoint | null;
  isComplete: boolean;
  hasFailed: boolean;
  isRedeemed: boolean;
  ready: boolean;
  refresh: () => Promise<void>;
  completeCheckpoint: (checkpointId: CheckpointId) => Promise<ProgressDocument>;
  redeemChallenge: () => Promise<ProgressDocument>;
  signIn: () => Promise<void>;
};
