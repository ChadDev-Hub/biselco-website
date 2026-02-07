import React from 'react'
import ComplaintsTimeLine from './complaintsTimeLine'
type Props = {
    subject: string;
    description: string;
}

const ComplaintsCard = ({subject,description}: Props) => {
    return (
        <div className="card lg:card-side bg-base-100 shadow-sm">
            <figure>
                <ComplaintsTimeLine/>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{subject}</h2>
                <p>{description}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Listen</button>
                </div>
            </div>
        </div>
    )
}

export default ComplaintsCard