export abstract class ProfileParser {
  private id: string;
  private displayName?: string;
  private email?: string;

  constructor(profile: { id: string; displayName?: string }) {
    this.id = profile.id;
    this.displayName = profile.displayName;
  }

  get = () => {
    return {
      id: this.id,
      displayName: this.displayName,
      email: this.email,
    };
  };

  setEmail = (email: string) => {
    this.email = email;
  };
}
