"use client"
import React, { useRef, useState } from 'react'
import GenericComplaints from './genericComplaintsForm'
import MeterComplaints from './meterComplaintsForm'
import {CircleGauge, UtilityPole, Cable, TowelRack, HousePlug, CircleQuestionMark, NotepadText} from "lucide-react"


    const ComplaintButtonAppearance:React.FC<{title:string, svg:React.ReactNode}> = ({title, svg}) => {
        return (
            <div className="w-full flex flex-col  items-center py-4 h-full">
                <span className="grow place-content-center">{svg}</span>
                <span className="text-[0.5rem] font-semibold">{title}</span>
            </div>
        )
    };


const CreateComplaints = () => {
    // COMPLAINTS CHOICES
    const complaintsChoices = [
        "Meter Services",
        "Pole & Support Structure",
        "Wiring & Cabling",
        "Transformer Unit",
        "Report Illegal Connection",       
        "Other"];
    

    // COMPLAINTS ISSUES
    const meterIssueChoices = [
        "Reconnection",
        "Calibration/ Meter Test",
        "Fluctuating",
        "Relocation", 
        "High Bill",
        "Service Disruption",
        "High Voltage",
        "Low Voltage",
        "No Bill",
        "No Power",
        "Burned Meter",
        "Other"
    ]

    const poleIsueChoices = [
        "leaning pole", 
        "burned pole" , 
        "damaged pole" , 
        "rotten pole", 
        "requests pole relocation", 
        "other"]

    const wiringIssueChoices = [
        "Loose Connection", 
        "Broken Service Drop Wire",
        "Tree Branch Interference",  
        "Spark or Burning Smell",
        "Sagging Service Drop Wire",
        "other",
    ]
    const TransformerIssueChoices = [
        "Burning Smell",
        "Transformer Noise",
        "Sparking from Transformer",
        "Transformer Explosion / Fire",
        "Oil Leakage",
        "low voltage",
        "high voltage",
        "other",

    ]

    // MODAL REF 
    const complaintsModalRef = useRef<HTMLDialogElement>(null);
    const [complaints, setComplaints] = useState("");
    const [hideChoices, sethideChoices] = useState(false);

    const handleChooseComplaints = (choosedComplaints: string) => {
        sethideChoices(!hideChoices);
        setComplaints(choosedComplaints);
    }

    // HANDLE OPEN MODAL
    const handleClick = () => {
        complaintsModalRef.current?.showModal();

    };

    // handle Close Modal
    const handleClose = () => {
        complaintsModalRef.current?.close();
        sethideChoices(false);
        setComplaints("");
    };

    let complaintComponentForm: React.ReactNode = null
    switch (complaints) {
        case "Meter Services":
            complaintComponentForm = 
            <MeterComplaints
            title={complaints} 
            choices={meterIssueChoices} 
            isother={false}/>
            break;
        case "Pole & Support Structure":
            complaintComponentForm = <GenericComplaints 
                            title={complaints}
                            choices={poleIsueChoices} />
            break;
        case "Wiring & Cabling":
            complaintComponentForm = <GenericComplaints 
                            title={complaints}
                            choices={wiringIssueChoices} />
            break;
        case "Transformer Unit":
            complaintComponentForm = <GenericComplaints 
                            title={complaints}
                            choices={TransformerIssueChoices} />
            break;

        case "Report Illegal Connection":
            console.log(complaints)
            complaintComponentForm = <MeterComplaints
            title={complaints} isother={true}/>
            break;
        case "Other":
            complaintComponentForm = <GenericComplaints 
                            title={complaints}
                            isother={true} />
            break;
        default:
            break;
    }

    
    // COMPLAINTS BUTTON
    const CompliantsButton= (complaint:string) => {
        switch (complaint) {
            case "Meter Services":
                return (
                    <ComplaintButtonAppearance 
                    title={complaint}
                    svg={<CircleGauge className="text-emerald-500 rounded-full shadow p-2" width={40} height={40} />}
                    
                    />
                )
            case "Pole & Support Structure":
                return (
                    <ComplaintButtonAppearance
                    title={complaint}
                    svg={<UtilityPole width={40} height={40} className="text-amber-500 rounded-full shadow p-2" />}
                    />
                )
            case "Wiring & Cabling":
                return (
                    <ComplaintButtonAppearance
                    title={complaint}
                    svg={<Cable className="text-blue-500 rounded-full shadow p-2" width={40} height={40} />}
                    />
                )
            case "Transformer Unit":
                return (
                    <ComplaintButtonAppearance
                    title={complaint}
                    svg={
                        <TowelRack width={40} height={40} className="text-violet-500 rounded-full shadow p-2"/>}
                        />
                )
            case "Report Illegal Connection":
                return (
                    <ComplaintButtonAppearance
                    title={complaint}
                    svg={<HousePlug width={40} height={40} className="text-red-500 rounded-full shadow p-2" />}
                    />
                )
            case "Other":
                return (
                    <ComplaintButtonAppearance
                    title={complaint}
                    svg={<CircleQuestionMark width={40} height={40} className="text-gray-500 rounded-full shadow p-2" />}
                    />
                )
                
            default:
                break;
        }
    }



    return (
        <>
            <button aria-label='modal' onClick={handleClick} type='button' className='btn flex btn-md rounded-full drop-shadow-md shadow-md btn-primary'>
                <NotepadText className='fill-blue-300 text-white drop-shadow-md ' width={20} height={20} />
                <span className='font-bold text-shadow-md '>
                    Submit Your Concern
                </span>
                
            </button>
            <dialog ref={complaintsModalRef} id="complaints-modal" className="modal modal-bottom sm:modal-middle backdrop-blur-md transition-all">
                
                <div className='relative flex flex-col px-1 p-0 gap-2  mx-auto  modal-box w-full max-h-[90vh] overflow-y-hidden'>
                    <div className='sticky top-0 p-2 text-2xl font-bold w-full bg-base-300'>
                        <p className='font-bold   text-shadow-md'>
                            Make a Concern
                        </p>
                        <button type='button' className='btn btn-circle shadow-md drop-shadow-md bg-error absolute top-1 right-2' onClick={handleClose}>x</button>
                    </div>
                    {!hideChoices && 
                    <div className='grid grid-cols-3 w-full pb-3 place-items-center sm:grid-cols-3  justify-between gap-2 '>
                        {
                            complaintsChoices.map((complaint, index) => (
                                <button onClick={() => 
                                handleChooseComplaints(complaint)} type='button' key={index} 
                                className='btn shadow-md border border-gray-300 drop-shadow-md w-32 h-32'>
                                    {CompliantsButton(complaint)}
                                </button>
                            ))}

                    </div>}
                    {hideChoices && complaintComponentForm}
                </div>
            </dialog>
        </>
    )
}
export default CreateComplaints