"use client"
import { use, useEffect, useState } from 'react'
import ComplaintsCard from './complaintsCard'
import { useWebsocket } from '@/app/utils/websocketprovider'
import { redirect } from 'next/navigation'
import Messaging from '../dashboard/components/messagingModal2'
import { GetComplaintsMessage } from '@/app/actions/complaint'
import { useAuth } from '@/app/utils/authProvider'
import { useNotification } from '@/app/common/NotificationProvider'


type PromiseType = {
    status?: number;
    data: Complaints[];
}

type ComplaintStatusType = {
    status?: number;
    data: []
}

type Props = {
    complaintsData: Promise<PromiseType>;
    complaintsStatusName: Promise<ComplaintStatusType>;
    serverurl?: string;
}

type Complaints = {
    id: number;
    user_id: string;
    first_name: string;
    last_name: string;
    user_photo: string;
    subject: string;
    description: string;
    reference_pole: string;
    date_time_submitted: string;
    village: string;
    municipality: string;
    location: location,
    status: [];
    latest_status?: string;
    user_status?: string;
    
    resolution_time: string;
    unread_messages: number;
}

type location = {
    latitude: number;
    longitude: number;
    srid: number;
}


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

const ComplaintsContainer = (
    {
        complaintsData,
        complaintsStatusName,
        serverurl
    }: Props
) => {
    // DATA INITIALIZATION, STREAMING AND STATE MANAGEMENT
    const complaintsInitialData = use(complaintsData)
    const complaintsStatusNameInitialData = use(complaintsStatusName)
    const [complaints, setComplaints] = useState<Complaints[] | []>([]);
    const { user } = useAuth()
    const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);
    const [complaintsMessage, setComplaintsMessage] = useState<ComplaintMessage[] | []>([]);
    const [messageLoading, setMessageLoading] = useState(false)
    const [activeComplaintsId, setactiveComplaintsId] = useState<number | null>(null);
    const { playMessageNotification } = useNotification()
    useEffect(() => {
        switch (complaintsInitialData.status) {
            case 401:
                redirect("/landing")
                break;
            case 403:
                redirect("/landing")
                break;
            case 200:
                queueMicrotask(() =>
                    setComplaints(complaintsInitialData.data)
                );
                break;
            default:
                break;
        }
    }, [complaintsInitialData])
    
    // WEBSOCKET
    const { message, sendMessage } = useWebsocket();
    useEffect(() => {
        if (!message) return
        switch (message.detail) {
            case "complaints":
                queueMicrotask(() =>
                    setComplaints((prev) => {
                        const existingComplaints = prev.filter((complaint: Complaints) => complaint.id !== message.data.data.id)
                        return [message.data.data, ...existingComplaints]
                    })
                )
                break;
            case "complaint_status":
                queueMicrotask(() =>
                    setComplaints((prev) => {
                        return prev.map((complaint: Complaints) =>
                            complaint.id === message.data.id ? { ...complaint, ...message.data } : complaint
                        )
                    }))
                break;
            case "deleted_complaints":
                queueMicrotask(() =>
                    setComplaints((prev) => {
                        return prev.filter((complaint) => complaint.id !== message.data.id)
                    }))
                break;
            case "sent_message":
                queueMicrotask(() => {
                    if(isMessagingModalOpen && message.data.new_message.complaints_id === activeComplaintsId){
                    setComplaintsMessage((prev) => {
                        const exists = prev.some((msg) => msg.id === message.data.new_message.id);
                        if (exists) {
                            return prev.map((msg: ComplaintMessage) => msg.id === message.data.new_message.id ? { ...msg, ...message.data.new_message } : msg)
                        }
                        return [...prev, message.data.new_message]
                    })};
                    setComplaints((prev) => {
                        if (message.data.unread.sender_id === user?.id) return prev;
                        return prev.map((item: Complaints) => {
                            return item.id === message.data.unread.complaints_id ? { ...item, unread_messages: message.data.unread.unread_messages } : item
                        })
                    })
                });
                // Play Notification
                if (!isMessagingModalOpen) {
                    if (message.data.new_message.sender.id === user?.id) return
                    playMessageNotification();
                }
                break;
            case "seen_message":
                queueMicrotask(() => {
                    setComplaints((prev) => {
                        return prev.map((complaint: Complaints) =>
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
                    });
                });
                break;
            default:
                break;
        }
    }, [message, user, isMessagingModalOpen, playMessageNotification, activeComplaintsId]);



    // HANDLING DELTED COMPLAINTS
    const handleDelete = (id: number) => {
        const updatedComplaints = complaints.filter((complaint) => complaint.id !== id);
        setComplaints(updatedComplaints);
    };

    // MESSAGING MODAL CLOSE HANDLER
    const MessageClose = () => {
        setComplaintsMessage([]);
        setIsMessagingModalOpen(false);
        setactiveComplaintsId(null);
    };


    // MESSAGING MODAL OPEN HANDLER
    const MessageOpen = (complaintsId: number) => {
        if (complaintsId) {
            setMessageLoading(true)
            GetComplaintsMessage(complaintsId).then((res) => {
                if (res?.status === 200) {
                    setComplaintsMessage(res.data);
                    setMessageLoading(false);
                }
            });
            setactiveComplaintsId(complaintsId)
            setIsMessagingModalOpen(true);
        }
    };


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
        const UnseenMessages = complaintsMessage.filter((msg) =>
            msg.complaints_id === activeComplaintsId &&
            msg.receiver_status === "Unread"
            && msg.sender?.id !== user?.id);
        const data_ids = UnseenMessages.map((m) => m.id);
        sendMessage({
            detail: "seen_message",
            data: {
                message_ids: data_ids,
                receiver_status: "Seen",
                complaints_id: lastMessage.complaints_id
            },
        });
    }, [isMessagingModalOpen, complaintsMessage, user, sendMessage]);
    return (
        <section className='flex flex-col gap-4 w-full items-center'>
            {complaints.map((complaint: Complaints) => (
                <ComplaintsCard
                    key={complaint.id}
                    id={complaint.id}
                    user_id={complaint.user_id}
                    subject={complaint.subject}
                    description={complaint.description}
                    status={complaint.status}
                    date_time_submitted={complaint.date_time_submitted}
                    complaintsStatusName={complaintsStatusNameInitialData.data}
                    serverurl={serverurl}
                    deleteComplaint={handleDelete}>
                    <Messaging
                        complaint_id={complaint.id}
                        messageLoading={messageLoading}
                        isOpen={isMessagingModalOpen}
                        setInitialData={handleInitialDataSending}
                        numberOfUnseenMessages={complaint.unread_messages}
                        messages={complaintsMessage}
                        onOpen={() => MessageOpen(complaint.id)}
                        onClosed={MessageClose}
                        receiver_id={complaint.user_id === user?.id ? undefined : complaint.user_id} />
                </ComplaintsCard>
            ))}
        </section>
    )
}

export default ComplaintsContainer;