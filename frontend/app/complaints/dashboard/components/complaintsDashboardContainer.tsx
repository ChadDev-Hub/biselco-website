"use client";
import React, { useState, useEffect, use } from "react";
import MapButton from "./mapbutton";
import ComplaintStatusButton from "./statusButton";
import { useWebsocket } from "@/app/utils/websocketprovider";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import { useAlert } from "@/app/common/alert";
import MessageDetailView from "./messageDetailView";
import { useRouter } from "next/navigation";
import StatusHistoryModal from "./statusHistory";
import MessageModal from "./messagingModal";
import { GetComplaintsMessage } from "@/app/actions/complaint";
import Messaging from "./messagingModal2";
import { useAuth } from "@/app/utils/authProvider";

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
  user_id: number;
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

const ComplaintsContainer = ({ data }: Props) => {
  const complaintsIinitialData = use(data);
  const [allComplaints, setallComplaints] = useState<Complaint[] | []>([]);
  const searchParms = useSearchParams();
  const page = Number(searchParms.get("page")) ?? 1;
  const router = useRouter();
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
  const MessageOpen = (complaintsId: number) => {
    if (complaintsId) {
      GetComplaintsMessage(complaintsId).then((res) => {
        if (res?.status === 200) {
          setComplaintsMessage(res.data);
        }
      });
      setIsMessagingModalOpen(true);
    }
  };
  const MessageClose = () => {
    setComplaintsMessage([]);
    setIsMessagingModalOpen(false);
  };


  // WEBSOCKETS

  const { message, sendMessage } = useWebsocket();
  useEffect(() => {
    if (!message) return;
    switch (message.detail) {
      case "complaints_admin":
        if (page !== 1 && page !== 0) {
          showAlert("success", "New Concerns Submitted");
          return;
        } else {
          queueMicrotask(() => {
            setallComplaints((prev) => {
              const existingComplaints = prev.filter(
                (complaint) => complaint.id !== message.data.id,
              );
              return [message.data, ...existingComplaints].slice(0, 10);
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
      case "seen_message":
        queueMicrotask(() => {
          setallComplaints((prev) => {
            return prev.map((complaint: Complaint) => 
              complaint.id === message.data.unread.complaints_id
                ? { ...complaint, unread_messages: message.data.unread.unread_messages  }
                : complaint);
          });
        });
        break;
      default:
        break;
    }
  }, [message, router, showAlert, page]);
  console.log(allComplaints);
  useEffect(() => {
    if (!isMessaginModalOpen || !complaintsMessage.length) return;
    const lastMessage = complaintsMessage[complaintsMessage.length - 1];
    if (lastMessage.sender.id === user?.id) return;
    sendMessage({ detail: "seen_message", data: { ...complaintsMessage } });
  }, [isMessaginModalOpen, complaintsMessage, user?.id]);

  return (
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
          <td align="center">
            <MapButton
              municipality={complaint.municipality}
              village={complaint.village}
              location={complaint.location}
            />
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
          <td className="animate-pulse text-center text-success drop-shadow-md drop-shadow-amber-900 font-bold">
            {complaint.latest_status}
          </td>
          <td className="flex justify-center">
            <StatusHistoryModal data={complaint.status_history} />
          </td>
          {/* <td>
                                <MessageModal
                                complaintData={{
                                    complaints_id: complaint.id,
                                    receiver_id: complaint.user_id
                                }}
                                />
                            </td> */}
          <td>
            <Messaging
              messages={complaintsMessage}
              onOpen={() => MessageOpen(complaint.id)}
              onClosed={MessageClose}
              isOpen={isMessaginModalOpen}
              numberOfUnseenMessages={complaint.unread_messages}
            />
          </td>
        </tr>
      ))}
    </tbody>
  );
};
export default ComplaintsContainer;
