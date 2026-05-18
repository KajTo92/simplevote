const monthNames = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const girlfriendAnchor = Date.UTC(2026, 4, 18);
const today = new Date();
const editableStart = "2026-01-01";
const editableEnd = "2026-12-31";
const supabaseUrl = "https://byudwxxvponrnzseufmq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5dWR3eHh2cG9ucm56c2V1Zm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDQ2NzQsImV4cCI6MjA5NDY4MDY3NH0.BACoz0WksF5EwlNsng2P1dDYVnHgbgSOrMt2wPZNfXg";

let visibleYear = 2026;
let visibleMonth = 4;
let storedEvents = [];
let deletedEvents = [];
let selectedEvent = null;
let movingEvent = null;

const supabaseClient = window.supabase?.createClient(supabaseUrl, supabaseAnonKey);
const grid = document.querySelector("#calendarGrid");
const monthName = document.querySelector("#monthName");
const yearName = document.querySelector("#yearName");
const togetherFreeCount = document.querySelector("#togetherFreeCount");
const summaryToggleCount = document.querySelector("#summaryToggleCount");
const summaryPanel = document.querySelector("#summaryPanel");
const themeToggle = document.querySelector("#themeToggle");
const actionPanel = document.querySelector("#actionPanel");
const actionDate = document.querySelector("#actionDate");
const actionTitle = document.querySelector("#actionTitle");
const eventActions = document.querySelector("#eventActions");
const addActions = document.querySelector("#addActions");
const deleteEventButton = document.querySelector("#deleteEventButton");
const moveEventButton = document.querySelector("#moveEventButton");
const closeActionPanel = document.querySelector("#closeActionPanel");
const moveBanner = document.querySelector("#moveBanner");
const cancelMoveButton = document.querySelector("#cancelMoveButton");
const mobileQuery = window.matchMedia("(max-width: 840px)");

document.querySelector("#prevMonth").addEventListener("click", () => changeMonth(-1));
document.querySelector("#nextMonth").addEventListener("click", () => changeMonth(1));
themeToggle.addEventListener("click", toggleTheme);
deleteEventButton.addEventListener("click", deleteSelectedEvent);
moveEventButton.addEventListener("click", startMove);
closeActionPanel.addEventListener("click", closePanel);
cancelMoveButton.addEventListener("click", cancelMove);
addActions.addEventListener("click", addManualEvent);

if (mobileQuery.addEventListener) {
  mobileQuery.addEventListener("change", syncSummaryPanel);
} else {
  mobileQuery.addListener(syncSummaryPanel);
}

applySavedTheme();
syncSummaryPanel();
loadOverrides();

async function loadOverrides() {
  if (!supabaseClient) {
    renderCalendar("Brak biblioteki Supabase");
    return;
  }

  const [eventsResult, deletedResult] = await Promise.all([
    supabaseClient
      .from("calendar_events")
      .select("*")
      .gte("event_date", editableStart)
      .lte("event_date", editableEnd),
    supabaseClient
      .from("calendar_deleted_events")
      .select("*")
      .gte("event_date", editableStart)
      .lte("event_date", editableEnd),
  ]);

  if (eventsResult.error || deletedResult.error) {
    console.error(eventsResult.error || deletedResult.error);
    renderCalendar("Sprawdź tabele Supabase");
    return;
  }

  storedEvents = eventsResult.data || [];
  deletedEvents = deletedResult.data || [];
  renderCalendar();
}

function changeMonth(delta) {
  const next = new Date(Date.UTC(visibleYear, visibleMonth + delta, 1));
  visibleYear = next.getUTCFullYear();
  visibleMonth = next.getUTCMonth();
  renderCalendar();
}

function renderCalendar(statusText = "") {
  grid.innerHTML = "";
  monthName.textContent = monthNames[visibleMonth];
  yearName.textContent = visibleYear;

  const firstOfMonth = new Date(Date.UTC(visibleYear, visibleMonth, 1));
  const monthStartOffset = (firstOfMonth.getUTCDay() + 6) % 7;
  const gridStart = new Date(Date.UTC(visibleYear, visibleMonth, 1 - monthStartOffset));

  let freeTogether = 0;

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart.getTime() + index * MS_PER_DAY);
    const events = getEventsForDate(date);
    const isCurrentMonth = date.getUTCMonth() === visibleMonth;
    const isTogetherFree = isFreeTogether(events);

    if (isCurrentMonth && isTogetherFree) {
      freeTogether += 1;
    }

    grid.appendChild(createDayCell(date, events, isCurrentMonth, isTogetherFree));
  }

  togetherFreeCount.textContent = freeTogether;
  summaryToggleCount.textContent = freeTogether;

  if (statusText) {
    showPanel(statusText, "Najpierw uruchom SQL z instrukcji w Supabase.", "status");
  }
}

function getEventsForDate(date) {
  const dateKey = toDateKey(date);
  const generated = getGeneratedEvents(date).filter((event) => !isDeleted(event));
  const manual = storedEvents
    .filter((event) => event.event_date === dateKey)
    .map((event) => ({ ...event, origin: "stored" }));

  return [...generated, ...manual].sort(sortEvents);
}

function getGeneratedEvents(date) {
  const state = getGeneratedState(date);
  const dateKey = toDateKey(date);
  const events = [];

  if (state.hisWork) {
    events.push(createGeneratedEvent("janek", "work", dateKey));
  }

  if (state.herShift === "day") {
    events.push(createGeneratedEvent("monika", "day", dateKey));
  }

  if (state.herShift === "night") {
    events.push(createGeneratedEvent("monika", "night", dateKey));
  }

  return events;
}

function createGeneratedEvent(person, shiftType, eventDate) {
  return {
    id: `generated-${person}-${shiftType}-${eventDate}`,
    origin: "generated",
    person,
    shift_type: shiftType,
    event_date: eventDate,
  };
}

function getGeneratedState(date) {
  const weekday = date.getUTCDay();
  const hisWork = weekday >= 4 && weekday <= 6;
  const diffDays = Math.round((date.getTime() - girlfriendAnchor) / MS_PER_DAY);
  const cycleDay = modulo(diffDays, 8);
  let herShift = "free";

  if (cycleDay <= 1) {
    herShift = "day";
  } else if (cycleDay <= 3) {
    herShift = "night";
  }

  return { hisWork, herShift };
}

function isDeleted(event) {
  return deletedEvents.some(
    (deleted) =>
      deleted.person === event.person &&
      deleted.shift_type === event.shift_type &&
      deleted.event_date === event.event_date,
  );
}

function sortEvents(first, second) {
  const order = { janek: 1, monika: 2, work: 1, day: 2, night: 3 };
  return (
    order[first.person] - order[second.person] ||
    order[first.shift_type] - order[second.shift_type]
  );
}

function isFreeTogether(events) {
  return events.every((event) => event.person !== "janek") && events.every((event) => event.person !== "monika");
}

function syncSummaryPanel() {
  summaryPanel.open = !mobileQuery.matches;
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("calendarTheme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");

  document.body.dataset.theme = theme;
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Przełącz na tryb dzień" : "Przełącz na tryb noc",
  );
}

function toggleTheme() {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";

  document.body.dataset.theme = nextTheme;
  localStorage.setItem("calendarTheme", nextTheme);
  themeToggle.setAttribute(
    "aria-label",
    nextTheme === "dark" ? "Przełącz na tryb dzień" : "Przełącz na tryb noc",
  );
}

function modulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function createDayCell(date, events, isCurrentMonth, isTogetherFree) {
  const cell = document.createElement("article");
  const dayNumber = date.getUTCDate();
  const dateKey = toDateKey(date);

  cell.className = "day-cell";
  cell.dataset.date = dateKey;
  cell.setAttribute("aria-label", buildAriaLabel(date, events, isTogetherFree));
  cell.addEventListener("click", () => handleDayClick(dateKey));

  if (!isCurrentMonth) {
    cell.classList.add("is-outside");
  }

  if (isTogetherFree) {
    cell.classList.add("is-together-free");
  }

  if (dateKey === toDateKey(today)) {
    cell.classList.add("is-today");
  }

  if (movingEvent && isEditableDate(dateKey)) {
    cell.classList.add("is-move-target");
  }

  const head = document.createElement("div");
  head.className = "day-head";

  const number = document.createElement("span");
  number.className = "day-number";
  number.textContent = dayNumber;

  head.appendChild(number);

  if (isTogetherFree) {
    const freeLabel = document.createElement("span");
    freeLabel.className = "free-label";
    freeLabel.textContent = "razem";
    head.appendChild(freeLabel);
  }

  cell.appendChild(head);

  const chips = document.createElement("div");
  chips.className = "chips";

  events.forEach((event) => {
    chips.appendChild(createChip(event));
  });

  if (events.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-day";
    empty.dataset.short = "razem";
    empty.textContent = "wolne razem";
    chips.appendChild(empty);
  }

  cell.appendChild(chips);
  return cell;
}

function createChip(event) {
  const chip = document.createElement("button");
  const meta = getEventMeta(event);

  chip.type = "button";
  chip.className = `chip ${meta.className}`;
  chip.dataset.short = meta.shortLabel;
  chip.innerHTML = `<span>${meta.label}</span>${meta.icon}`;
  chip.addEventListener("click", (clickEvent) => {
    clickEvent.stopPropagation();
    openEventPanel(event);
  });

  return chip;
}

function getEventMeta(event) {
  if (event.person === "janek") {
    return {
      className: "chip-his",
      label: "Janek",
      shortLabel: "J",
      icon: imageIcon("mis.png", "Miś"),
    };
  }

  if (event.shift_type === "night") {
    return {
      className: "chip-her-night",
      label: "Monika",
      shortLabel: "M",
      icon: nightIcon(),
    };
  }

  return {
    className: "chip-her-day",
    label: "Monika",
    shortLabel: "M",
    icon: imageIcon("myszka.png", "Myszka"),
  };
}

function openEventPanel(event) {
  selectedEvent = event;
  showPanel(formatDateLabel(event.event_date), getEventTitle(event), "event");
}

function handleDayClick(dateKey) {
  if (!isEditableDate(dateKey)) {
    showPanel(formatDateLabel(dateKey), "Edycja tylko do końca 2026", "status");
    return;
  }

  if (movingEvent) {
    moveSelectedEvent(dateKey);
    return;
  }

  selectedEvent = null;
  showPanel(formatDateLabel(dateKey), "Dodaj pracę", "add", dateKey);
}

function showPanel(dateLabel, title, mode, dateKey = "") {
  actionDate.textContent = dateLabel;
  actionTitle.textContent = title;
  actionPanel.dataset.date = dateKey;
  actionPanel.hidden = false;
  eventActions.hidden = mode !== "event";
  addActions.hidden = mode !== "add";
}

function closePanel() {
  actionPanel.hidden = true;
  selectedEvent = null;
}

async function deleteSelectedEvent() {
  if (!selectedEvent) {
    return;
  }

  const error = await removeEvent(selectedEvent);

  if (error) {
    showPanel("Supabase", "Nie udało się usunąć", "status");
    return;
  }

  closePanel();
  await loadOverrides();
}

function startMove() {
  if (!selectedEvent) {
    return;
  }

  movingEvent = selectedEvent;
  actionPanel.hidden = true;
  moveBanner.hidden = false;
  renderCalendar();
}

function cancelMove() {
  movingEvent = null;
  moveBanner.hidden = true;
  renderCalendar();
}

async function moveSelectedEvent(targetDate) {
  if (!movingEvent || targetDate === movingEvent.event_date) {
    cancelMove();
    return;
  }

  const targetAlreadyHasEvent = getEventsForDate(fromDateKey(targetDate)).some(
    (event) => event.person === movingEvent.person && event.shift_type === movingEvent.shift_type,
  );

  const removeError = await removeEvent(movingEvent);

  if (removeError) {
    showPanel("Supabase", "Nie udało się przenieść", "status");
    movingEvent = null;
    moveBanner.hidden = true;
    return;
  }

  if (!targetAlreadyHasEvent) {
    const insertError = await insertStoredEvent({
      person: movingEvent.person,
      shift_type: movingEvent.shift_type,
      event_date: targetDate,
      source: "moved",
      moved_from: movingEvent.event_date,
    });

    if (insertError) {
      showPanel("Supabase", "Nie udało się zapisać nowej daty", "status");
      movingEvent = null;
      moveBanner.hidden = true;
      return;
    }
  }

  movingEvent = null;
  moveBanner.hidden = true;
  await loadOverrides();
}

async function addManualEvent(clickEvent) {
  const button = clickEvent.target.closest("[data-add-event]");

  if (!button) {
    return;
  }

  const dateKey = actionPanel.dataset.date;
  const event = getEventFromAddType(button.dataset.addEvent, dateKey);
  const currentEvents = getEventsForDate(fromDateKey(dateKey));
  const visibleAlready = currentEvents.some(
    (currentEvent) =>
      currentEvent.person === event.person && currentEvent.shift_type === event.shift_type,
  );

  if (visibleAlready) {
    closePanel();
    return;
  }

  const deletedMatch = deletedEvents.find(
    (deleted) =>
      deleted.person === event.person &&
      deleted.shift_type === event.shift_type &&
      deleted.event_date === event.event_date,
  );

  if (deletedMatch) {
    const { error } = await supabaseClient
      .from("calendar_deleted_events")
      .delete()
      .eq("id", deletedMatch.id);

    if (error) {
      showPanel("Supabase", "Nie udało się przywrócić wpisu", "status");
      return;
    }
  } else {
    const error = await insertStoredEvent(event);

    if (error) {
      showPanel("Supabase", "Nie udało się dodać wpisu", "status");
      return;
    }
  }

  closePanel();
  await loadOverrides();
}

function getEventFromAddType(type, dateKey) {
  const map = {
    "janek-work": { person: "janek", shift_type: "work" },
    "monika-day": { person: "monika", shift_type: "day" },
    "monika-night": { person: "monika", shift_type: "night" },
  };

  return {
    ...map[type],
    event_date: dateKey,
    source: "manual",
    moved_from: null,
  };
}

async function removeEvent(event) {
  if (event.origin === "stored") {
    const { error } = await supabaseClient.from("calendar_events").delete().eq("id", event.id);
    return error;
  }

  if (isDeleted(event)) {
    return null;
  }

  const { error } = await supabaseClient.from("calendar_deleted_events").insert({
    person: event.person,
    shift_type: event.shift_type,
    event_date: event.event_date,
  });

  return error;
}

async function insertStoredEvent(event) {
  const { error } = await supabaseClient.from("calendar_events").insert(event);
  return error;
}

function imageIcon(src, alt) {
  return `<img src="${src}" alt="${alt}" />`;
}

function nightIcon() {
  return `<span class="chip-mark" aria-hidden="true">☾</span>`;
}

function buildAriaLabel(date, events, isTogetherFree) {
  const parts = [`${date.getUTCDate()} ${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}`];

  if (isTogetherFree) {
    parts.push("wolne razem");
  }

  events.forEach((event) => parts.push(getEventTitle(event)));

  return parts.join(", ");
}

function getEventTitle(event) {
  if (event.person === "janek") {
    return "Janek";
  }

  return event.shift_type === "night" ? "Monika noc" : "Monika";
}

function formatDateLabel(dateKey) {
  const date = fromDateKey(dateKey);
  return `${date.getUTCDate()} ${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function isEditableDate(dateKey) {
  return dateKey >= editableStart && dateKey <= editableEnd;
}

function toDateKey(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate(),
  ).padStart(2, "0")}`;
}

function fromDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
