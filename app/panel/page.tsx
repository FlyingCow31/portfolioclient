import TimeLine from "@/app/components/timeline";
import Footer from "@/app/components/footer";


export default function Page() {
  return (
      <div className={' min-h-screen bg-bg'}>
        <main className={'w-full'}>
          <div className={'mx-auto w-fit p-3'}>
            <p className={'font-title font-bold'}>Gaël Tournier - Espace Client</p>
          </div>

          <div className={'bg-white w-fit p-6 shadow-big border-3 ml-6'}>
            <h1 className={'text-6xl font-black'}>Bienvenue sur <br/>votre espace!</h1>
            <p className={'text-xl mt-6 '}>Cet espace permet de centraliser les ressources, et de faciliter la communication!</p>
          </div>


          {/*La le concept c'est que ça change selon ce que je mets cette div fait le long, c'est une timeline*/}
          {/*Devient rouge si il y a quelque chose à faire*/}

          <TimeLine/>

            <div className={'flex w-[97%] gap-6 items-stretch justify-center mt-6 mx-6 '}>

                <div className={'bg-white p-6 w-[50%] border-3 shadow-small'}>
                  <h2 className={'text-2xl font-bold border-l-3 border-main pl-3'}>Messages</h2>
                  <div>
                    <p>Aucun message à afficher</p>
                  </div>
                </div>


                <div className={'w-[48%] bg-white p-6 border-3 shadow-small '}>
                    <h2 className={'text-2xl font-bold border-l-3 border-main pl-3'}>Mes Documents</h2>
                    <div className={'flex flex-col gap-2'}>
                        <div className={'grid grid-cols-3 items-center justify-center w-full'}>
                            <p className={'text-left'}>Contrat de Bienvenue</p>
                            <p className={'text-center'}>06/06/2026</p>
                            <p className={'text-right'}>{"->"}</p>
                        </div>
                        <div className={'grid grid-cols-3 items-center justify-center w-full'}>
                            <p>Facture d&#39;acompte</p>
                            <p className={'text-center'}>06/06/2026</p>
                            <p className={'text-right'}>{"->"}</p>
                        </div>
                    </div>
                </div>
            </div>

        </main>
          <Footer/>
      </div>
  )
}