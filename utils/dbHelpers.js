// Hjälpfunktioner för återkommande databaslogik
import { User } from '../models/index.js';
import { Thought } from '../models/index.js';

export async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

export async function findUserByUsername(username) {
  return User.findOne({ username });
}

export async function findThoughtById(id) {
  return Thought.findById(id);
}
