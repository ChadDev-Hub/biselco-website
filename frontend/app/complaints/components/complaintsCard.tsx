"use client";
import ComplaintsTimeLine from "./complaintsTimeLine";
import ComplaintCardHeader from "./complaintsCardHeader";
import Accordion from "../../common/Accordion";
import Options from "../../common/OptionsLists";
import DeletConfirmation from "./deleteComplaintsConfirmation";
import ComplaintsCardBody from "./complaintCardBody";

type Props = {
  id: number;
  user_id: string;
  subject: string;
  description: string;
  status: status[];
  date_time_submitted: string;
  complaintsStatusName: [];
  serverurl?: string;
  deleteComplaint: (id: number) => void;
  children?: React.ReactNode;
};
type status = {
  id: number;
  complaint_id: number;
  name: string;
  description: string;
  date: string;
  time: string;
};

const ComplaintsCard = ({
  subject,
  description,
  complaintsStatusName,
  status,
  deleteComplaint,
  id,
  date_time_submitted,
  children
}: Props) => {
  return (
    <div className="card card-sm bg-base-100/35 shadow-2xl rounded-md drop-shadow-2xl p-4 w-full ">
      <ComplaintCardHeader>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-shadow-2xs underline text-blue-800">
            {subject}
          </h2>
          
          <p className="font-thin text-xs italic">
            <span className="font-bold">Submitted At:</span>{" "}
            {date_time_submitted}
          </p>
        </div>
        <div>
          {children}

          <Options
            deletecomplaint={(onclose) => (
              <DeletConfirmation
                onClose={onclose}
                deleteComplaint={deleteComplaint}
                complaintId={id}
              />
            )}
            dropdownOrientation="dropdown-bottom"
          />
        </div>

      </ComplaintCardHeader>
      <ComplaintsCardBody text={description} />
      <hr className="bg-gray-400/20" />
      <Accordion title="Show Status Informations">
        <ComplaintsTimeLine data={complaintsStatusName} status={status} />
      </Accordion>
    </div>
  );
};

export default ComplaintsCard;
