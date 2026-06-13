"use client";
import React, {useEffect, useState} from "react";
import TimeLine, { Updates } from '@/app/components/timeline';
import { ClientDocument, Client } from '@/app/types';


export default function Page() {


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
        setUpdateForm({
            name: '',
            error: false,
            error_name: '',
            planned: false,
            date: ''
        });
        setNewUpdate(false);

    }


    const handleCreate = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const response = await fetch('/api/users/create', {
            method: 'POST',
            body: JSON.stringify(form)
        });

        if (response.ok) {
            fetch('/api/users')
                .then(res => res.json())
                .then(data => setClients(data))
            setModalOpen(false);
        } else {

        }
    }

    // Document feature

    const [ documentModal, setDocumentModal ] = useState(false);
    const [ selectedUserDocs, setSelectedUserDocs ] = useState< Client | null >(null);
    const [ documents, setDocuments ] = useState<ClientDocument[]>([]);
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


    // project creation
    const [projectModal , setProjectModal ] = useState(false);
    const [selectedUserProj, setSelectedUserProj] = useState< Client | null >(null);
    const [ projectName, setProjectName] = useState({
        name: '',
        userId: ''
    });

    const handleProjectCreation = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!projectName.name) return alert('Un nom de projet est obligatoire!');

        const formData = new FormData();
        formData.append('name', projectName.name);
        formData.append('userId', selectedUserProj!.id.toString());

        const response = await fetch('/api/projects/create', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            await fetch('/api/users')
                .then(res => res.json())
                .then(data => setClients(data));
            setProjectModal(false);
        } else {
            alert('erreur lors de la création du projet');
        }
    }

    const handleUserDeletion = async (userId: number) => {
        const response = await fetch(`/api/users/${userId.toString()}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            alert('Client supprimé');
            await fetch('/api/users')
                .then(res => res.json())
                .then(data => setClients(data));
        } else {
            alert('erreur dans la suppression du client');
        }
    };

    return (
    <div className={'min-h-screen bg-bg overflow-y-auto'}>
        <main className={'relative'}>
            <p className={'font-title text-2xl text-center mt-3'}>Gaël Tournier - Pannel Administrateur</p>

            <div className={'flex flex-col ml-3 bg-white mt-15 p-6 border-3 shadow-big'}>
                <button className={'w-fit bg-sec shadow-small border-3 p-3 my-3'} onClick={() => setModalOpen(true)}>Créer un nouvel Utilisateur</button>
                <div className={'flex gap-3 md:block overflow-x-auto mt-3 pb-6'}>
                    <div className={'flex flex-col gap-3 md:grid md:grid-cols-7'}>
                        <p>Rôle</p>
                        <p>Username</p>
                        <p>Contact</p>
                        <p>project Name</p>
                        <p>Last activity </p>

                    </div>
                    <hr/>
                    {clients.map((client, index) => (
                            <div key={index}  className={`flex flex-col gap-6 md:grid md:grid-cols-7 md:border-b border-black/25 md:py-2 md:items-center`}>
                                {client.role == 'admin' ? <p>Admin</p> : <button onClick={() => {void handleUserDeletion(client.id)}} className={'w-fit underline'}>Supprimer</button>}
                                <p>{client.username}</p>
                                <p>{client.contact || "aucun contact"}</p>
                                {client.project_title
                                    ?
                                    <p>{client.project_title}</p>
                                    :
                                    <button
                                        className={'bg-main w-fit p-2 border-2 border-black text-white'}
                                        onClick={() => {setSelectedUserProj(client); setProjectModal(true);}}
                                    >Créer un projet</button>}
                                <p>{client.last_activity ? new Date(client.last_activity).toLocaleDateString('fr-FR') : "Aucune activité"}</p>
                                <button className={'w-fit bg-sec border-2 p-1'} onClick={() => handleActivityButton(client)}>Voir l&#39;activité</button>
                                <button className={'w-fit bg-sec border-2 p-1'} onClick={() => handleGetDocuments(client)}>Voir les documents</button>
                            </div>
                    ))}
                </div>
            </div>
            {projectModal &&
                <div className={'absolute bg-white top-[0%] left-5 md:top-50 md:left-[40%] border-3 shadow-big p-6 max-h-[90vh] overflow-y-auto '}>
                    <button onClick={() => setProjectModal(false)} className={'m-3 p-1 px-3 bg-main border-2 font-black'}>X</button>
                    <form onSubmit={handleProjectCreation} className={'flex flex-col gap-3'}>
                        <div>
                            <label className={'ml-3'}>Nom de projet</label>
                            <input type={"text"} className={'ml-3 border shadow-small'} onChange={(e) => setProjectName({...projectName, name: e.target.value})}/>
                        </div>

                        <button type={"submit"} className={'bg-sec py-1 px-3 border-2 shadow-small ml-3'}>Envoyer</button>
                    </form>
                </div>
            }
            {modalOpen &&
            <div className={'absolute top-[0%] bg-white md:top-50 md:left-[40%] border-3 shadow-big p-6 max-h-[90vh] overflow-y-auto '}>
                <button onClick={() => setModalOpen(false)} className={'m-3 p-1 px-3 bg-main border-2 font-black'}>X</button>
                <h2 className={'font-black text-3xl ml-3'}>Créer un nouveau Client</h2>
                <form onSubmit={handleCreate} className={'flex flex-col ml-3'}>
                    <label>Username</label>
                    <input
                        className={'border'}
                        type={"text"} onChange={(e) => setForm({...form, username: e.target.value})}/>

                    <label>Password</label>
                    <input className={'border'} type={"text"} onChange={(e) => setForm({...form, password: e.target.value})}/>

                    <label>Role</label>
                    <div className={'flex flex-wrap gap-2'}>
                        Client <input type={"radio"} name={"role"} value={'client'} checked={form.role === 'client'} onChange={() => setForm({...form, role: 'client'})}/>
                        Admin <input  type={"radio"} name={"role"} value={'admin'} checked={form.role === 'admin'} onChange={() => setForm({...form, role: 'admin'})}/>
                    </div>
                    <label>Contact</label>
                    <input className={'border'} type={"text"} onChange={(e) => setForm({...form, contact: e.target.value})}/>

                    <button type={'submit'} className={'bg-main text-white py-1 px-3 w-fit mx-auto mt-3 border-2 border-black shadow-small'}>Envoyer</button>
                </form>
            </div>}
            {ModaleTwoOpen && selectedUser && (
                <div>
                    <div className={'absolute bg-white top-5 left-3 md:left-10 w-[95%] border-3 shadow-big p-6 max-h-[90vh] overflow-y-auto '}>
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
                    <div className={'absolute bg-white top-5 left-3 md:left-10 w-[95%] border-3 shadow-big p-6 max-h-[90vh] overflow-y-auto pb-100'}>
                        <button onClick={() => setDocumentModal(false)} className={'bg-main px-3 py-1 text-white border-2 border-black'}>Fermer</button>
                        <button onClick={() => setDocFormModal(true)}
                                className={'mb-6 ml-10 bg-sec px-3 py-1 border-2'}>Add a new file</button>
                        <div className={'flex flex-col gap-2'}>
                            {documents.map((doc, index) => {
                                return (
                                    <div key={index}>
                                        <div className={'flex flex-col md:grid md:grid-cols-4 items-center justify-center w-full '} >
                                            <p className={'text-left text-xl text-main font-bold'}>{doc.name}</p>
                                            <p className={'text-center'}>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                                            <a className={'text-right'} href={doc.url}>{"télécharger"}</a>
                                            <button onClick={() => handleDelDocuments(doc.id)}
                                            className={'bg-sec w-fit justify-center mx-auto py-1 px-3 border-2'}>Supprimer</button>
                                        </div>
                                        <hr className={'mt-2'}/>
                                    </div>
                                )
                            })}
                        </div>
                        {docFormModal &&
                        <div className={'mt-3 border-2 shadow-small p-3'}>
                            <button onClick={() => setDocFormModal(false)}
                            className={'bg-main text-white border-2 border-black shadow-small px-3 py-1'}>Fermer</button>
                            <h2 className={'mt-3 text-2xl font-semibold'}>Nouveau document</h2>

                            <form onSubmit={handleDocumentCreation} className={'flex flex-col gap-3'}>
                                <div className={'flex gap-3'}>
                                    <label className={'text-xl text-main'}>Fichier:</label>
                                    <input type={"file"}
                                           accept={"application/pdf"}
                                           onChange={(e) => setDocumentForm({...documentForm, file: e.target.files?.[0] || null})}
                                           className={'border text-center shadow-small p-3 w-[40%] md:w-fit'}
                                    />
                                </div>
                                <button type={"submit"} className={'border-3 w-fit bg-main text-white border-black px-3 py-1'}>Envoyer un nouveau document</button>
                            </form>
                        </div>}
                    </div>
                </div>
            )}
        </main>

    </div>
)
}