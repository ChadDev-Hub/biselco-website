"use client";
import React, { useState, useEffect, use} from "react";
import MapButton from "./mapbutton";
import ComplaintStatusButton from "./statusButton";
import { useWebsocket } from "@/app/utils/websocketprovider";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import { useAlert } from "@/app/common/alert";
import MessageDetailView from "./messageDetailView";
import { useRouter } from "next/navigation";
import StatusHistoryModal from "./statusHistory";
import { GetComplaintsMessage } from "@/app/actions/complaint";
import Messaging from "./messagingModal2";
import { useAuth } from "@/app/utils/authProvider";
import { useNotification } from "@/app/common/NotificationProvider";
import ImageViewer from "./imageViewerModal";
type PromiseType = {
  status?: number;
  data: ComplaintsListData;
};

type ComplaintsListData = {
  data: Complaint[];
};

type Props = {
  data: Promise<PromiseType>;
};

type StatusHistory = {
  id: number;
  first_name: string;
  last_name: string;
  timestamped: string;
  comments: string;
  user_photo: string;
};

type Complaint = {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  user_photo: string;
  subject: string;
  reference_pole: string;
  description: string;
  date_time_submitted: string;
  village: string;
  municipality: string;
  location: Location;
  status_history: StatusHistory[];
  status: status[];
  latest_status?: string;
  user_status?: string;
  resolution_time: string;
  images?: ComplaintsImages[];
  unread_messages: number;
};

type Location = {
  latitude: number;
  longitude: number;
  srid: number;
};

type status = {
  id: number;
  complaint_id: number;
  status_id: number;
  name: string;
  description: string;
  date: string;
  time: string;
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
  complaints_id: number;
  receiver_id: string;
  message: string;
};


type ComplaintsImages = {
    id:number;
    url:string; 
}


const ComplaintsContainer = ({ data }: Props) => {
  const complaintsIinitialData = use(data);
  const [allComplaints, setallComplaints] = useState<Complaint[] | []>([]);
  const searchParms = useSearchParams();
  const page = searchParms.get("page");
  const router = useRouter();
  const {playMessageNotification} = useNotification();
  const [messageLoading, setMessageLoading] = useState(false);
  const [activeComplaintsId, setactiveComplaintsId] = useState<number | null>(
    null,
  );
  const { user } = useAuth();
  const handleSelectedComplaintsId = (complaintsId: number) => {
    setactiveComplaintsId(complaintsId);
  };

  const { showAlert } = useAlert();

  // SET INITIAL DATA ON MOUNT
  useEffect(() => {
    switch (complaintsIinitialData.status) {
      case 404:
        redirect("/landing");
        break;
      case 401:
        redirect("/complaints");
        break;
      case 200:
        queueMicrotask(() =>
          setallComplaints(complaintsIinitialData.data.data),
        );
        break;
      default:
        break;
    }
  }, [complaintsIinitialData]);


 
  // MESSAGING MODAL
  const [complaintsMessage, setComplaintsMessage] = useState<
    ComplaintMessage[] | []
  >([]);
  const [isMessaginModalOpen, setIsMessagingModalOpen] = useState(false);


  // MESSAGING MODAL OPEN HANDLER
  const MessageOpen = (complaintsId: number) => {
    if (complaintsId) {
      setMessageLoading(true);
      GetComplaintsMessage(complaintsId).then((res) => {
        if (res?.status === 200) {
          setComplaintsMessage(res.data);
          setMessageLoading(false);
        }
      });
      setIsMessagingModalOpen(true);
    }
  };


  // MESSAGING MODAL CLOSE HANDLER
  const MessageClose = () => {
    setComplaintsMessage([]);
    setIsMessagingModalOpen(false);
    setactiveComplaintsId(null);
  };


  //  HANDLE INITIAL DATA SENT
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


  // WEBSOCKETS

  const { message, sendMessage } = useWebsocket();

  useEffect(() => {
    if (!message) return;
    switch (message.detail) {
      case "complaints_admin":
        if (Number(page) !== 1 && page !== null) {
          showAlert("success", "New Concerns Submitted");
        } else {
          queueMicrotask(() => {
            setallComplaints((prev) => {
              const existingComplaints = prev.filter(
                (complaint) => complaint.id !== message.data.data.id,
              );
              return [message.data.data, ...existingComplaints].slice(0, 10);
            });
          });
        }
        break;
      case "complaint_status":
        queueMicrotask(() =>
          setallComplaints((prev) => {
            return prev.map((complaint: Complaint) =>
              complaint.id === message.data.id
                ? { ...complaint, ...message.data }
                : complaint,
            );
          }),
        );
        break;
      case "deleted_complaints":
        showAlert("success", "Complaint Deleted");
        router.refresh();
        break;
      case "presence":
        queueMicrotask(() =>
          setallComplaints((prev) => {
            return prev.map((complaint) =>
              complaint.user_id === message.data.user_id
                ? { ...complaint, ...message.data }
                : complaint,
            );
          }),
        );
        break;
      case "sent_message":
        queueMicrotask(() => {
          if (isMessaginModalOpen && message.data.new_message.complaints_id === activeComplaintsId){
          setComplaintsMessage((prev) => {
            const exists = prev.some((msg) => msg.id === message.data.new_message.id);
            if (exists) {
              return prev.map((msg: ComplaintMessage) => msg.id === message.data.new_message.id ? { ...msg, ...message.data.new_message } : msg)
            }
            return [...prev, message.data.new_message]
          })};
          setallComplaints((prev) => {
            if (message.data.unread.sender_id===user?.id) return prev
            return prev.map((item: Complaint) => {
              return item.id === message.data.unread.complaints_id ? { ...item, unread_messages: message.data.unread.unread_messages } : item
            })
          })
        });
        // PLAY NOTIFICATION
        if(!isMessaginModalOpen){
          if(message.data.new_message.sender.id===user?.id) return
          playMessageNotification();
        }
        break;
      case "seen_message":
        queueMicrotask(() => {
          setallComplaints((prev) => {
            return prev.map((complaint: Complaint) =>
              complaint.id === message.data.unread.complaints_id
                ? { ...complaint, unread_messages: message.data.unread.unread_messages }
                : complaint);
          });
          setComplaintsMessage((prev) => {
            const seenMap = new Map(
              message.data.seen.map((msg) => [msg.id, msg])
            );
            return prev.map((msg: ComplaintMessage) =>
              seenMap.has(msg.id)
                ? { ...msg, ...seenMap.get(msg.id) }
                : msg
            );
          })
        });
        break;
      default:
        break;
    }
  }, [message, router, showAlert, page, user, isMessaginModalOpen, playMessageNotification, activeComplaintsId]);

  useEffect(() => {
    if (!isMessaginModalOpen || !complaintsMessage.length) return;

    const lastMessage = complaintsMessage[complaintsMessage.length - 1];
    const activeComplaintId = lastMessage.complaints_id;
    // don't mark your own message as seen
    if (lastMessage.sender.id === user?.id) return;

    const UnseenMessages = complaintsMessage.filter((msg) => 
      msg.complaints_id === activeComplaintId &&
      msg.receiver_status === "Unread" && 
      msg.sender?.id !== user?.id);
    const data_ids = UnseenMessages.map((m) => m.id);

    sendMessage({
      detail: "seen_message",
      data: {
        message_ids: data_ids,
        receiver_status: "Seen",
        complaints_id: lastMessage.complaints_id
      },
    });
  }, [isMessaginModalOpen, complaintsMessage, user, sendMessage]);

  return (
    <>
    <tbody className="bg-base-100/45 backdrop-blur-2xl text-xs">
      {allComplaints.map((complaint: Complaint, index: number) => (
        <tr key={complaint.id}>
          <th className="z-10">{index}</th>
          <td>
            <div className={`avatar avatar-${complaint.user_status}`}>
              <div className="w-8">
                <Image
                  loading="eager"
                  src={
                    complaint.user_photo ??
                    "https://img.daisyui.com/images/profile/demo/distracted1@192.webp"
                  }
                  alt="User Photo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
            </div>
          </td>
          <td>{complaint.first_name}</td>
          <td>{complaint.last_name}</td>
          <td>{complaint.date_time_submitted}</td>
          <td className="w-full">{complaint.subject}</td>
          <td className="flex justify-center  w-full">
            <MessageDetailView complaintDescription={complaint.description} />
          </td>
          <td>{complaint.reference_pole}</td>
          <td align="center">
            <MapButton
              title="Consumer Complaints Map"
              municipality={complaint.municipality}
              village={complaint.village}
              location={complaint.location}
            />
          </td>
            <td>
              <ImageViewer data={complaint.images}/>
            </td>
          <td className="text-center">
            <ComplaintStatusButton
              status={
                allComplaints.find(
                  (complaint) => complaint.id === activeComplaintsId,
                )?.status ?? []
              }
              complaints_id={complaint.id}
              onOpen={handleSelectedComplaintsId}
            />
          </td>
          <td className="animate-pulse text-center text-blue-800 drop-shadow-md drop-shadow-amber-900 font-bold">
            {complaint.latest_status}
          </td>
          <td className="flex justify-center">
            <StatusHistoryModal data={complaint.status_history} />
          </td>
          <td>
            <Messaging
              messageLoading={messageLoading}
              complaint_id={complaint.id}
              messages={complaintsMessage.filter((msg) => msg.complaints_id === complaint.id)}
              onOpen={() => {
                MessageOpen(complaint.id);
                setactiveComplaintsId(complaint.id);}
              }
              onClosed={MessageClose}
              isOpen={isMessaginModalOpen}
              numberOfUnseenMessages={complaint.unread_messages}
              setInitialData={(data) => handleInitialDataSending({ complaints_id: data.complaints_id, message: data.message, receiver_id: data.receiver_id })
              } receiver_id={complaint.user_id}
            />
          </td>
          <td>
            {complaint.resolution_time ? complaint.resolution_time : "Unresolved"}
          </td>
        </tr>
      ))}
    </tbody>
    
    </>
    
  );
};
export default ComplaintsContainer;
