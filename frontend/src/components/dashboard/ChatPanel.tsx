"use client";

import React from "react";
import Image from "next/image";
import { Booking, ChatPanelProps } from "@/types/dashboard";
import {
  MessageSquare,
  Send,
  CalendarDays,
  CreditCard,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  Car,
  ShieldCheck,
} from "lucide-react";

export default function ChatPanel({
  conversation,
  replyContent,
  sendingMessage,
  onReplyChange,
  onSend,
  onOpenBookingModal,
  onOpenSlotsModal,
  onGeneratePayment,
  generatingPayment,
  onDeleteConversation,
}: ChatPanelProps) {
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/50">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
          <MessageSquare size={20} className="text-[#E11D48]" />
        </div>
        <p className="text-sm font-bold text-[#0F172A]">
          No Conversation Selected
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Select an intake lead from the queue to review messages, issue slots,
          and confirm bookings.
        </p>
      </div>
    );
  }

  const isWA = conversation.channel === "WHATSAPP";
  const bookings: Booking[] = conversation.bookings || [];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <Image
            src="/images.png"
            alt={conversation.customer.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#0F172A]">
                {conversation.customer.name}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isWA
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {isWA ? "WhatsApp" : "Web Chat"}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {conversation.customer.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSlotsModal}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer border border-[#E11D48]/30"
          >
            <Clock size={13} className="text-[#E11D48]" />
            Check Slots
          </button>
          <button
            onClick={onOpenBookingModal}
            className="px-3.5 py-1.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <CalendarDays size={13} className="text-white" />
            Book Slot
          </button>
          <button
            onClick={() => onDeleteConversation(conversation.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            title="Delete Conversation"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Bookings bar inside chat */}
      {(() => {
        const activeBookings = bookings.filter((b) => b.status !== "CANCELLED");
        if (activeBookings.length === 0) return null;

        const confirmedBooking = activeBookings.find(
          (b) => b.status === "CONFIRMED" || b.status === "COMPLETED",
        );
        const pendingBooking = activeBookings.find(
          (b) => b.status === "PENDING",
        );

        if (confirmedBooking) {
          return (
            <div className="bg-emerald-50/60 border-b border-emerald-200/80 px-4 py-3 shrink-0">
              <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#0F172A] truncate">
                        Confirmed:{" "}
                        {new Date(
                          confirmedBooking.slotStart,
                        ).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {confirmedBooking.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {new Date(confirmedBooking.slotStart).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}{" "}
                      –{" "}
                      {new Date(confirmedBooking.slotEnd).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}{" "}
                      • Fee:{" "}
                      <strong className="text-slate-800">
                        ${confirmedBooking.bookingFee}
                      </strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onGeneratePayment(confirmedBooking.id)}
                  disabled={generatingPayment === confirmedBooking.id}
                  className="bg-[#0F172A] hover:bg-[#1E293B] active:scale-98 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer shrink-0"
                >
                  <CreditCard size={13} />
                  <span>
                    {generatingPayment === confirmedBooking.id
                      ? "Generating..."
                      : "Send Stripe Link"}
                  </span>
                </button>
              </div>
            </div>
          );
        }

        if (pendingBooking) {
          return (
            <div className="bg-amber-50/70 border-b border-amber-200/80 px-4 py-2.5 shrink-0">
              <div className="flex items-center justify-between text-xs text-amber-900 bg-white px-3 py-2 rounded-xl border border-amber-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span>⏳</span>
                  <span className="font-semibold">
                    Slot Proposed:{" "}
                    {new Date(pendingBooking.slotStart).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    (
                    {new Date(pendingBooking.slotStart).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(pendingBooking.slotEnd).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    Awaiting Customer
                  </span>
                </div>
                <button
                  onClick={onOpenBookingModal}
                  className="text-[11px] font-bold text-[#E11D48] hover:underline cursor-pointer ml-2"
                >
                  Change Slot
                </button>
              </div>
            </div>
          );
        }

        return null;
      })()}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {conversation.messages.length === 0 ? (
          <div className="text-center text-slate-400 text-xs py-8">
            No messages in this intake yet.
          </div>
        ) : (
          conversation.messages.map((m) => {
            const isCustomer = m.sender === "CUSTOMER";
            return (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${isCustomer ? "justify-start" : "justify-end"}`}
              >
                {isCustomer && (
                  <Image
                    src="/images.png"
                    alt={conversation.customer.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-xs shrink-0 mb-0.5"
                  />
                )}
                {m.content.toLowerCase().startsWith("booking confirmed:") ||
                m.content.toLowerCase().startsWith("booking offer:")
                  ? (() => {
                      const content = m.content;
                      const isConfirmed = content
                        .toLowerCase()
                        .startsWith("booking confirmed:");
                      const feeMatch = content.match(/Fee:\s*\$([\d.]+)/i);
                      const fee = feeMatch ? feeMatch[1] : "50";
                      const timeMatch = content.match(
                        /\((\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\)/i,
                      );
                      const timeStr = timeMatch ? timeMatch[1] : null;

                      const cleaned = content
                        .replace(/Booking (Offer|Proposed|Confirmed):\s*/i, "")
                        .replace(
                          /\(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\)/i,
                          "",
                        )
                        .replace(/\(Fee:\s*\$[\d.]+\)/i, "")
                        .replace(/\[ID:\s*[a-zA-Z0-9_-]+\]/i, "")
                        .trim();

                      const dateStr = cleaned || "Scheduled Date";

                      return (
                        <div className="max-w-sm rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100 text-[#0F172A]">
                          <div
                            className={`px-3.5 py-2 text-white flex items-center justify-between ${
                              isConfirmed
                                ? "bg-linear-to-r from-emerald-600 to-teal-700"
                                : "bg-linear-to-r from-[#E11D48] to-[#BE123C]"
                            }`}
                          >
                            <span className="font-bold text-xs flex items-center gap-1.5">
                              {isConfirmed ? (
                                <CheckCircle size={14} />
                              ) : (
                                <CalendarDays size={14} />
                              )}
                              <span>
                                {isConfirmed
                                  ? "Booking Confirmed"
                                  : "Booking Offer"}
                              </span>
                            </span>
                            <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white">
                              {isConfirmed ? "Confirmed" : "Pending"}
                            </span>
                          </div>
                          <div className="p-3.5 space-y-2 text-xs bg-white">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <span className="font-bold text-slate-400 text-[11px]">
                                  Date:
                                </span>
                                <span className="font-bold text-[#0F172A]">
                                  {dateStr}
                                </span>
                              </div>
                              {timeStr && (
                                <div className="flex items-center gap-1.5 text-slate-700">
                                  <span className="font-bold text-slate-400 text-[11px]">
                                    Time:
                                  </span>
                                  <span className="font-bold text-[#E11D48]">
                                    {timeStr}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <span className="font-bold text-slate-400 text-[11px]">
                                  Fee:
                                </span>
                                <span className="font-bold text-slate-900">
                                  ${fee}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
                              <span className="text-slate-600 flex items-center gap-1.5">
                                <Car size={13} className="text-slate-500" />
                                <span>Travel Buffer (30m):</span>
                              </span>
                              <span className="font-bold text-emerald-600">
                                Applied
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  : (() => {
                      const url = m.content.match(/(https?:\/\/[^\s]+)/)?.[0];
                      const isPayment =
                        (m.content.toLowerCase().includes("payment link") ||
                          m.content.toLowerCase().includes("stripe.com")) &&
                        !!url;

                      if (isPayment && url) {
                        return (
                          <div className="max-w-sm rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100 text-[#0F172A]">
                            <div className="bg-linear-to-r from-[#0F172A] to-[#1E293B] px-3.5 py-2 text-white flex items-center justify-between">
                              <span className="font-bold text-xs flex items-center gap-1.5">
                                <CreditCard
                                  size={14}
                                  className="text-[#E11D48]"
                                />
                                <span>Stripe Payment Link Sent</span>
                              </span>
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Active
                              </span>
                            </div>
                            <div className="p-3.5 space-y-2.5 bg-white text-xs">
                              <p className="text-slate-600 leading-relaxed font-medium">
                                Direct payment link sent to customer.
                              </p>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 px-3 bg-[#E11D48] hover:bg-[#BE123C] active:scale-98 text-white font-bold rounded-xl shadow-xs transition text-center flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>Open Stripe Checkout</span>
                                <ExternalLink size={12} />
                              </a>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                                <span className="flex items-center gap-1 text-slate-500 font-medium">
                                  <ShieldCheck
                                    size={13}
                                    className="text-emerald-500"
                                  />{" "}
                                  Stripe Protected
                                </span>
                                <span className="font-mono text-[9px] text-slate-400">
                                  100% Encrypted
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          className={`max-w-sm px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isCustomer
                              ? "bg-white border border-slate-200 text-[#0F172A] rounded-bl-none shadow-xs"
                              : "bg-[#E11D48] text-white rounded-br-none shadow-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.content}</p>
                          {m.sentAt && (
                            <span
                              className={`text-[9px] block text-right mt-1 ${isCustomer ? "text-slate-400" : "text-white/80"}`}
                            >
                              {new Date(m.sentAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      );
                    })()}
              </div>
            );
          })
        )}
      </div>

      {/* Reply input */}
      <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
        <input
          type="text"
          placeholder={`Reply to ${conversation.customer.name}...`}
          value={replyContent}
          onChange={(e) => onReplyChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20"
        />
        <button
          onClick={onSend}
          disabled={sendingMessage || !replyContent.trim()}
          className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Send size={13} />
          {sendingMessage ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
