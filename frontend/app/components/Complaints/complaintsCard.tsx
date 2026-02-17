import React from 'react'
import ComplaintsTimeLine from './complaintsTimeLine'
import ComplaintCardHeader from './complaintsCardHeader'
import Accordion from '../common/Accordion'
import Options from '../common/OptionsLists'
import DeletConfirmation from './deleteComplaintsConfirmation'




type Props = {
    id: number;
    subject: string;
    description: string;    
    status: status[];
    complaintsStatusName:[];
    serverurl?: string;
    deleteComplaint: (id: number) => void;
}
type status = {
    id: number;
    complaint_id: number;
    name: string;
    description: string;
    date: string;
    time: string
}

const ComplaintsCard = ({ subject, description, complaintsStatusName, status,deleteComplaint, id }: Props) => {
    return (
        <div className="card card-sm bg-base-100/35 shadow-2xl rounded-md drop-shadow-2xl px-2 w-full ">
            <ComplaintCardHeader>
                <h2 className='text-lg font-bold text-shadow-2xs'>{subject}</h2>
                <Options deletecomplaint={
                    (onclose) => (
                    <DeletConfirmation 
                    onClose={onclose} 
                    deleteComplaint={deleteComplaint}
                    complaintId={id}/>)
                    }/>
            </ComplaintCardHeader>
            <div className="card-body">
                <p className='text-md'>{description}</p>
            </div>
            <hr className='bg-gray-400/20' />
            <Accordion>
                <ComplaintsTimeLine
                    data={complaintsStatusName}
                    status={status}
                />
            </Accordion>
        </div>
    )
}

export default ComplaintsCard