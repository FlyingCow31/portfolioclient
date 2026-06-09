"use client";
import React, {useEffect, useState} from "react";
import TimeLine from "@/app/components/timeline";



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
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setClients(data))
    }, []);



    const handleActivityButton = async (client: Client) => {
        setUpdates([]);
        setSelectedUser(client);
        setModaleTwoOpen(true)
        console.log(client.id);
        const projectRes = await fetch(`/api/projects?userId=${client.id}`);

        const projects = await projectRes.json();
        console.log("projects: " + projects);
        if (projects[0]) {
            const updatesRes = await fetch(`/api/projects/${projects[0].id}/updates`);
            const data = await updatesRes.json();
            console.log('updates: ' + data);
            setUpdates(data);
        }
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




return (
    <div className={'min-h-screen bg-bg '}>
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
                            <button className={'w-fit bg-sec border-2 p-1'}>Voir les documents</button>
                        </div>
                ))}
            </div>
            {modalOpen &&
            <div className={'absolute bg-white top-50 left-[40%] border-3 shadow-big p-6 '}>
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
                <div className={'absolute bg-white top-50 left-10 w-[95%] border-3 shadow-big p-6 '}>
                <button onClick={() => setModaleTwoOpen(false) } className={'ml-6 mb-6 p-1 px-3 bg-main border-2 font-black'}>X</button>
                <button className={'ml-10 p-1 px-3 bg-main border-2 font-black'}>Nouvelle Avancée</button>

                <h2 className={'ml-6 font-bold text-xl'}>Timeline de {selectedUser.username}</h2>
                    <TimeLine Updates={updates}/>
                </div>
            )

            }
        </main>

    </div>
)
}