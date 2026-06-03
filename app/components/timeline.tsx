

import {MessageSquareWarning} from "lucide-react";

const trucs = [
    {
        name: "Cahier des charges",
        index: 1,
        color: "main",
        date: "03/06/2026"
    },
    {
        name: "Design",
        index: 2,
        color: "main",
        date: "03/06/2026"
    },

    {
        name: "Développement interface",
        index: 3,
        color: "main",
        error: true,
        errorName: "Error JSP"
    },
    {
        name: "Déploiement",
        color: "main",
        index: 4,
        date: "planifiée",
        planned: true
    },

]



export default function TimeLine() {



    const basic = 5;
    let nbProjects = 0;

    trucs.forEach(() => nbProjects += 1);
    const attentionNeeded = trucs.find((truc) => truc.error)?.errorName;




    const anchorpoints = trucs.map((truc=> basic + (truc.index * 10)) );
    const extendHR = `${Math.max(...anchorpoints) + 10}%`;
    // For mobile, only display last advancement

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

                {trucs.map((truc) => {
                    return(
                        <div
                            key={truc.index}
                             className={`flex flex-col min-h-30 w-20 absolute top-[43%] items-center `}
                            style={{ left : `${basic + (truc.index * 10)}%`}}>
                            <div className={`${truc.error ? "bg-red-500" : `${truc.planned ? "bg-sec opacity-50" : "bg-main"}`}  h-13 w-15 shadow-small border-2 flex justify-center items-center`}>
                                {truc.error && <MessageSquareWarning />}
                            </div>
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