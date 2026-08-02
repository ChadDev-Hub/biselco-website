"use client";
import { use, useEffect, useState } from "react";
import { useWebsocket } from "@/app/context/websocketprovider";
import { useRouter } from "next/navigation";
import Messaging from "../dashboard/components/messagingModal2";
import { GetComplaintsMessage } from "@/lib/private-api/actions/complaint";
import { useAuth } from "@/app/context/authProvider";
import { useNotification } from "@/app/common/NotificationProvider";
import DeletConfirmation from "./deleteComplaintsConfirmation";
import ConcernCard from "./modernConcernCard";
import ComplaintsTimeLine from "./complaintsTimeLine";
import Mapbutton from "@/app/(protected)/complaints/dashboard/components/mapbutton";
import { Complaints, UserComplaintsResponseType, ComplaintMessage} from "@/types/complaints";


type PromiseType = {
  data: UserComplaintsResponseType;
  status: number;
};

type ComplaintStatusType = {
  status?: number;
  data: [];
};

type Props = {
  complaintsData: Promise<PromiseType>;
  complaintsStatusName: Promise<ComplaintStatusType>;
  serverurl?: string;
};





type FormType = {
  complaints_id: number;
  receiver_id: string;
  message: string;
};

const ComplaintsContainer = ({
  complaintsData,
  complaintsStatusName,
}: Props) => {
  // DATA INITIALIZATION, STREAMING AND STATE MANAGEMENT
  const complaintsInitialData = use(complaintsData);
  const complaintsStatusNameInitialData = use(complaintsStatusName);
  const [complaints, setComplaints] = useState<Complaints[] | []>([]);
  const [statusName, setStatusName] = useState([]);
  const { user } = useAuth();
  const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);
  const [complaintsMessage, setComplaintsMessage] = useState<
    ComplaintMessage[] | []
  >([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [activeComplaintsId, setactiveComplaintsId] = useState<number | null>(
    null,
  );
  const { playMessageNotification } = useNotification();
  const router = useRouter();
  useEffect(() => {
    const SetComplaintsData = async () => {
      try {
        setComplaints(complaintsInitialData.data.data);
      } catch(err) {
        console.log(err);
      }
    };
    SetComplaintsData();
  }, [complaintsInitialData]);

  useEffect(() => {
    const getInitialData = async () => {
      try {
        setStatusName(complaintsStatusNameInitialData.data);
      } catch {
        router.replace("/");
      }
    };
    getInitialData();
  }, [complaintsStatusNameInitialData, router]);
  // WEBSOCKET
  const { message, sendMessage } = useWebsocket();
  useEffect(() => {
    if (!message) return;
    switch (message.detail) {
      case "new_complaint":
        queueMicrotask(() =>
          setComplaints((prev) => {
            const existingComplaints = prev.filter(
              (complaint: Complaints) => complaint.id !== message.data.id,
            );
            return [message.data, ...existingComplaints];
          }),
        );
        break;
      case "new_status":
        queueMicrotask(() =>
          setComplaints((prev) => {
            return prev.map((complaint: Complaints) =>
              complaint.id === message.complaint_status.complaint_id
                ? { ...complaint, ...message.complaint_status }
                : complaint,
            );
          }),
        );
        break;
      case "deleted_complaints":
        queueMicrotask(() =>
          setComplaints((prev) => {
            return prev.filter((complaint) => complaint.id !== message.data.id);
          }),
        );
        break;
      case "sent_message":
        queueMicrotask(() => {
          if (
            isMessagingModalOpen &&
            message.data.new_message.complaints_id === activeComplaintsId
          ) {
            setComplaintsMessage((prev) => {
              const exists = prev.some(
                (msg) => msg.id === message.data.new_message.id,
              );
              if (exists) {
                return prev.map((msg: ComplaintMessage) =>
                  msg.id === message.data.new_message.id
                    ? { ...msg, ...message.data.new_message }
                    : msg,
                );
              }
              return [...prev, message.data.new_message];
            });
          }
          setComplaints((prev) => {
            if (message.data.unread.sender_id === user?.id) return prev;
            return prev.map((item: Complaints) => {
              return item.id === message.data.unread.complaints_id
                ? {
                    ...item,
                    unread_messages: message.data.unread.unread_messages,
                  }
                : item;
            });
          });
        });
        // Play Notification
        if (!isMessagingModalOpen) {
          if (message.data.new_message.sender.id === user?.id) return;
          playMessageNotification();
        }
        break;
      case "seen_message":
        queueMicrotask(() => {
          setComplaints((prev) => {
            return prev.map((complaint: Complaints) =>
              complaint.id === message.data.unread.complaints_id
                ? {
                    ...complaint,
                    unread_messages: message.data.unread.unread_messages,
                  }
                : complaint,
            );
          });

          setComplaintsMessage((prev) => {
            const seenMap = new Map(
              message.data.seen.map((msg) => [msg.id, msg]),
            );
            return prev.map((msg: ComplaintMessage) =>
              seenMap.has(msg.id) ? { ...msg, ...seenMap.get(msg.id) } : msg,
            );
          });
        });
        break;
      default:
        break;
    }
  }, [
    message,
    user,
    isMessagingModalOpen,
    playMessageNotification,
    activeComplaintsId,
  ]);

  // MESSAGING MODAL CLOSE HANDLER
  const MessageClose = () => {
    setComplaintsMessage([]);
    setIsMessagingModalOpen(false);
    setactiveComplaintsId(null);
  };

  // MESSAGING MODAL OPEN HANDLER
  const MessageOpen = async (complaintsId: number) => {
    if (complaintsId) {
      setMessageLoading(true);
      try {
        const message = await GetComplaintsMessage(complaintsId);
        if (!message) return  
        setComplaintsMessage(message);
        setMessageLoading(false);
      }
      catch(err) {
        console.log(err);
      } finally {
        setIsMessagingModalOpen(true);
        setactiveComplaintsId(complaintsId);
      }
    }}

  const handleInitialDataSending = (data: FormType) => {
    const id = crypto.randomUUID();
    // ASSIGN INTIAL MESSAGE SENDING

    const newMessage = {
      id: id,
      complaints_id: data.complaints_id,
      message: data.message,
      receiver: undefined,
      sender: user!,
      sender_status: "Sending",
      receiver_status: "Unread",
      date: new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setComplaintsMessage((prev) => [...prev, newMessage]);
    sendMessage({
      detail: "complaint_message",
      data: { ...data, id: id },
    });
  };

  useEffect(() => {
    if (!isMessagingModalOpen || !complaintsMessage.length) return;

    const lastMessage = complaintsMessage[complaintsMessage.length - 1];
    const activeComplaintsId = lastMessage.complaints_id;
    // don't mark your own message as seen
    if (lastMessage.sender.id === user?.id) return;
    const UnseenMessages = complaintsMessage.filter(
      (msg) =>
        msg.complaints_id === activeComplaintsId &&
        msg.receiver_status === "Unread" &&
        msg.sender?.id !== user?.id,
    );
    const data_ids = UnseenMessages.map((m) => m.id);
    sendMessage({
      detail: "seen_message",
      data: {
        message_ids: data_ids,
        receiver_status: "Seen",
        complaints_id: lastMessage.complaints_id,
      },
    });
  }, [isMessagingModalOpen, complaintsMessage, user, sendMessage]);

  return (
    <section className="flex flex-col gap-4 w-full items-center">
      {complaints.map((complaint: Complaints) => (
        // <
        <ConcernCard
          key={complaint.id}
          mapViewer={
            <Mapbutton
              title="Complaint Map"
              location={complaint.location}
              municipality={complaint.municipality}
              village={complaint.village}
            />
          }
          toolsComponent={
            <Messaging
              messageLoading={messageLoading}
              complaint_id={complaint.id}
              messages={complaintsMessage}
              setInitialData={(data) =>
                handleInitialDataSending({
                  complaints_id: data.complaints_id,
                  message: data.message,
                  receiver_id: data.receiver_id,
                })
              }
              isOpen={isMessagingModalOpen}
              numberOfUnseenMessages={complaint.unread_messages}
              onOpen={() => {
                setactiveComplaintsId(complaint.id);
                MessageOpen(complaint.id);
              }}
              onClosed={MessageClose}
            />
          }
          deleteTool={
            <div className="absolute top-1 right-2">
              <DeletConfirmation complaintId={complaint.id} />
            </div>
          }
          timeLine={
            <ComplaintsTimeLine data={statusName} status={complaint.status} />
          }
          userComplaint={complaint}
        />
      ))}
    </section>
  );
};

export default ComplaintsContainer;
