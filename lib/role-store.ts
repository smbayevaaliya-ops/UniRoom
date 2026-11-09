"use client";

import { useSyncExternalStore } from "react";
import type { UserRole } from "@/lib/types";

const KEY = "uniroom.user-role.v1";

const listeners = new Set<() => void>();

function getRole(): UserRole {
  if (typeof window === "undefined") return "STUDENT";

  const role = localStorage.getItem(KEY);

  if (role === "TEACHER" || role === "ADMIN") return role;

  return "STUDENT";
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  function onStorage(event: StorageEvent) {
    if (event.key === KEY) listener();
  }

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setRole(role: UserRole) {
  localStorage.setItem(KEY, role);
  listeners.forEach((listener) => listener());
}

export function useRole() {
  return useSyncExternalStore(subscribe, getRole, () => "STUDENT");
}