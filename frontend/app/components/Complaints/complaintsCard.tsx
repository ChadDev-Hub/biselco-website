import React from 'react'
import ComplaintsTimeLine from './complaintsTimeLine'
import Divider from '../NewsFeed/CustomDivider'
import Accordion from '../Accordion'
type Props = {
    subject: string;
    description: string;
    status: [];
    complaintsStatusName: [];
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
        <div className="card bg-base-100/35 shadow-2xl rounded-md drop-shadow-2xl px-2 w-89 md:w-96 lg:w-180">
            <div className='card-title px-4 py-4'>
                <h2 className='text-2xl font-bold text-shadow-2xs'>{subject}</h2>
            </div>
            <div className="card-body">
                <p className='text-xl'>{description}</p>
            </div>
            <Divider />

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