

import {MessageSquareWarning} from "lucide-react";


export type Updates = {
    id: number;
    name: string;
    error: boolean;
    error_name: string;
    planned: boolean;
    date: string;
};
interface timeLineProps {
    isAdmin?: boolean;
    Updates: Updates[];
    onDelete?: (updateId: number) => void;
}


export default function TimeLine({ Updates, isAdmin, onDelete } : timeLineProps ) {
    
    
    const basic = 5;
    let nbProjects = 0;

    Updates.forEach(() => nbProjects += 1);
    const attentionNeeded = Updates.find((truc) => truc.error)?.error_name;



    if (Updates.length === 0) return <div className={'bg-white w-fit ml-6 mt-6 border-3 shadow-big p-6 font-black text-2xl'}>La commande n&#39;a pas encore commencée</div>
    
    const anchorpoints = Updates.map((truc=> basic + (truc.id * 10)) );
    const extendHR = `${Math.max(...anchorpoints) + 10}%`;
    // For mobile, only display last advancement

    const handleDeletionOfProject = async (updateId: number) => {
        if (!isAdmin) return

        const response = await fetch(`/api/updates/${updateId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            onDelete?.(updateId);
        } else {
            alert('Erreur de suppression');
        }
    }

    return (
        <div>
            <div className={' relative h-100 overflow-x-auto mx-6 mt-6 bg-white shadow-big border-3'}>


                <div className={'absolute top-[50%] left-0 flex items-center'} style={{width : extendHR}}>
                    <hr
                        className={` border-red-950 w-full ml-6`}
                        />
                    <hr className={'border-dashed w-50'}/>
                </div>


                <div className={'mx-auto w-fit pt-3'} >
                    <p className={'text-xl font-title font-bold'}>Avancée de votre commande</p>
                    {attentionNeeded && <p className={'text-red-500 text-center'}>Attention: {attentionNeeded}</p>}
                </div>

                {Updates.map((truc) => {
                    return(
                        <div
                            key={truc.id}
                             className={`flex flex-col min-h-30 w-20 absolute top-[43%] items-center`}
                            style={{ left : `${basic + (truc.id * 10)}%`}}>
                            {/*Div without effect for members only*/}
                            {!isAdmin && <div className={`${truc.error ? "bg-red-500" : `${truc.planned ? "bg-sec opacity-50" : "bg-main"}`}  h-13 w-15 shadow-small border-2 flex justify-center items-center`}>
                                {truc.error && <MessageSquareWarning />}
                            </div>}

                            {/*Div for admin with deletion*/}
                            {isAdmin &&
                                <button
                                onClick={() => handleDeletionOfProject(truc.id)}
                                    className={`${truc.error ? "bg-red-500 hover:bg-red-800" : `${truc.planned ? "bg-sec opacity-50" : "bg-main"}`}  h-13 w-15 shadow-small border-2 flex justify-center items-center hover:bg-red-500 transition-all duration-100`} >
                                    {truc.error && <MessageSquareWarning />}
                                </button>
                            }
                            <p className={'mt-3 text-center'}>{truc.name}</p>
                            <p className={'opacity-50 italic text-sm text-center'}>{truc.date}</p>
                        </div>
                    )
                })}
                {/*add floating and click anim*/}
                <div className={'absolute bottom-10 right-10 '}>
                    {nbProjects == 10 && <p className={'text-main font-black text-2xl'}>{">>>>"}</p>}
                </div>

            </div>
        </div>
    )
}