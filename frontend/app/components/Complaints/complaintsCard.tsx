import React from 'react'
import ComplaintsTimeLine from './complaintsTimeLine'
import ComplaintCardHeader from './complaintsCardHeader'
import Accordion from '../Accordion'
import Options from '../OptionsLists'
import DeletConfirmation from './deleteComplaintsConfirmation'




type Props = {
    subject: string;
    description: string;    
    status: [];
    complaintsStatusName: [];
    serverurl?: string
}
type status = {
    id: number;
    name: string;
    description: string;
    date: string;
    time: string
}

const ComplaintsCard = ({ subject, description, complaintsStatusName, status }: Props) => {
    const statusnameLists = status.map((item: status) => item.name);
    return (
        <div className="card card-sm bg-base-100/35 shadow-2xl rounded-md drop-shadow-2xl px-2 w-full ">
            <ComplaintCardHeader>
                <h2 className='text-lg font-bold text-shadow-2xs'>{subject}</h2>
                <Options deletecomplaint={(onclose) => (<DeletConfirmation onClose={onclose}/>)}/>
            </ComplaintCardHeader>
            <div className="card-body">
                <p className='text-md'>{description}</p>
            </div>
            <hr className='bg-gray-400/20' />
            <Accordion>
                <ComplaintsTimeLine
                    data={complaintsStatusName}
                    statuslist={statusnameLists}
                />
            </Accordion>
        </div>
    )
}

export default ComplaintsCard