import { describe, expect, it } from "vitest";
import { buildStageRange, getCheckpointStatus } from "./checkpointAccess";

describe("checkpoint access helpers", () => {
  it("marks a stage as locked when it is not unlocked or completed", () => {
    expect(getCheckpointStatus({ completed: false, unlocked: false })).toBe("locked");
  });

  it("marks a stage as unlocked when it is unlocked but not completed", () => {
    expect(getCheckpointStatus({ completed: false, unlocked: true })).toBe("unlocked");
  });

  it("builds a continuous stage range from start to end", () => {
    expect(buildStageRange(1, 3, 8)).toEqual(["stage-01", "stage-02", "stage-03"]);
  });
});
