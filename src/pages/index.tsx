import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { useCallback, useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";

type Event = {
  id: number;
  project: string;
  environment: string;
  type: string;
  severity: string;
  createdAt: string;
  sinceNow: string;
};

type EventExtended = Event & {
  content: object;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventExtended | null>(
    null
  );
  const [selectedRow, setSelectedRow] = useState<Event | null>(null);

  const refresh = useCallback(() => {
    api.fetch("events").then((res) => setEvents(res));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (selectedRow) {
      api.fetch(`events/${selectedRow.id}`).then((res) => {
        setSelectedEvent(res);
      });
    }
  }, [selectedRow]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 self-end">
        <Button className="flex gap-2 w-fit" onClick={refresh} severity="info">
          Refresh <i className="pi pi-refresh"></i>
        </Button>
        <Link href="/api-manager">
          <Button className="flex gap-2 w-fit">
            Manage Api&apos;s <i className="pi pi-cog"></i>
          </Button>
        </Link>
      </div>
      <DataTable
        value={events}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode="single"
        onSelectionChange={(e) => {
          setSelectedRow(e.value as Event);
          setSelectedEvent(null);
        }}
      >
        <Column field="project" header="Project"></Column>
        <Column field="environment" header="Environment"></Column>
        <Column field="type" header="Type"></Column>
        <Column field="severity" header="Severity"></Column>
        <Column field="createdAt" header="Created at"></Column>
        <Column field="sinceNow" header="Since Now"></Column>
      </DataTable>
      <Dialog
        header="Event Details"
        visible={selectedRow !== null}
        onHide={() => setSelectedRow(null)}
        className="w-[50rem]"
      >
        {selectedEvent && (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold">Project</p>
              <p>{selectedEvent.project}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold">Environment</p>
              <p>{selectedEvent.environment}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold">Type</p>
              <p>{selectedEvent.type}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold">Severity</p>
              <p>{selectedEvent.severity}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold">Created at</p>
              <p>{selectedEvent.createdAt}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold">Since Now</p>
              <p>{selectedEvent.sinceNow}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold">Content</p>
              <pre
                className="p-4 rounded-md"
                style={{ background: "var(--surface-section)" }}
              >
                {JSON.stringify(selectedEvent.content, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
