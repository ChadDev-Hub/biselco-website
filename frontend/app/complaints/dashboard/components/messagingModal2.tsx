"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { useAuth } from "@/app/utils/authProvider";
import { SubmitHandler, useWatch, useForm } from "react-hook-form";
import MessagingSkeleton from "@/app/common/MessagingSkeleton";
import { LucideMessagesSquare, Send } from "lucide-react";
type Props = {
  complaint_id: number;
  messages: ComplaintMessage[];
  onOpen: () => void;
  onClosed: () => void;
  isOpen: boolean;
  numberOfUnseenMessages: number;
  setInitialData: (data: {
    complaints_id: number;
    message: string;
    receiver_id: string;
  }) => void;
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
const Messaging = ({
  complaint_id,
  messages,
  onOpen,
  isOpen,
  onClosed,
  numberOfUnseenMessages,
  setInitialData,
  receiver_id,
  messageLoading,
}: Props) => {
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
      });
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


  useEffect(()=>{
    if (messageValue?.length === 0 || messageValue === undefined){
      const el = textAreaRef.current
      if (el) {
        el.style.height = "auto";
      }
    }
  }, [messageValue])
  return (
    <>
      <button
        title="Messages"
        data-tip="Messages"
        type="button"
        
        className="btn tooltip w-20 relative indicator tooltip-top rounded-box flex flex-col items-center justify-center p-1 shadow-md border-gray-300"
        onClick={handleOpen}
      >
        {numberOfUnseenMessages > 0 && (
          <span className="indicator-item badge badge-secondary badge-xs">
            {numberOfUnseenMessages}
          </span>
        )}
        <LucideMessagesSquare
          width={30}
          height={30}
          className="text-yellow-500"
        />
        <label className="label text-[0.5rem] text-yellow-500">Messages</label>
      </button>
      <dialog tabIndex={-1} ref={modalRef} className="modal modal-bottom">
        <div className="modal-box bg-base-100 p-0 max-w-2xl max-h-[60vh] mx-auto flex flex-col">
          <>
            <div className="sticky px-2 py-2 bg-base-200 z-10 top-0 flex items-center">
              <h1 className="text-lg font-bold">Messages</h1>
              <button
                title="Close"
                type="button"
                onClick={handleClose}
                className="absolute btn-sm right-2 btn-error top-2 btn btn-circle"
              >
                X
              </button>
            </div>

            {messageLoading ? (
              <MessagingSkeleton />
            ) : messages.length > 0 ? (
              <div className=" overflow-y-auto px-4">
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
                            alt={`${m.sender.first_name} Chat`}
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
                <div ref={bottomRef} className="flex-1 overflow-y-auto px-4" />
              </div>
            ) : (
              <div className="w-full text-center">
                <h1>No Message Yet</h1>
              </div>
            )}
            <form
              name="messaging"
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-2 items-center mt-4 sticky bg-base-200 bottom-0 py-3 px-4"
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
                className="w-full bg-base-300 resize-none overflow-y-auto max-h-lg p-2 border rounded"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        </div>
      </dialog>
    </>
  );
};

export default Messaging;
