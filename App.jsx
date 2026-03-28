import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { CalendarDays, Users, Clock, CheckCircle2, Search, PlusCircle, XCircle } from "lucide-react";

const TABLE_NAME = "Volunteer Schedule";
const VOLUNTEER_ACCESS_CODE = "CCHS1200";
const SUPABASE_URL = "https://sxmmzztrgzzupklwmtzn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bW16enRyZ3p6dXBrbHdtdHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjU4MTEsImV4cCI6MjA5MDIwMTgxMX0.c5WFSAstu-W_UHI8LymjSMORNFR3K2N_cTgkzu3bmf0";
const ADMIN_EMAILS = ["scrapbookjoey@gmail.com", "info@canyoncountyhistory.org"];
const OWNER_MARKER = "|||owner:";
const ACTIVE_YEARS = [2026, 2027];
const OPEN_DAYS = [5, 6];

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ui = {
  page: { minHeight: "100vh", background: "#f5f5f4", padding: 24, color: "#292524", fontFamily: "Arial, sans-serif" },
  shell: { maxWidth: 1200, margin: "0 auto", display: "grid", gap: 24 },
  card: { background: "white", borderRadius: 24, border: "1px solid #e7e5e4", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  cardHeader: { padding: 24, paddingBottom: 0 },
  cardContent: { padding: 24 },
  title: { fontSize: 22, fontWeight: 700, margin: 0 },
  heroGrid: { display: "grid", gap: 16, gridTemplateColumns: "1.4fr 0.8fr" },
  twoCol: { display: "grid", gap: 24, gridTemplateColumns: "1.2fr 0.8fr", alignItems: "start" },
  row: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  button: { borderRadius: 16, border: "1px solid #1c1917", background: "#1c1917", color: "white", padding: "10px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  buttonOutline: { borderRadius: 16, border: "1px solid #d6d3d1", background: "white", color: "#1c1917", padding: "10px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #d6d3d1", borderRadius: 16, padding: "10px 12px", fontSize: 14, background: "white" },
  select: { width: "100%", boxSizing: "border-box", border: "1px solid #d6d3d1", borderRadius: 16, padding: "10px 12px", fontSize: 14, background: "white" },
  badge: { display: "inline-flex", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "#1c1917", color: "white" },
  mutedBadge: { display: "inline-flex", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "#f5f5f4", color: "#57534e" },
  info: { background: "#f5f5f4", borderRadius: 18, padding: 16, fontSize: 14, color: "#44403c" },
  shiftRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: 16, borderRadius: 18, background: "#fafaf9", flexWrap: "wrap" },
  small: { fontSize: 13, color: "#57534e" },
};

const scheduleOverrides = {
  "2026-03-06": { volunteers: ["Gail", "Jay"] },
  "2026-03-07": { volunteers: ["Alan", "Ed"] },
  "2026-03-13": { volunteers: ["Alan", "Lacy"] },
  "2026-03-14": { volunteers: ["Ed", "Jay"] },
  "2026-03-20": { volunteers: ["Alan", "Jay"], notes: ["No Karen", "No Ryann", "No Lacy"] },
  "2026-03-21": { volunteers: ["Ed", "Karen"], notes: ["No Lacy"] },
  "2026-03-27": { volunteers: ["Gail", "Alan", "Lacy"] },
  "2026-03-28": { volunteers: ["Ed", "Jay"] },
  "2026-04-03": { volunteers: ["Alan", "Lacy"] },
  "2026-04-04": { volunteers: ["Ed", "Jay"], notes: ["No Gail"] },
  "2026-04-10": { volunteers: ["Gail", "Jay"] },
  "2026-04-11": { volunteers: ["Alan", "Ed"], notes: ["No Ryann"] },
  "2026-04-17": { volunteers: ["Alan", "Lacy"], notes: ["Education WIP 4-6?"] },
  "2026-04-18": { volunteers: ["Ed", "Jay"] },
  "2026-04-24": { volunteers: ["Gail", "Alan"] },
  "2026-04-25": { volunteers: ["Ed", "Jay"] },
  "2026-05-01": { volunteers: ["Alan", "Lacy"] },
  "2026-05-02": { volunteers: ["Jay"], notes: ["No Gail", "Closing early at 1:30 PM"], docentTime: "10:00 AM - 1:30 PM" },
  "2026-05-08": { volunteers: ["Gail", "Alan"] },
  "2026-05-09": { volunteers: ["Jay"], labels: ["250 Grand Opening"], notes: ["No Ryann", "No Lacy"] },
  "2026-05-15": { volunteers: ["Gail", "Jay"] },
  "2026-05-16": { volunteers: ["Alan", "Ed"] },
  "2026-05-22": { volunteers: ["Alan", "Lacy"] },
  "2026-05-23": { volunteers: ["Ed", "Jay"] },
  "2026-05-29": { volunteers: ["Gail", "Alan"], notes: ["No Jay"] },
  "2026-05-30": { volunteers: ["Ed"] },
  "2026-06-05": { volunteers: ["Alan"] },
  "2026-06-06": { volunteers: ["Ed", "Jay"], notes: ["No Gail"] },
  "2026-06-12": { volunteers: ["Gail", "Alan"] },
  "2026-06-13": { volunteers: ["Ed", "Jay"] },
  "2026-06-19": { volunteers: ["Alan", "Jay"], labels: ["Juneteenth"] },
  "2026-06-20": { volunteers: ["Ed"], notes: ["No Lacy"] },
  "2026-06-26": { volunteers: ["Alan", "Lacy"] },
  "2026-06-27": { volunteers: ["Ed", "Jay"] },
  "2026-07-03": { volunteers: ["Alan", "Lacy"], labels: ["Independence Day"] },
  "2026-07-04": { volunteers: ["Ed", "Jay"], labels: ["Independence Day"] },
  "2026-07-10": { volunteers: ["Alan", "Jay"] },
  "2026-07-11": { volunteers: ["Ed", "Lacy"] },
  "2026-07-17": { volunteers: ["Alan"] },
  "2026-07-18": { volunteers: ["Ed", "Jay"] },
  "2026-07-24": { volunteers: ["Alan"], notes: ["No Lacy"] },
  "2026-07-25": { volunteers: ["Ed", "Jay"], notes: ["No Lacy"] },
  "2026-07-31": { volunteers: ["Alan", "Ed"] },
  "2026-08-01": { volunteers: ["Ed", "Jay"] },
  "2026-08-07": { volunteers: ["Alan", "Lacy"] },
  "2026-08-08": { volunteers: ["Ed", "Jay"] },
  "2026-08-14": { volunteers: ["Gail", "Jay"] },
  "2026-08-15": { volunteers: ["Alan", "Ed"] },
  "2026-08-21": { volunteers: ["Gail", "Alan"] },
  "2026-08-22": { volunteers: ["Ed", "Jay"] },
  "2026-08-28": { volunteers: ["Gail", "Alan"] },
  "2026-08-29": { volunteers: ["Ed", "Jay"] },
};

const specialEvents = [
  { dateKey: "2026-05-02", event: "Tea Service", time: "2:00 PM - 5:00 PM", role: "Tea Service", slotCount: 4 },
  { dateKey: "2026-05-02", event: "Tea Service", time: "5:00 PM - 8:00 PM", role: "Tea Service", slotCount: 4 },
  { dateKey: "2026-05-09", event: "America 250 Grand Opening", time: "11:00 AM - 4:00 PM", role: "Special Event Helper 1", slotCount: 1 },
  { dateKey: "2026-05-09", event: "America 250 Grand Opening", time: "11:00 AM - 4:00 PM", role: "Special Event Helper 2", slotCount: 1 },
  { dateKey: "2026-06-19", event: "Juneteenth Program", time: "11:00 AM - 4:00 PM", role: "Program Support", slotCount: 1 },
  { dateKey: "2026-07-04", event: "Independence Day Visitors", time: "11:00 AM - 4:00 PM", role: "Guest Support", slotCount: 1 },
];

function Card({ children, style }) {
  return <div style={{ ...ui.card, ...(style || {}) }}>{children}</div>;
}

function formatDisplayDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function getMonthLabel(dateKey) {
  const parts = dateKey.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getFirstName(value) {
  const cleaned = (value || "").trim();
  if (!cleaned) return "";
  return cleaned.split(" ").filter(Boolean)[0] || "";
}

function normalizeName(value) {
  const lower = (value || "").toLowerCase();
  let out = "";
  for (const ch of lower) {
    const code = ch.charCodeAt(0);
    const isLetter = code >= 97 && code <= 122;
    out += isLetter ? ch : " ";
  }
  return out.split(" ").filter(Boolean).join(" ");
}

function getOwnerEmailFromDescription(description) {
  const text = description || "";
  const idx = text.indexOf(OWNER_MARKER);
  return idx === -1 ? "" : text.slice(idx + OWNER_MARKER.length).trim();
}

function getVisibleDescription(description) {
  const text = description || "";
  const idx = text.indexOf(OWNER_MARKER);
  return idx === -1 ? text : text.slice(0, idx).trim();
}

function isLukeSaturday(date) {
  const start = new Date("2026-05-25T00:00:00");
  const end = new Date("2026-08-15T00:00:00");
  const checkDate = new Date(formatDateKey(date) + "T00:00:00");
  return date.getDay() === 6 && checkDate >= start && checkDate <= end;
}

function generateYearlyDocentSlots(year) {
  const slots = [];
  const roleNames = ["Docent 1", "Docent 2", "Docent 3", "Docent Trainee"];
  let id = 1;
  for (let month = 0; month < 12; month += 1) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      if (!OPEN_DAYS.includes(date.getDay())) continue;
      const dateKey = formatDateKey(date);
      const override = scheduleOverrides[dateKey] || {};
      const volunteers = [].concat(override.volunteers || []);
      if (isLukeSaturday(date) && !volunteers.includes("Luke")) volunteers.push("Luke");
      roleNames.forEach((roleName, index) => {
        const assignedVolunteer = volunteers[index] || "";
        slots.push({
          id: id++,
          event: "Nampa Train Depot",
          date: formatDisplayDate(date),
          dateKey,
          time: override.docentTime || "10:00 AM - 3:00 PM",
          role: roleName,
          spots: 1,
          signedUp: assignedVolunteer ? 1 : 0,
          assignedVolunteer,
          labels: override.labels || [],
          notes: override.notes || [],
          description: assignedVolunteer ? roleName + " is currently assigned to " + assignedVolunteer + "." : "Volunteer coverage for " + roleName + " at the museum.",
        });
      });
    }
  }
  return slots;
}

function buildInitialSlots() {
  const docentSlots = ACTIVE_YEARS.flatMap((year) => generateYearlyDocentSlots(year));
  const highestId = docentSlots.reduce((max, slot) => Math.max(max, slot.id), 0);
  const eventSlots = specialEvents.flatMap((event, index) => {
    return Array.from({ length: event.slotCount || 1 }).map((_, slotIndex) => ({
      id: highestId + index * 10 + slotIndex + 1,
      event: event.event,
      date: formatDisplayDate(new Date(event.dateKey + "T00:00:00")),
      dateKey: event.dateKey,
      time: event.time,
      role: event.slotCount > 1 ? event.role + " " + (slotIndex + 1) : event.role,
      spots: 1,
      signedUp: 0,
      assignedVolunteer: "",
      labels: ["Special Event"],
      notes: event.slotCount > 1 ? ["4 volunteer slots"] : ["Extra help requested"],
      description: "Volunteer coverage for " + event.role + " during " + event.event + ".",
    }));
  });
  return docentSlots.concat(eventSlots).sort((a, b) => {
    if (a.dateKey === b.dateKey) return a.role.localeCompare(b.role);
    return a.dateKey.localeCompare(b.dateKey);
  });
}

function serializeSlotForDb(slot) {
  return {
    event: slot.event,
    date: slot.date,
    dateKey: slot.dateKey,
    time: slot.time,
    role: slot.role,
    signedUp: slot.signedUp,
    assignedVolunteer: slot.assignedVolunteer,
    description: slot.description,
  };
}

async function fetchSlotsFromDb() {
  const { data, error } = await supabase.from(TABLE_NAME).select("*").order("dateKey", { ascending: true }).order("time", { ascending: true }).order("role", { ascending: true });
  return { data, error };
}

function normalizeSlotFromDb(row) {
  return {
    id: Number(row.id),
    event: row.event || "Nampa Train Depot",
    date: row.date || "",
    dateKey: row.dateKey || "",
    time: row.time || "",
    role: row.role || "",
    spots: 1,
    signedUp: Number(row.signedUp || 0),
    assignedVolunteer: row.assignedVolunteer || "",
    labels: [],
    notes: [],
    description: row.description || "Volunteer coverage for " + (row.role || "this role") + ".",
  };
}

function AdminRowActions({ slot, onChanged }) {
  const remove = async () => {
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", slot.id);
    if (!error) await onChanged();
  };
  return <button style={ui.buttonOutline} onClick={remove}>Delete</button>;
}

function AdminAddSlot({ slots, onAdded }) {
  const [mode, setMode] = useState("add");
  const [selectedId, setSelectedId] = useState("");
  const [event, setEvent] = useState("Nampa Train Depot");
  const [dateKey, setDateKey] = useState("");
  const [time, setTime] = useState("10:00 AM - 3:00 PM");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");

  const resetForm = () => {
    setMode("add");
    setSelectedId("");
    setEvent("Nampa Train Depot");
    setDateKey("");
    setTime("10:00 AM - 3:00 PM");
    setRole("");
    setMsg("");
  };

  const loadSlot = (id) => {
    const slot = slots.find((item) => String(item.id) === String(id));
    if (!slot) return;
    setMode("edit");
    setSelectedId(String(slot.id));
    setEvent(slot.event || "Nampa Train Depot");
    setDateKey(slot.dateKey || "");
    setTime(slot.time || "10:00 AM - 3:00 PM");
    setRole(slot.role || "");
    setMsg("");
  };

  const save = async () => {
    if (!dateKey || !role) {
      setMsg("Enter date and role");
      return;
    }
    const baseRow = {
      event,
      date: new Date(dateKey + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      dateKey,
      time,
      role,
    };

    if (mode === "edit" && selectedId) {
      const existing = slots.find((item) => String(item.id) === String(selectedId));
      const ownerEmail = getOwnerEmailFromDescription(existing && existing.description ? existing.description : "");
      const description = existing && existing.assignedVolunteer
        ? role + " is currently assigned to " + existing.assignedVolunteer + "." + (ownerEmail ? " " + OWNER_MARKER + ownerEmail : "")
        : "Volunteer coverage for " + role + " at the museum.";
      const { error } = await supabase.from(TABLE_NAME).update({ ...baseRow, description }).eq("id", Number(selectedId));
      if (error) {
        setMsg(error.message);
        return;
      }
      setMsg("Slot updated");
      await onAdded();
      return;
    }

    const duplicate = slots.some((item) => item.event === event && item.dateKey === dateKey && item.time === time && item.role.toLowerCase() === role.toLowerCase());
    if (duplicate) {
      setMsg("That slot already exists");
      return;
    }

    const row = { ...baseRow, signedUp: 0, assignedVolunteer: "", description: "Volunteer coverage for " + role + " at the museum." };
    const { error } = await supabase.from(TABLE_NAME).insert([row]);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("Slot added");
    resetForm();
    await onAdded();
  };

  const remove = async () => {
    if (!selectedId) {
      setMsg("Choose a slot to delete");
      return;
    }
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", Number(selectedId));
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("Slot deleted");
    resetForm();
    await onAdded();
  };

  return (
    <Card>
      <div style={ui.cardHeader}><h3 style={ui.title}><PlusCircle size={18} style={{ marginRight: 8, verticalAlign: "middle" }} /> Admin: Add, edit, or delete slots</h3></div>
      <div style={ui.cardContent}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <input style={ui.input} value={event} onChange={(e) => setEvent(e.target.value)} placeholder="Event" />
          <input style={ui.input} value={dateKey} onChange={(e) => setDateKey(e.target.value)} placeholder="YYYY-MM-DD" />
          <input style={ui.input} value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time" />
          <input style={ui.input} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        </div>
        <div style={{ ...ui.row, marginTop: 12 }}>
          <button style={ui.button} onClick={save}>{mode === "edit" ? "Save changes" : "Add slot"}</button>
          <button style={ui.buttonOutline} onClick={resetForm}>Clear</button>
          {mode === "edit" && <button style={ui.buttonOutline} onClick={remove}>Delete slot</button>}
        </div>
        <div style={{ ...ui.info, marginTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Edit existing slot</div>
          <select style={ui.select} value={selectedId} onChange={(e) => { setSelectedId(e.target.value); if (e.target.value) loadSlot(e.target.value); }}>
            <option value="">Choose a slot to edit or delete</option>
            {slots.map((slot) => <option key={slot.id} value={slot.id}>{slot.date} | {slot.time} | {slot.event} | {slot.role}</option>)}
          </select>
        </div>
        {msg ? <div style={{ ...ui.small, marginTop: 12 }}>{msg}</div> : null}
      </div>
    </Card>
  );
}

export default function VolunteerSignupApp() {
  const isAdmin = (email) => !!email && ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === (email || "").toLowerCase());
  const [session, setSession] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupAccessCode, setSignupAccessCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [slots, setSlots] = useState(buildInitialSlots());
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("Connecting to shared volunteer schedule...");
  const [query, setQuery] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedFilledSlot, setSelectedFilledSlot] = useState(null);
  const [claimableSlots, setClaimableSlots] = useState([]);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [expandedDates, setExpandedDates] = useState({});
  const claimCardRef = useRef(null);

  useEffect(() => {
    const bootAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session || null);
      setIsAuthReady(true);
    };
    bootAuth();
    const listener = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setIsAuthReady(true);
    });
    return () => listener.data.subscription.unsubscribe();
  }, []);

  const reloadSharedSlots = async () => {
    const { data, error } = await fetchSlotsFromDb();
    if (error) {
      setSyncStatus("Could not read Supabase: " + error.message);
      return false;
    }
    setSlots((data || []).map(normalizeSlotFromDb));
    return true;
  };

  useEffect(() => {
    if (!session) {
      setClaimableSlots([]);
      return;
    }
    const fullName = session.user && session.user.user_metadata ? session.user.user_metadata.full_name || "" : "";
    const normalizedFirstName = normalizeName(getFirstName(fullName));
    if (!normalizedFirstName) {
      setClaimableSlots([]);
      return;
    }
    const matches = slots.filter((slot) => {
      if (getOwnerEmailFromDescription(slot.description)) return false;
      if (!slot.assignedVolunteer) return false;
      return normalizeName(getFirstName(slot.assignedVolunteer)) === normalizedFirstName;
    });
    setClaimableSlots(matches);
  }, [session, slots]);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      setIsLoading(true);
      const { data, error } = await fetchSlotsFromDb();
      if (error) {
        setSyncStatus("Could not read Supabase: " + error.message);
        setIsLoading(false);
        return;
      }
      if (!data || data.length === 0) {
        const seedSlots = buildInitialSlots();
        const { error: seedError } = await supabase.from(TABLE_NAME).insert(seedSlots.map(serializeSlotForDb));
        if (seedError) {
          setSlots(seedSlots);
          setSyncStatus("Supabase connected, but initial seeding failed: " + seedError.message);
          setIsLoading(false);
          return;
        }
        await reloadSharedSlots();
        setSyncStatus("Supabase connected and schedule seeded.");
        setIsLoading(false);
        return;
      }
      setSlots(data.map(normalizeSlotFromDb));
      setSyncStatus("Live shared data loaded.");
      setIsLoading(false);
    };
    load();
  }, [session]);

  useEffect(() => {
    if (selectedSlot && claimCardRef.current) {
      claimCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSlot]);

  const showTemporaryMessage = (text) => {
    setMessage(text);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setMessage("");
    }, 2500);
  };

  const persistSlots = async () => {
    const ok = await reloadSharedSlots();
    if (ok) setSyncStatus("Changes saved to shared schedule.");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    if (signupAccessCode !== VOLUNTEER_ACCESS_CODE) {
      setAuthError("That volunteer access code is not correct.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: { data: { full_name: signupName } },
    });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setAuthMessage("Account created. You can sign in now.");
    setAuthMode("signin");
    setLoginEmail(signupEmail);
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupAccessCode("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setLoginPassword("");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSelectedSlot(null);
    setSelectedFilledSlot(null);
  };

  const handleSignup = async () => {
    if (!selectedSlot) return;
    const volunteerName = (session.user && session.user.user_metadata && session.user.user_metadata.full_name) || session.user.email || "Volunteer";
    const securedDescription = selectedSlot.role + " is currently assigned to " + volunteerName + ". " + OWNER_MARKER + (session.user.email || "");
    const { error } = await supabase.from(TABLE_NAME).update({ signedUp: selectedSlot.signedUp + 1, assignedVolunteer: volunteerName, description: securedDescription }).eq("id", selectedSlot.id);
    setSelectedSlot(null);
    if (error) {
      setSyncStatus("Could not save to Supabase: " + error.message);
      return;
    }
    await persistSlots();
    showTemporaryMessage("You are signed up for this shift.");
  };

  const handleUnsignup = async (slotId) => {
    const slot = slots.find((item) => item.id === slotId);
    if (!slot) return;
    const ownerEmail = getOwnerEmailFromDescription(slot.description);
    const me = session.user ? session.user.email : "";
    if (ownerEmail && ownerEmail !== me && !isAdmin(me)) {
      setSyncStatus("You can only un-sign your own shift.");
      return;
    }
    const resetDescription = "Volunteer coverage for " + slot.role + (slot.event === "Nampa Train Depot" ? " at the museum." : " during " + slot.event + ".");
    const { error } = await supabase.from(TABLE_NAME).update({ signedUp: 0, assignedVolunteer: "", description: resetDescription }).eq("id", slotId);
    setSelectedFilledSlot(null);
    if (error) {
      setSyncStatus("Could not save to Supabase: " + error.message);
      return;
    }
    await persistSlots();
    showTemporaryMessage("You have been removed from this shift.");
  };

  const claimShiftOwnership = async (slot) => {
    const volunteerName = (session.user && session.user.user_metadata && session.user.user_metadata.full_name) || session.user.email || slot.assignedVolunteer || "Volunteer";
    const securedDescription = slot.role + " is currently assigned to " + volunteerName + ". " + OWNER_MARKER + (session.user.email || "");
    const { error } = await supabase.from(TABLE_NAME).update({ assignedVolunteer: volunteerName, description: securedDescription }).eq("id", slot.id);
    if (error) {
      setSyncStatus("Could not claim shift: " + error.message);
      return;
    }
    await persistSlots();
    showTemporaryMessage("Shift claimed to your account.");
  };

  const claimAllMatchingShifts = async () => {
    for (const slot of claimableSlots) {
      const volunteerName = (session.user && session.user.user_metadata && session.user.user_metadata.full_name) || session.user.email || slot.assignedVolunteer || "Volunteer";
      const securedDescription = slot.role + " is currently assigned to " + volunteerName + ". " + OWNER_MARKER + (session.user.email || "");
      const { error } = await supabase.from(TABLE_NAME).update({ assignedVolunteer: volunteerName, description: securedDescription }).eq("id", slot.id);
      if (error) {
        setSyncStatus("Could not claim all shifts: " + error.message);
        return;
      }
    }
    await persistSlots();
    showTemporaryMessage("All matching shifts claimed to your account.");
  };

  const filteredSlots = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingSlots = slots.filter((slot) => new Date(slot.dateKey + "T00:00:00") >= today);
    const q = query.toLowerCase().trim();
    if (!q) return upcomingSlots;
    return upcomingSlots.filter((slot) => {
      const hay = [slot.event, slot.date, slot.time, slot.role, getVisibleDescription(slot.description), slot.assignedVolunteer].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }, [query, slots]);

  const groupedSlots = useMemo(() => {
    const groups = filteredSlots.reduce((acc, slot) => {
      const isTeaService = slot.role.toLowerCase().indexOf("tea service") !== -1;
      const baseRole = isTeaService ? "Tea Service" : slot.role;
      const key = slot.dateKey + "__" + slot.event + "__" + slot.time + "__" + (isTeaService ? baseRole : "default");
      if (!acc[key]) {
        acc[key] = { date: slot.date, dateKey: slot.dateKey, event: slot.event, time: slot.time, monthLabel: getMonthLabel(slot.dateKey), isTeaServiceGroup: isTeaService, teaServiceLabel: isTeaService ? baseRole : "", slots: [] };
      }
      acc[key].slots.push(slot);
      return acc;
    }, {});
    const ordered = Object.values(groups).sort((a, b) => {
      if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey);
      if (a.event !== b.event) return a.event.localeCompare(b.event);
      return a.time.localeCompare(b.time);
    });
    return selectedMonth === "all" ? ordered : ordered.filter((group) => group.monthLabel === selectedMonth);
  }, [filteredSlots, selectedMonth]);

  const availableMonths = useMemo(() => Array.from(new Set(filteredSlots.map((slot) => getMonthLabel(slot.dateKey)))), [filteredSlots]);

  useEffect(() => {
    if (selectedMonth !== "all" && availableMonths.indexOf(selectedMonth) === -1) setSelectedMonth("all");
  }, [availableMonths, selectedMonth]);

  useEffect(() => {
    if (!groupedSlots.length) {
      setExpandedDates({});
      return;
    }
    setExpandedDates((prev) => {
      const next = {};
      groupedSlots.forEach((group, index) => {
        const key = group.dateKey + "__" + group.event + "__" + group.time + "__" + (group.isTeaServiceGroup ? group.teaServiceLabel : "default");
        next[key] = prev[key] !== undefined ? prev[key] : index === 0;
      });
      return next;
    });
  }, [groupedSlots]);

  const toggleDate = (key) => setExpandedDates((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!isAuthReady) return null;

  if (!session) {
    return (
      <div style={ui.page}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Card>
            <div style={ui.cardContent}>
              <div style={ui.badge}>Private Volunteer Portal</div>
              <h1 style={{ fontSize: 34, marginTop: 16, marginBottom: 12 }}>Volunteer portal</h1>
              <p style={{ color: "#57534e", lineHeight: 1.5 }}>This schedule is private for approved volunteers. Existing volunteers can sign in, and new volunteers can create an account with the museum volunteer access code.</p>
              <div style={{ ...ui.row, marginTop: 20 }}>
                <button style={authMode === "signin" ? ui.button : ui.buttonOutline} onClick={() => { setAuthMode("signin"); setAuthError(""); setAuthMessage(""); }}>Sign in</button>
                <button style={authMode === "signup" ? ui.button : ui.buttonOutline} onClick={() => { setAuthMode("signup"); setAuthError(""); setAuthMessage(""); }}>Create account</button>
              </div>
              {authMode === "signin" ? (
                <form onSubmit={handleSignIn} style={{ display: "grid", gap: 12, marginTop: 20 }}>
                  <input style={ui.input} required type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email address" />
                  <input style={ui.input} required type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" />
                  <button type="submit" style={ui.button}>Sign in</button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} style={{ display: "grid", gap: 12, marginTop: 20 }}>
                  <input style={ui.input} required value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Full name" />
                  <input style={ui.input} required type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="Email address" />
                  <input style={ui.input} required type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Create password" />
                  <input style={ui.input} required value={signupAccessCode} onChange={(e) => setSignupAccessCode(e.target.value)} placeholder="Museum volunteer access code" />
                  <button type="submit" style={ui.button}>Create account</button>
                </form>
              )}
              {authMessage ? <div style={{ ...ui.info, marginTop: 16 }}>{authMessage}</div> : null}
              {authError ? <div style={{ ...ui.info, marginTop: 16 }}>{authError}</div> : null}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={ui.page}>
      <div style={ui.shell}>
        {claimableSlots.length > 0 ? (
          <Card>
            <div style={ui.cardHeader}><h3 style={ui.title}>Claim your existing shifts</h3></div>
            <div style={ui.cardContent}>
              <p style={ui.small}>We found existing shifts that look like they belong to {(session.user.user_metadata && session.user.user_metadata.full_name) || session.user.email}. Claim them so only you can manage them.</p>
              <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                {claimableSlots.map((slot) => (
                  <div key={slot.id} style={ui.shiftRow}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{slot.date}</div>
                      <div style={ui.small}>{slot.time} • {slot.event} • {slot.role}</div>
                      <div style={ui.small}>Currently listed as {slot.assignedVolunteer}</div>
                    </div>
                    <button style={ui.button} onClick={() => claimShiftOwnership(slot)}>Claim this shift</button>
                  </div>
                ))}
              </div>
              {claimableSlots.length > 1 ? <div style={{ marginTop: 12 }}><button style={ui.buttonOutline} onClick={claimAllMatchingShifts}>Claim all matching shifts</button></div> : null}
            </div>
          </Card>
        ) : null}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={ui.heroGrid}>
          <Card>
            <div style={ui.cardContent}>
              <div style={ui.badge}>Volunteer Sign-Up</div>
              <h1 style={{ fontSize: 40, marginTop: 14, marginBottom: 12 }}>Pick a shift without the usual digital obstacle course.</h1>
              <p style={{ color: "#57534e", lineHeight: 1.5 }}>Volunteers can browse open roles, search by event, and claim a spot in a clean, friendly flow.</p>
              <div style={{ ...ui.row, marginTop: 16 }}>
                <div style={ui.info}><CalendarDays size={16} style={{ marginRight: 8, verticalAlign: "middle" }} /> Easy event browsing</div>
                <div style={ui.info}><Users size={16} style={{ marginRight: 8, verticalAlign: "middle" }} /> Slot limits built in</div>
                <div style={ui.info}><Clock size={16} style={{ marginRight: 8, verticalAlign: "middle" }} /> Fast mobile signup</div>
              </div>
            </div>
          </Card>
          <Card>
            <div style={ui.cardHeader}>
              <div style={{ ...ui.row, justifyContent: "space-between" }}>
                <h3 style={ui.title}>Find a spot</h3>
                <button style={ui.buttonOutline} onClick={handleSignOut}>Sign out</button>
              </div>
            </div>
            <div style={ui.cardContent}>
              <div style={{ position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#a8a29e" }} />
                <input style={{ ...ui.input, paddingLeft: 36 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by role, event, or date" />
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ ...ui.small, fontWeight: 700, marginBottom: 8 }}>Filter by month</div>
                <div style={ui.row}>
                  <button style={selectedMonth === "all" ? ui.button : ui.buttonOutline} onClick={() => setSelectedMonth("all")}>All upcoming</button>
                  {availableMonths.map((month) => <button key={month} style={selectedMonth === month ? ui.button : ui.buttonOutline} onClick={() => setSelectedMonth(month)}>{month}</button>)}
                </div>
              </div>
              <p style={{ ...ui.small, marginTop: 16 }}>Showing only current and upcoming docent dates, grouped by day with expandable shifts.</p>
              <div style={{ ...ui.info, marginTop: 12 }}>{isLoading ? "Loading shared schedule..." : syncStatus}</div>
            </div>
          </Card>
        </motion.div>

        {success ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card><div style={{ ...ui.cardContent, ...ui.row }}><CheckCircle2 size={16} /> {message}</div></Card>
          </motion.div>
        ) : null}

        <div style={ui.twoCol}>
          <div style={{ display: "grid", gap: 16 }}>
            {isAdmin(session.user.email) ? <AdminAddSlot slots={slots} onAdded={persistSlots} /> : null}
            {groupedSlots.map((group) => {
              const groupKey = group.dateKey + "__" + group.event + "__" + group.time + "__" + (group.isTeaServiceGroup ? group.teaServiceLabel : "default");
              const openCount = group.slots.filter((slot) => slot.signedUp < slot.spots).length;
              const isExpanded = expandedDates[groupKey];
              return (
                <motion.div key={groupKey} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <button onClick={() => toggleDate(groupKey)} style={{ width: "100%", textAlign: "left", padding: 24, border: 0, background: "white", cursor: "pointer", borderRadius: 24 }}>
                      <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ ...ui.row, justifyContent: "space-between" }}>
                          <div style={ui.row}>
                            <div style={{ fontSize: 28, fontWeight: 700 }}>{group.date}</div>
                            <span style={ui.mutedBadge}>{group.event}</span>
                            {group.isTeaServiceGroup ? <span style={ui.mutedBadge}>{group.teaServiceLabel} cluster</span> : null}
                          </div>
                          <span style={ui.mutedBadge}>{isExpanded ? "Hide shifts" : "Show shifts"}</span>
                        </div>
                        <div style={ui.row}>
                          <span style={ui.mutedBadge}>{group.time}</span>
                          <span style={ui.mutedBadge}>{openCount} open {openCount === 1 ? "spot" : "spots"}</span>
                        </div>
                      </div>
                    </button>
                    {isExpanded ? (
                      <div style={{ ...ui.cardContent, borderTop: "1px solid #e7e5e4" }}>
                        <div style={{ display: "grid", gap: 12 }}>
                          {group.slots.map((slot) => {
                            const isFull = slot.signedUp >= slot.spots;
                            const ownedByCurrentUser = getOwnerEmailFromDescription(slot.description) === session.user.email;
                            return (
                              <div key={slot.id} style={ui.shiftRow}>
                                <div>
                                  <div style={ui.row}>
                                    <div style={{ fontWeight: 700 }}>{slot.role}</div>
                                    <span style={ui.mutedBadge}>{isFull ? "Filled" : "Open"}</span>
                                    {ownedByCurrentUser ? <span style={ui.mutedBadge}>Your shift</span> : null}
                                  </div>
                                  <div style={{ ...ui.small, marginTop: 4 }}>{getVisibleDescription(slot.description)}</div>
                                  <div style={{ ...ui.small, marginTop: 4 }}>{isFull ? "Assigned to " + slot.assignedVolunteer : "Available for signup"}</div>
                                </div>
                                <div style={ui.row}>
                                  <button disabled={isFull} style={isFull ? { ...ui.button, opacity: 0.5, cursor: "not-allowed" } : ui.button} onClick={() => { setSelectedFilledSlot(null); setSelectedSlot(slot); }}>Sign up</button>
                                  {isFull && ownedByCurrentUser ? <button style={ui.buttonOutline} onClick={() => { setSelectedSlot(null); setSelectedFilledSlot(slot); }}>Un-sign-up</button> : null}
                                  {isAdmin(session.user.email) ? <AdminRowActions slot={slot} onChanged={persistSlots} /> : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div style={{ position: "sticky", top: 24, display: "grid", gap: 16 }} ref={claimCardRef}>
            <Card>
              <div style={ui.cardHeader}><h3 style={ui.title}>{selectedSlot ? "Claim this volunteer spot" : selectedFilledSlot ? "Remove me from this shift" : "Choose a slot to begin"}</h3></div>
              <div style={ui.cardContent}>
                {selectedSlot ? (
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={ui.info}>
                      <div style={{ fontWeight: 700 }}>{selectedSlot.event}</div>
                      <div>{selectedSlot.role}</div>
                      <div>{selectedSlot.date}</div>
                      <div>{selectedSlot.time}</div>
                    </div>
                    <div style={ui.info}>
                      <div style={{ fontSize: 12, textTransform: "uppercase", color: "#78716c" }}>Signed in as</div>
                      <div style={{ marginTop: 4, fontWeight: 700 }}>{getFirstName((session.user.user_metadata && session.user.user_metadata.full_name) || session.user.email || "Volunteer")}</div>
                    </div>
                    <div style={ui.row}>
                      <button style={ui.button} onClick={handleSignup}>Confirm signup</button>
                      <button style={ui.buttonOutline} onClick={() => setSelectedSlot(null)}>Cancel</button>
                    </div>
                  </div>
                ) : selectedFilledSlot ? (
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={ui.info}>
                      <div style={{ fontWeight: 700 }}>{selectedFilledSlot.event}</div>
                      <div>{selectedFilledSlot.role}</div>
                      <div>{selectedFilledSlot.date}</div>
                      <div>{selectedFilledSlot.time}</div>
                      <div style={{ marginTop: 8 }}>Currently assigned to {selectedFilledSlot.assignedVolunteer}</div>
                    </div>
                    <button style={ui.buttonOutline} onClick={() => handleUnsignup(selectedFilledSlot.id)}><XCircle size={16} style={{ marginRight: 8, verticalAlign: "middle" }} /> Remove me from this slot</button>
                    <button style={ui.button} onClick={() => { setSelectedSlot(null); setSelectedFilledSlot(null); }}>Close</button>
                  </div>
                ) : <div style={ui.info}>Select any open role to sign up. You can only un-sign your own shifts.</div>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
