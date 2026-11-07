export type UserRole = "student" | "teacher" | "admin";

export type Session = {
  name: string;
  role: UserRole;
};

const SESSION_KEY = "uniroom_session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  const saved = localStorage.getItem(SESSION_KEY);

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("uniroom-session"));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("uniroom-session"));
}