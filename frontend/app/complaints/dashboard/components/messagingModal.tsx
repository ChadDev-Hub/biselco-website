"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useWebsocket } from "@/app/utils/websocketprovider";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useAuth } from "@/app/utils/authProvider";
import { GetComplaintsMessage } from "@/app/actions/complaint";



type Props = {
  complaintData: ComplaintDataType;
};

type ComplaintDataType = {
  complaints_id?: number;
  receiver_id?: number;
};

type FormType = {
  message: string;
};

type ComplaintMessage = {
  id: string;
  complaints_id: number;
  message: string;
  receiver: User | undefined;
  sender: User;
  sender_status: string;
  receiver_status: string;
  date: string;
  time: string;
};

type User = {
  id: string;
  user_name: string;
  last_name: string;
  first_name: string;
  photo: string;
};
const MessageModal = ({ complaintData }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [ComplaintMessages, setComplaintMessage] = useState<ComplaintMessage[]>(
    [],
  );
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, control, setValue } = useForm<FormType>();
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const notif = useRef<HTMLAudioElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const messageValue = useWatch({
    control,
    name: "message",
  })
  //   NUMBER OF UNSEEN MESSAGES
  const numberOfUnseenMessages = ComplaintMessages.filter(
    (item) => { if (item.sender.id !== user?.id) return item.receiver_status === "Unread" },
  ).length;

  // OPEN MODAL
  const handleOpen = () => {
    modalRef.current?.showModal();
    setOpen(true);
    const data = GetComplaintsMessage(complaintData.complaints_id);
    data.then((res) => {
      setComplaintMessage(res?.data);
    });
  };
  // CLOSE MODAL
  const handleClose = () => {
    modalRef.current?.close();
    setOpen(false);
  };
  // WEBSOCKET CONTEXT
  const { message, sendMessage } = useWebsocket();

  // GET MESSAGES AND ASSIGN TO STATE
  useEffect(() => {
    switch (message?.detail) {
      case "complaint_message":
        queueMicrotask(() => {
          if (message.data.complaints_id !== complaintData.complaints_id)
            return;
          setComplaintMessage((prev) => {
            const messages = prev.filter((item) => item.id !== message.data.id);
            return [...messages, message.data]
          });
        });
        // Play notification
        if (user?.id !== message.data.sender.id && (user?.id === message.data.receiver?.id || message.data.receiver?.id === undefined)) {
          notif.current?.play();
        }
        break;
      case "seen_message":
        const seenMap = new Map(message.data.map((item) => [item.id, item]));
        queueMicrotask(() => {
          setComplaintMessage((prev) =>
            prev.map((item) => {
              const isSeen = seenMap.get(item.id);
              if (isSeen) {
                return {
                  ...item,
                  ...isSeen
                };
              }
              return item;
            }),
          );
        });
        break;
      default:
        break;
    }
  }, [message, complaintData.complaints_id, user?.id]);


  // IF MODAL IS OPEN SENDS A MESSAGE TO WEBSOCKET THAT NEW ARRIVES MESSAGE IS SEEN
  useEffect(() => {
    if (!open || !ComplaintMessages.length) return;
    const lastMessage = ComplaintMessages[ComplaintMessages.length - 1];
    if (lastMessage.sender.id === user?.id) return;
    sendMessage({ detail: "seen_message", data: { ...ComplaintMessages } });
  }, [open, ComplaintMessages, sendMessage, user?.id]);

  // SCROLL TO BOTTOM WHEN NEW MESSAGE ARRIVES
  useEffect(() => {
    if (!open || !ComplaintMessages.length) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }, [ComplaintMessages, open, user?.id]);

  const onSubmit: SubmitHandler<FormType> = (data) => {
    if (!data.message) return;
    const id = crypto.randomUUID();
    // ASSIGN INTIAL MESSAGE SENDING
  
    const newMessage = {
      id: id,
      complaints_id: complaintData.complaints_id!,
      message: data.message,
      receiver: undefined,
      sender: user!,
      sender_status: "Sending",
      receiver_status: "Unread",
      date: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila", day: "2-digit", month: "2-digit", year: "numeric", }),
      time: new Date().toLocaleTimeString("en-PH", { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit" }),
    };
    setComplaintMessage((prev) => [...prev, newMessage]);
    sendMessage({
      detail: "complaint_message",
      data: { ...complaintData, ...data, id: id },
    });
    reset({message:""});
  };


  return (
    <>
      <audio ref={notif} src="/notif.mp3" preload="metadata" />
      <button
        title="Messages"
        type="button"
        className="btn btn-circle btn-ghost indicator"
        onClick={handleOpen}
      >
        {numberOfUnseenMessages > 0 && <span className="indicator-item badge badge-secondary badge-xs">{numberOfUnseenMessages}</span>}
        <svg
          className="drop-shadow-md drop-shadow-amber-600"
          height={25}
          width={25}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#060505"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#000000"
            strokeWidth="0.768"
          >
            <path
              d="M20 6.75C21.5188 6.75 22.75 5.51878 22.75 4C22.75 2.48122 21.5188 1.25 20 1.25C18.4812 1.25 17.25 2.48122 17.25 4C17.25 5.51878 18.4812 6.75 20 6.75Z"
              fill="#0073ff"
            ></path>
            <path
              opacity="0.4"
              d="M20 8C17.79 8 16 6.21 16 4C16 3.27 16.21 2.59 16.56 2H7C4.24 2 2 4.23 2 6.98V12.96V13.96C2 16.71 4.24 18.94 7 18.94H8.5C8.77 18.94 9.13 19.12 9.3 19.34L10.8 21.33C11.46 22.21 12.54 22.21 13.2 21.33L14.7 19.34C14.89 19.09 15.19 18.94 15.5 18.94H17C19.76 18.94 22 16.71 22 13.96V7.44C21.41 7.79 20.73 8 20 8Z"
              fill="#0073ff"
            ></path>
            <path
              d="M12 12C11.44 12 11 11.55 11 11C11 10.45 11.45 10 12 10C12.55 10 13 10.45 13 11C13 11.55 12.56 12 12 12Z"
              fill="#0073ff"
            ></path>
            <path
              d="M16 12C15.44 12 15 11.55 15 11C15 10.45 15.45 10 16 10C16.55 10 17 10.45 17 11C17 11.55 16.56 12 16 12Z"
              fill="#0073ff"
            ></path>
            <path
              d="M8 12C7.44 12 7 11.55 7 11C7 10.45 7.45 10 8 10C8.55 10 9 10.45 9 11C9 11.55 8.56 12 8 12Z"
              fill="#0073ff"
            ></path>
          </g>
          <g id="SVGRepo_iconCarrier" className="fill-amber-400">
            <path
              d="M20 6.75C21.5188 6.75 22.75 5.51878 22.75 4C22.75 2.48122 21.5188 1.25 20 1.25C18.4812 1.25 17.25 2.48122 17.25 4C17.25 5.51878 18.4812 6.75 20 6.75Z"
              fill="#0073fg"
            ></path>
            <path
              opacity="1"
              d="M20 8C17.79 8 16 6.21 16 4C16 3.27 16.21 2.59 16.56 2H7C4.24 2 2 4.23 2 6.98V12.96V13.96C2 16.71 4.24 18.94 7 18.94H8.5C8.77 18.94 9.13 19.12 9.3 19.34L10.8 21.33C11.46 22.21 12.54 22.21 13.2 21.33L14.7 19.34C14.89 19.09 15.19 18.94 15.5 18.94H17C19.76 18.94 22 16.71 22 13.96V7.44C21.41 7.79 20.73 8 20 8Z"
              fill="#0073ff"
            ></path>
            <path
              d="M12 12C11.44 12 11 11.55 11 11C11 10.45 11.45 10 12 10C12.55 10 13 10.45 13 11C13 11.55 12.56 12 12 12Z"
              fill="#0073ff"
            ></path>
            <path
              d="M16 12C15.44 12 15 11.55 15 11C15 10.45 15.45 10 16 10C16.55 10 17 10.45 17 11C17 11.55 16.56 12 16 12Z"
              fill="#0073ff"
            ></path>
            <path
              d="M8 12C7.44 12 7 11.55 7 11C7 10.45 7.45 10 8 10C8.55 10 9 10.45 9 11C9 11.55 8.56 12 8 12Z"
              fill="#0073ff"
            ></path>
          </g>
        </svg>
      </button>
      <dialog tabIndex={-1} ref={modalRef} className="modal">
        <div className="modal-box">
          <h1 className="text-lg font-bold">Messages</h1>
          <button
            title="Close"
            type="button"
            onClick={handleClose}
            className="absolute top-2 right-2 btn btn-circle btn-sm"
          >
            X
          </button>
          <div className="max-h-50 overflow-y-auto">
            {ComplaintMessages?.map((m, index) => (
              <div key={index}>
                {index === 0 ||
                  new Date(ComplaintMessages[index - 1].date).toDateString() !==
                  new Date(m.date).toDateString() ? (
                  <p className="text-center text-gray-400 text-xs my-1">
                    {m.date}
                  </p>
                ) : null}
                <div
                  className={
                    user?.id === m.sender.id
                      ? "chat chat-end"
                      : "chat chat-start"
                  }
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <Image
                        width={20}
                        height={20}
                        className="rounded-full"
                        alt="Tailwind CSS chat bubble component"
                        src={m.sender.photo}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {m.sender.first_name}
                    <time className="text-xs opacity-50">{m.time}</time>
                  </div>
                  <div className="chat-bubble max-w-[50%] wrap-break-word whitespace-pre-wrap">{m.message}</div>
                  <div className="chat-footer opacity-50">
                    {m.sender.id === user?.id
                      ? m.sender_status
                      : m.receiver_status}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form name="messaging" onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mt-4">
            <textarea
              {...register("message")}
              value={messageValue}
              ref={textAreaRef}
              onChange={(e) => {
                // Update form value
                const val = e.target.value;
                // react-hook-form update
                setValue("message", val);

                // Adjust height
                const el = textAreaRef.current;
                if (!el) return;
                el.style.height = "auto"; // reset height
                el.style.height = Math.min(el.scrollHeight, 128) + "px";
              }}
              placeholder="Type message here..."
              rows={1}

              className="w-full resize-none overflow-y-auto max-h-md p-2 border rounded"
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default MessageModal;
