import User from "../models/User";

export function getUserById(userId: string): Promise<User>;
