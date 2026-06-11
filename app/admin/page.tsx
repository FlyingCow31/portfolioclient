"use client";
import React, {useEffect, useState} from "react";
import TimeLine, { Updates } from '@/app/components/timeline';
import {error} from "next/dist/build/output/log";


export default function Page() {
    type Client = {
        id: number;
        username: string;
        contact: string;
        role: string;
        project_title: string;
        project_id: number;
        last_activity: string;
    };
    type Document = {
        id: number;
        name: string;
        url: string;
        created_at: string;
    };

    const [clients, setClients] = useState<Client[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: "client",
        contact: ''
    });
    const [updateForm, setUpdateForm] = useState({
        name: '',
        error: false,
        error_name: '',
        planned: false,
        date: ''
    });
    const [submitError, setSubmitError] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Client | null>(null);
    const [ModaleTwoOpen, setModaleTwoOpen] = useState(false);
    const [updates, setUpdates] = useState<Updates[]>([]);
    const [newUpdate, setNewUpdate] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setClients(data))
    }, []);



    const handleActivityButton = async (client: Client) => {
        setCurrentProjectId(null);
        setUpdates([]);
        setSelectedUser(client);
        setModaleTwoOpen(true)


        const projectRes = await fetch(`/api/projects?userId=${client.id}`);

        const projects = await projectRes.json();

        if (projects[0]) {
            setCurrentProjectId(projects[0].id);
            const updatesRes = await fetch(`/api/projects/${projects[0].id}/updates`);
            const data = await updatesRes.json();
            setUpdates(data);
        }
    }

    const handleAddUpdate = async (e: React.SubmitEvent) => {
        e.preventDefault();
        await fetch(`/api/projects/${currentProjectId}/updates`, {
            method: 'POST',
            body: JSON.stringify(updateForm)
        });

        const res = await fetch(`/api/projects/${currentProjectId}/updates`);
        const data = await res.json();

        setUpdates(data);

    }


    const handleCreate = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const response = await fetch('/api/users/create', {
            method: 'POST',
            body: JSON.stringify(form)
        });

        if (response.ok) {
            setModalOpen(false);
        } else {

        }
    }

    // Document feature

    const [ documentModal, setDocumentModal ] = useState(false);
    const [ selectedUserDocs, setSelectedUserDocs ] = useState< Client | null >(null);
    const [ documents, setDocuments ] = useState<Document[]>([]);
    const [ docFormModal, setDocFormModal ] = useState(false);
    const [ documentForm, setDocumentForm ] = useState<{ file: File | null, userId: string }>({
        file: null,
        userId: ''
    });

    const handleGetDocuments = async (client: Client) => {
        setSelectedUserDocs(client);
        setDocumentModal(true);

        const response = await fetch(`/api/documents?userId=${client.id}`);
        const data = await response.json();
        setDocuments(data);
    };

    const handleDelDocuments = async (documentId: number) => {

        const response = await fetch(`/api/documents/${documentId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const response = await fetch(`/api/documents?userId=${selectedUserDocs?.id}`);
            const data = await response.json();
            setDocuments(data);
        } else {
            alert("Error with deletion.");
        }
    };

    const handleDocumentCreation = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!documentForm.file) return alert("veuillez selectionner un fichier!");

        const formData = new FormData();

        formData.append('file', documentForm.file!);
        formData.append('userId', selectedUserDocs!.id.toString());


        const response = await fetch(`/api/documents`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const response = await fetch(`/api/documents?userId=${selectedUserDocs?.id}`);
            const data = await response.json();
            setDocuments(data);
        } else {
            alert("Error with creation.");
        }
    }


    return (
    <div className={'min-h-screen bg-bg overflow-y-auto'}>
        <main className={'relative'}>
            <p className={'font-title text-2xl text-center mt-3'}>Gaël Tournier - Pannel Administrateur</p>

            <div className={'flex flex-col ml-3'}>
                <button className={'w-fit bg-sec shadow-small border-3 p-3 my-3'} onClick={() => setModalOpen(true)}>Créer un nouvel Utilisateur</button>

                <div className={'grid grid-cols-6 mt-3'}>
                    <p>Username</p>
                    <p>Contact</p>
                    <p>project Name</p>
                    <p>Last activity date</p>
                    <p>Voir l&#39;activité</p>
                    <p>Voir les documents</p>
                </div>
                <hr/>
                {clients.map((client, index) => (
                        <div key={index}  className={'grid grid-cols-6 border-b-1 border-black/25 py-2 items-center'}>
                            <p>{client.username}</p>
                            <p>{client.contact}</p>
                            <p>{client.project_title || "----"}</p>
                            <p>{client.last_activity ? new Date(client.last_activity).toLocaleDateString('fr-FR') : "Aucune activité"}</p>
                            <button className={'w-fit bg-sec border-2 p-1'} onClick={() => handleActivityButton(client)}>Voir l&#39;activité</button>
                            <button className={'w-fit bg-sec border-2 p-1'} onClick={() => handleGetDocuments(client)}>Voir les documents</button>
                        </div>
                ))}
            </div>
            {modalOpen &&
            <div className={'absolute bg-white top-50 left-[40%] border-3 shadow-big p-6 max-h-[90vh] overflow-y-auto '}>
                <button onClick={() => setModalOpen(false)} className={'m-3 p-1 px-3 bg-main border-2 font-black'}>X</button>
                <h2 className={'font-black text-3xl ml-3'}>Créer un nouveau Client</h2>
                <form onSubmit={handleCreate} className={'flex flex-col ml-3'}>
                    <label>Username</label>
                    <input
                        className={'border-1'}
                        type={"text"} onChange={(e) => setForm({...form, username: e.target.value})}/>

                    <label>Password</label>
                    <input className={'border-1'} type={"text"} onChange={(e) => setForm({...form, password: e.target.value})}/>

                    <label>Role</label>
                    <input type={"radio"} name={"role"} value={'client'} checked={form.role === 'client'} onChange={() => setForm({...form, role: 'client'})}/> Client
                    <input  type={"radio"} name={"role"} value={'admin'} checked={form.role === 'admin'} onChange={() => setForm({...form, role: 'admin'})}/> Admin

                    <label>Contact</label>
                    <input className={'border-1'} type={"text"} onChange={(e) => setForm({...form, contact: e.target.value})}/>

                    <button type={'submit'} className={'bg-main text-white py-1 px-3 w-fit mx-auto mt-3 border-2 border-black shadow-small'}>Envoyer</button>
                </form>
            </div>}
            {ModaleTwoOpen && selectedUser && (
                <div>
                    <div className={'absolute bg-white top-5 left-10 w-[95%] border-3 shadow-big p-6 max-h-[90vh] overflow-y-auto pb-100'}>
                    <button onClick={() => setModaleTwoOpen(false) } className={'ml-6 mb-6 p-1 px-3 bg-main border-2 font-black'}>X</button>
                    <button className={'ml-10 p-1 px-3 bg-main border-2 font-black'} onClick={() => setNewUpdate(true)}>Nouvelle Avancée</button>

                    <h2 className={'ml-6 font-bold text-xl'}>Timeline de {selectedUser.username}</h2>
                        <TimeLine Updates={updates} isAdmin={true} onDelete={(updateId) => setUpdates(updates.filter(u => u.id !== updateId))}/>
                        {newUpdate && (
                        <form className={'flex flex-col gap-3 ml-6 border-3 shadow-small mt-6 pb-6 '} onSubmit={handleAddUpdate}>
                            <div className={'flex gap-3 items-center'}>
                                <button className={'ml-10 p-1 px-3 bg-main border-2 font-black'} onClick={() => setNewUpdate(false)}>X</button>
                                <h2 className={'mt-3 text-xl'}>Créer une nouvelle update</h2>
                            </div>
                            <div className={'ml-3 flex gap-3'}>
                                <label>Nom</label>
                                <input type={'text'} className={'border'} onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})}/>
                            </div>

                            <div className={'ml-3 flex gap-3'}>
                                <label>Erreur?</label>
                                Oui<input type={"radio"} name={'error'} checked={updateForm.error} onChange={() => setUpdateForm({...updateForm, error: true})} />
                                Non<input type={"radio"} name={'error'} checked={!updateForm.error} onChange={() => setUpdateForm({...updateForm, error: false})} />
                            </div>

                            <div className={'ml-3 flex gap-3'}>
                                <label>Message d&#39;erreur</label>
                                <input type={"text"} className={'border'} onChange={(e) => setUpdateForm({...updateForm, error_name: e.target.value})}/>
                            </div>

                            <div className={'ml-3 flex gap-3'}>
                                <label>Planifiée?</label>
                                Oui<input type={"radio"} name={'planned'} checked={updateForm.planned} onChange={() => setUpdateForm({...updateForm, planned: true})} />
                                Non<input type={"radio"} name={'planned'} checked={!updateForm.planned} onChange={() => setUpdateForm({...updateForm, planned: false})} />
                            </div>

                            <div className={'ml-3 flex gap-3'}>
                                <label>Date</label>
                                <input type={'text'} className={'border'} onChange={(e) => setUpdateForm({...updateForm, date: e.target.value})}/>
                            </div>
                            <button type={"submit"} className={'bg-main text-white py-1 px-3 w-fit ml-3 mt-3 border-2 border-black shadow-small'}>Envoyer</button>
                        </form>
                    )}
                    </div>
                </div>)
            }
            {documentModal && (
                <div>
                    <div className={'absolute bg-white top-5 left-10 w-[95%] border-3 shadow-big p-6 max-h-[90vh] overflow-y-auto pb-100'}>
                        <button onClick={() => setDocumentModal(false)}>Fermer</button>
                        <button onClick={() => setDocFormModal(true)}>Add a new file</button>
                        <div className={'flex flex-col gap-2'}>
                            {documents.map((doc, index) => {
                                return (

                                    <div className={'grid grid-cols-4 items-center justify-center w-full bg-red-500'} key={index}>
                                        <p className={'text-left'}>{doc.name}</p>
                                        <p className={'text-center'}>{doc.created_at}</p>
                                        <a className={'text-right'} href={doc.url}>{"->"}</a>
                                        <button onClick={() => handleDelDocuments(doc.id)}>Supprimer</button>
                                    </div>
                                )
                            })}
                        </div>
                        {docFormModal &&
                        <div>
                            <button onClick={() => setDocFormModal(false)}>X</button>
                            <h2>Nouveau document</h2>

                            <form onSubmit={handleDocumentCreation}>
                                <label>Fichier</label>
                                <input type={"file"}
                                       accept={"application/pdf"}
                                        onChange={(e) => setDocumentForm({...documentForm, file: e.target.files?.[0] || null})}
                                />

                                <button type={"submit"}>Envoyer un nouveau document</button>
                            </form>
                        </div>}
                    </div>
                </div>
            )}
        </main>

    </div>
)
}