"use client"

import TimeLine from "@/app/components/timeline";
import Footer from "@/app/components/footer";
import React, {useEffect, useState} from "react";
import { ClientDocument } from "@/app/types";


export default function Page() {

    const [projects, setProjects] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [documents, setDocuments] = useState<ClientDocument[]>([]);

    // Fetch projects and actualise the modal
    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(async (projects) => {
                setProjects(projects);
                if (projects[0]) {
                    const res = await fetch(`/api/projects/${projects[0].id}/updates`);
                    const data = await res.json();
                    setUpdates(data);
                }
        });
    }, []);

    // fetch the documents
    useEffect(() => {
        fetch(`/api/documents`)
            .then(res => res.json())
            .then((documents) => {
                setDocuments(documents);
        })
    }, []);

    return (
      <div className={' min-h-screen bg-bg flex flex-col'}>
        <main className={'w-full flex-1'}>
          <div className={'mx-auto w-fit p-3'}>
            <p className={'font-title font-bold '}>Gaël Tournier - Espace Client</p>
          </div>

          <div className={'bg-white ml-3 w-[95%] md:w-fit p-6 shadow-big border-3  md:ml-6'}>
            <h1 className={'text-6xl font-black font-title'}>Bienvenue sur votre espace!</h1>
            <p className={'text-xl mt-6 '}>Cet espace permet de centraliser les ressources, et de faciliter la communication!</p>
          </div>


          <TimeLine Updates={updates}/>

            <div className={'flex flex-col w-full md:flex-row md:w-[97%] gap-6 items-stretch justify-center mt-6 md:mx-6 ml-3 '}>

                <div className={'bg-white p-6 w-95 md:w-[50%] border-3 shadow-small'}>
                  <h2 className={'text-2xl font-bold border-l-3 border-main pl-3 font-title'}>Messages</h2>
                  <div>
                    <p>Aucun message à afficher</p>
                  </div>
                </div>


                <div className={'w-95 md:w-[48%] bg-white p-6 border-3 shadow-small '}>
                    <h2 className={'text-2xl font-bold border-l-3 border-main pl-3 font-title'}>Mes Documents</h2>

                    <div className={'flex flex-col gap-2 mt-3'}>
                        { documents.length === 0 ? (
                            <p>Aucun document à afficher</p>
                            ) : (

                            documents.map((doc, index) => {
                            return (
                                <div className={'grid grid-cols-3 items-center justify-center w-full'} key={index}>
                                    <p className={'text-left'}>{doc.name}</p>
                                    <p className={'text-center'}>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                                    <a className={'text-right'} href={doc.url} download={doc.url}>{"Télecharger"}</a>
                                </div>
                            )
                        }))}
                    </div>
                </div>
            </div>

        </main>
          <Footer/>
      </div>
  )
}