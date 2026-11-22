"use client";

import { useSyncExternalStore } from "react";
import type { UserRole } from "@/lib/types";

const ROLE_KEY = "uniroom.user-role.v1";
const TEACHER_KEY = "uniroom.teacher-id.v1";

const listeners = new Set<() => void>();

function getRole(): UserRole {
  if (typeof window === "undefined") return "STUDENT";

  const role = localStorage.getItem(ROLE_KEY);

  if (role === "TEACHER" || role === "ADMIN") {
    return role;
  }

  return "STUDENT";
}

function getTeacherId(): string {
  if (typeof window === "undefined") return "";

  return localStorage.getItem(TEACHER_KEY) || "";
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  function onStorage(event: StorageEvent) {
    if (
      event.key === ROLE_KEY ||
      event.key === TEACHER_KEY
    ) {
      listener();
    }
  }

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setRole(role: UserRole) {
  localStorage.setItem(ROLE_KEY, role);
  listeners.forEach((listener) => listener());
}

export function setTeacherId(id: string) {
  localStorage.setItem(TEACHER_KEY, id);
  listeners.forEach((listener) => listener());
}

export function useRole() {
  return useSyncExternalStore(
    subscribe,
    getRole,
    () => "STUDENT",
  );
}

export function useTeacherId() {
  return useSyncExternalStore(
    subscribe,
    getTeacherId,
    () => "",
  );
}