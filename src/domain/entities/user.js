/**
 * User Entity
 * Represents a user in the CloudLens system.
 */
export class User {
  constructor({ id, email, fullName, role, createdAt, provider }) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.role = role;
    this.createdAt = createdAt;
    this.provider = provider;
  }

  get firstName() {
    return this.fullName.split(" ")[0];
  }

  get isAdmin() {
    return this.role === "ADMIN";
  }

  static fromJson(json) {
    return new User({
      id: json.id,
      email: json.email,
      fullName: json.fullName,
      role: json.role,
      createdAt: json.createdAt,
      provider: json.provider,
    });
  }
}
