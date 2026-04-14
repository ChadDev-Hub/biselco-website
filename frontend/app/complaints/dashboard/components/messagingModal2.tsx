"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { useAuth } from "@/app/utils/authProvider";
import { SubmitHandler, useWatch, useForm } from "react-hook-form";
import MessagingSkeleton from "@/app/common/MessagingSkeleton";
type Props = {
  complaint_id: number;
  messages: ComplaintMessage[];
  onOpen: () => void;
  onClosed: () => void;
  isOpen: boolean;
  numberOfUnseenMessages: number;
  setInitialData: (data: { complaints_id: number; message: string, receiver_id: string }) => void;
  receiver_id?: string;
  messageLoading: boolean;
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

type FormType = {
  message: string;
};
const Messaging = ({ complaint_id, messages, onOpen, isOpen, onClosed, numberOfUnseenMessages, setInitialData, receiver_id, messageLoading}: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { register, handleSubmit, control, reset, setValue } =
    useForm<FormType>();
  const { user } = useAuth();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const messageValue = useWatch({ control, name: "message" });
  const handleOpen = () => {
    if (modalRef.current) {
      document.body.style.overflow = "hidden";
      onOpen();
      modalRef.current.showModal();
    }
  };
  const handleClose = () => {
    if (modalRef.current) {
      document.body.style.overflow = "";
      onClosed();
      modalRef.current.close();
      
    }
  };


  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || !messages.length) return;
    const container = bottomRef.current?.parentElement;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, isOpen]);

  const onSubmit: SubmitHandler<FormType> = (data) => {
    if (!data.message) return;

    setInitialData({
      complaints_id: complaint_id,
      receiver_id: receiver_id!,
      message: data.message,

    });
    reset({ message: "" });
  };
  return (
    <>
      <button
        title="Messages"
        type="button"
        className="btn btn-circle btn-ghost indicator"
        onClick={handleOpen}
      >
        {numberOfUnseenMessages > 0 && (
          <span className="indicator-item badge badge-secondary badge-xs">
            {numberOfUnseenMessages}
          </span>
        )}
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
          
            <>
              <h1 className="text-lg font-bold">Messages</h1>
              <button
                title="Close"
                type="button"
                onClick={handleClose}
                className="absolute top-2 right-2 btn btn-circle btn-sm"
              >
                X
              </button>
  
              {messageLoading ? 
              <MessagingSkeleton/> : 
              messages.length > 0 ?
              <div className="max-h-50 overflow-y-auto">
                {messages?.map((m, index) => (
                  <div key={index}>
                    {index === 0 ||
                      new Date(messages[index - 1].date).toDateString() !==
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
                      <div className="chat-bubble max-w-[50%] wrap-break-word whitespace-pre-wrap">
                        {m.message}
                      </div>
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
              : <div className="w-full text-center">
                <h1>No Message Yet</h1>
                </div>}
              <form
                name="messaging"
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-2 mt-4"
              >
                <textarea
                  {...register("message")}
                  value={messageValue}
                  ref={textAreaRef}
                  onChange={(e) => {
                    e.preventDefault();
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
              
            </>
            
        </div>
      </dialog>
    </>
  );
};

export default Messaging;
