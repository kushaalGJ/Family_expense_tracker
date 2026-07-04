export type Mode = "family" | "private";

export type Profile = {
  name: string;
  emoji: string;
  color: string;
};

export type ModeContextValue = {
  mode: Mode;
  familyId: string | null;
  familyName: string | null;
  familyCode: string | null;
  profile: Profile;
  userId: string;
};
