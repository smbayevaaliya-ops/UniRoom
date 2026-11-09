"use client";

import { useEffect, useState } from "react";

export function useToday() {
  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date();

    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(formattedDate);
  }, []);

  return today;
}