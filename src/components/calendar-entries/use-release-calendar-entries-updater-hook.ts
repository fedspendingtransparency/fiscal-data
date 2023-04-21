import { releaseCalendarService } from "./release-calendar-service"
import { useEffect, useRef, useState } from "react"
import { Subscription } from "rxjs"
import { IReleaseCalendarEntry } from "../../models/IReleaseCalendarEntry"


export const useReleaseCalendarEntriesUpdater =
  (originalEntries: IReleaseCalendarEntry[]): IReleaseCalendarEntry[] => {
  const subscription = useRef<Subscription>();
  const [output, setOutput] = useState<IReleaseCalendarEntry[]>(originalEntries);
  const [entries, setEntries] = useState<IReleaseCalendarEntry[]>(null);

  useEffect(() => {
    if (!entries) return;

    setOutput(entries);
  }, [entries]);

  useEffect(() => {
    releaseCalendarService.setInitialReleaseCalendarData(originalEntries);
    subscription.current = releaseCalendarService.entriesUpdated()
      .subscribe((entries: IReleaseCalendarEntry[]) => {
        setEntries(entries);
      });
  }, []);

  useEffect(() => () => {
      subscription.current.unsubscribe();
    }
  , [])

  return output;
};
