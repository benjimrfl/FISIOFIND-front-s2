"use client";
import React, { useState } from "react";
import FullCalendar, { DatesSetArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAppointment } from "@/context/appointmentContext";
import esLocale from "@fullcalendar/core/locales/es";

// Ejemplo de schedule; normalmente lo obtendrías de una API u otro origen
const scheduleData = {
  schedule: {
    exceptions: {
      "2025-03-15": [
        { start: "10:00", end: "12:00" },
        { start: "14:00", end: "16:00" },
      ],
    },
    appointments: [
      {
        start_time: "2025-03-22T10:00:00Z",
        end_time: "2025-03-22T10:45:00Z",
        status: "booked",
      },
    ],
    weekly_schedule: {
      monday: [
        [{ start: "10:00", end: "14:00" }],
        [{ start: "15:00", end: "18:00" }],
      ],
      tuesday: [{ start: "10:00", end: "15:00" }],
      wednesday: [],
      thursday: [{ start: "10:00", end: "15:00" }],
      friday: [],
      saturday: [{ start: "09:00", end: "15:00" }],
      sunday: [],
    },
  },
};

// Funciones auxiliares para trabajar con tiempos
const timeStrToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTimeStr = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

// Resta los intervalos ocupados de un intervalo libre
const subtractInterval = (
  interval: { start: string; end: string },
  appointments: { start: string; end: string }[]
) => {
  let freeIntervals: { start: number; end: number }[] = [
    {
      start: timeStrToMinutes(interval.start),
      end: timeStrToMinutes(interval.end),
    },
  ];

  appointments.forEach((app) => {
    const appStart = timeStrToMinutes(app.start);
    const appEnd = timeStrToMinutes(app.end);
    freeIntervals = freeIntervals.flatMap((free) => {
      // Si no hay solapamiento, el intervalo queda tal cual
      if (appEnd <= free.start || appStart >= free.end) {
        return [free];
      }
      const intervals = [];
      if (appStart > free.start) {
        intervals.push({ start: free.start, end: appStart });
      }
      if (appEnd < free.end) {
        intervals.push({ start: appEnd, end: free.end });
      }
      return intervals;
    });
  });

  return freeIntervals.map((free) => ({
    start: minutesToTimeStr(free.start),
    end: minutesToTimeStr(free.end),
  }));
};

// Calcula los slots disponibles para una fecha, usando la duración del servicio y el slotInterval
export const getAvailableSlots = (
  dateStr: string,
  serviceDuration: number,
  slotInterval: number
): string[] => {
  const dayOfWeek = new Date(dateStr)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  const intervals = scheduleData.schedule.weekly_schedule[dayOfWeek] || [];
  const exceptions = scheduleData.schedule.exceptions[dateStr] || [];

  // Aplanamos en caso de que sea un array de arrays
  const flatIntervals = Array.isArray(intervals[0]) ? intervals.flat() : intervals;

  const appointmentsForDate = scheduleData.schedule.appointments
  .filter((app) => app.start_time.startsWith(dateStr))
  .map((app) => {    
    const startDate = new Date(app.start_time);
    const endDate = new Date(app.end_time);
    // Obtener la hora en formato HH:mm en UTC
    const startTime = `${startDate.getUTCHours().toString().padStart(2, "0")}:${startDate.getUTCMinutes().toString().padStart(2, "0")}`;
    const endTime = `${endDate.getUTCHours().toString().padStart(2, "0")}:${endDate.getUTCMinutes().toString().padStart(2, "0")}`;
    return { start: startTime, end: endTime };
  });

  let freeIntervals: { start: string; end: string }[] = [];
  flatIntervals.forEach((interval) => {
    const free = subtractInterval(interval, appointmentsForDate);
    freeIntervals = freeIntervals.concat(free);
  });

  let exceptionIntervals: { start: string; end: string }[] = [];
  freeIntervals.forEach((interval) => {
    const exception = subtractInterval(interval, exceptions);
    exceptionIntervals = exceptionIntervals.concat(exception);
  });

  const availableSlots: string[] = [];
  exceptionIntervals.forEach((interval) => {
    let startMin = timeStrToMinutes(interval.start);
    const endMin = timeStrToMinutes(interval.end);

    while (startMin + serviceDuration <= endMin) {
      availableSlots.push(minutesToTimeStr(startMin));
      startMin += slotInterval;
    }
  });

  return availableSlots;
};

// Helper para combinar una fecha y una hora (HH:mm) en una ISO string en UTC
const combineDateAndTimeToISO = (dateStr: string, timeStr: string): string => {
  return new Date(`${dateStr}T${timeStr}:00Z`).toISOString();
};

// Suma minutos a una ISO date string y devuelve la nueva ISO string
const addMinutesToISO = (isoDate: string, minutes: number): string => {
  const date = new Date(isoDate);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
};

interface AppointmentCalendarProps {
  serviceDuration: number; // en minutos (se toma de service.duration)
  slotInterval: number;    // calculado como GCD de las duraciones
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  serviceDuration,
  slotInterval,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [backgroundEvents, setBackgroundEvents] = useState<any[]>([]);
  const { dispatch } = useAppointment();

  // Slot seleccionado (hora)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Día clicado en el calendario
  const [clickedDate, setClickedDate] = useState<string>("");

  // Escala de verdes: a mayor "count" (slots), más oscuro el verde.
  // Si count = 0 => gris (#333333)
  // Día clicado => verde agua (#05AC9C)
  const getDayColor = (count: number, isSelected: boolean) => {
    if (isSelected) {
      // Día clicado
      return "#05AC9C"; // verde agua corporativo
    }
    if (count === 0) return "#333333"; // gris oscuro para días sin disponibilidad
    if (count === 1) return "#b6d9b0";
    if (count === 2) return "#8fcf8c";
    if (count === 3) return "#66c266";
    if (count === 4) return "#4CAF60";
    if (count >= 5) return "#0B6B31"; // verde bosque
    return "#333333";
  };

  const handleDateClick = (arg: any) => {
    const dateStr = arg.dateStr;
    const today = new Date()
    today.setDate(today.getDate() + 2);
    const twoDaysLater = today.toLocaleDateString("en-CA"); // Formato YYYY-MM-DD
  
    setSelectedDate(dateStr);
    setClickedDate(dateStr); // guardamos la fecha clicada
    if (dateStr < twoDaysLater) {
      setSlots([]); // No mostrar horarios en fechas pasadas
      return;
    }
    const available = getAvailableSlots(dateStr, serviceDuration, slotInterval);
    setSlots(available);
    setSelectedSlot(null); // resetea la selección de hora al cambiar de día
  };
  

  // Al hacer clic en un slot
  const handleSlotClick = (slot: string) => {
    if (!selectedDate) return;
    setSelectedSlot(slot);
    console.log("selectedDate", slot);

    const startISO = combineDateAndTimeToISO(selectedDate, slot);
    console.log("startISO", startISO);
    const endISO = addMinutesToISO(startISO, serviceDuration);
    dispatch({
      type: "SELECT_SLOT",
      payload: {
        start_time: startISO,
        end_time: endISO,
        is_online: true,
      },
    });
  };

  // Se actualizan los eventos de fondo cada vez que se cambia la vista
  const handleDatesSet = (arg: DatesSetArg) => {
    const events = [];
    const today = new Date();
    console.log("today", today);
    // today.setHours(1, 0, 0, 0);


    const currentDate = new Date(arg.start);
    console.log("currentDate", currentDate);
    while (currentDate < arg.end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const available = getAvailableSlots(dateStr, serviceDuration, slotInterval);
      const count = available.length;

      // Determinamos si es día pasado
      const isPast = currentDate < today;

      // ¿Es el día que se ha clicado?
      const isSelectedDay = dateStr === clickedDate;

      // Si es día pasado => gris
      // Sino, escalamos el verde según "count"
      const bgColor = isPast
        ? "#666666" // un gris un poco más claro para días pasados
        : getDayColor(count, isSelectedDay);

      events.push({
        id: dateStr,
        start: dateStr,
        allDay: true,
        display: "background",
        backgroundColor: bgColor,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setBackgroundEvents(events);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={backgroundEvents}
        locale={esLocale}
        datesSet={handleDatesSet}
      />
      {selectedDate && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold">
            Horarios disponibles para {selectedDate}:
          </h4>
          {slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {slots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleSlotClick(slot)}
                  className={`
                    px-3 py-1 rounded border text-center transition-colors
                    ${
                      selectedSlot === slot
                        ? "bg-[#05AC9C] text-white border-[#05AC9C]"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2">No hay horarios disponibles</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;
