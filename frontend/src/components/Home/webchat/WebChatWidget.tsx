"use client";

import React, { useState, useRef, useEffect } from "react";
import { QuickPrompt, WebChatMessage } from "@/types/home";
import ChatHeader from "./ChatHeader";
import ChatIntakeForm from "./ChatIntakeForm";
import ChatMessageList from "./ChatMessageList";
import ChatInputBar from "./ChatInputBar";

interface Props {
  onClose: () => void;
}

export default function WebChatWidget({ onClose }: Props) {
  const [step, setStep] = useState<"form" | "chat">("form");
  const [selectedPrompt, setSelectedPrompt] = useState<QuickPrompt | null>(
    null,
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<WebChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmingBookingId, setConfirmingBookingId] = useState<string | null>(
    null,
  );
  const [confirmedBookingIds, setConfirmedBookingIds] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Periodic polling for incoming trader messages
  useEffect(() => {
    if (step !== "chat" || !phone) return;
    const poll = async () => {
      try {
        const res = await fetch(
          `${API}/channels/webchat/messages?phone=${encodeURIComponent(phone)}`,
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMessages(data.data);
        }
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 4000);
    return () => clearInterval(interval);
  }, [step, phone, API]);

  // Start chat session from intake form
  const handleStart = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setError("");
    setStep("chat");

    const baseMsg = selectedPrompt
      ? selectedPrompt.defaultMsg
      : "Hi, I need assistance with a trade booking.";

    const initialText = location.trim()
      ? `📍 Location: ${location.trim()}\n${baseMsg}`
      : baseMsg;

    const tempMsg: WebChatMessage = {
      id: `temp-${Date.now()}`,
      sender: "CUSTOMER",
      content: initialText,
    };
    setMessages([tempMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/channels/webchat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, text: initialText, name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to send message.");
        return;
      }

      const msgRes = await fetch(
        `${API}/channels/webchat/messages?phone=${encodeURIComponent(phone)}`,
      );
      const msgData = await msgRes.json();
      if (msgData.success && Array.isArray(msgData.data)) {
        setMessages(msgData.data);
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // Send typed message
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setError("");

    const tempMsg: WebChatMessage = {
      id: `temp-${Date.now()}`,
      sender: "CUSTOMER",
      content: text,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`${API}/channels/webchat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, text, name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to send message.");
        setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
        setInput(text);
        return;
      }

      const msgRes = await fetch(
        `${API}/channels/webchat/messages?phone=${encodeURIComponent(phone)}`,
      );
      const msgData = await msgRes.json();
      if (msgData.success && Array.isArray(msgData.data)) {
        setMessages(msgData.data);
      }
    } catch {
      setError("Cannot connect to server.");
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  // Accept proposed slot
  const handleAcceptBooking = async (bookingId: string | null) => {
    if (!bookingId || !phone) return;
    setConfirmingBookingId(bookingId);
    setError("");

    try {
      const res = await fetch(`${API}/channels/webchat/confirm-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmedBookingIds((prev) => [...prev, bookingId]);
        const msgRes = await fetch(
          `${API}/channels/webchat/messages?phone=${encodeURIComponent(phone)}`,
        );
        const msgData = await msgRes.json();
        if (msgData.success && Array.isArray(msgData.data)) {
          setMessages(msgData.data);
        }
      } else {
        setError(data?.message || "Failed to confirm booking.");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setConfirmingBookingId(null);
    }
  };

  // Request different slot
  const handleRejectBooking = async () => {
    const text = "Could you please propose a different time slot?";
    setInput("");
    setLoading(true);
    try {
      await fetch(`${API}/channels/webchat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, text, name }),
      });
      const msgRes = await fetch(
        `${API}/channels/webchat/messages?phone=${encodeURIComponent(phone)}`,
      );
      const msgData = await msgRes.json();
      if (msgData.success && Array.isArray(msgData.data)) {
        setMessages(msgData.data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden text-[#0F172A] font-sans"
      style={{ height: "620px" }}
    >
      {/* Header */}
      <ChatHeader onClose={onClose} />

      {/* Body: Intake Form or Conversation Stream */}
      {step === "form" ? (
        <ChatIntakeForm
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          location={location}
          setLocation={setLocation}
          selectedPrompt={selectedPrompt}
          setSelectedPrompt={setSelectedPrompt}
          error={error}
          onStart={handleStart}
        />
      ) : (
        <>
          <ChatMessageList
            messages={messages}
            loading={loading}
            error={error}
            confirmedBookingIds={confirmedBookingIds}
            confirmingBookingId={confirmingBookingId}
            bottomRef={bottomRef}
            onAcceptBooking={handleAcceptBooking}
            onRejectBooking={handleRejectBooking}
          />
          <ChatInputBar
            input={input}
            setInput={setInput}
            loading={loading}
            onSend={handleSend}
          />
        </>
      )}
    </div>
  );
}
