
const clients = [
    {
        name: "David",
        contact: "david@test.fr",
        project: "Site Web Fullstack",
        lastActivity: "06/06/2026"
    },
    {
        name: "Gaël",
        contact: "gael@test.fr",
        project: "WebApp",
        lastActivity: "06/06/2026"
    },
    {
        name: "Jean Jacques",
        contact: "jj@test.fr",
        project: "Logo",
        lastActivity: "06/06/2026"
    }
]

export default function Page() {
return (
    <div className={'min-h-screen bg-bg '}>
        <main>
            <p className={'font-title text-2xl text-center mt-3'}>Gaël Tournier - Pannel Administrateur</p>

            <div className={'flex flex-col ml-3'}>
                <button className={'w-fit bg-sec shadow-small border-3 p-3 my-3'}>Créer un nouvel Utilisateur</button>

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
                            <p>{client.name}</p>
                            <p>{client.contact}</p>
                            <p>{client.project}</p>
                            <p>{client.lastActivity}</p>
                            <button className={'w-fit bg-sec border-2 p-1'}>Voir l&#39;activité</button>
                            <button className={'w-fit bg-sec border-2 p-1'}>Voir les documents</button>
                        </div>
                ))}
            </div>

        </main>
    </div>
)
}