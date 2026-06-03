import Image from "next/image";
import Link from "next/link";


export default function Footer() {
    return (
        <div className={'grid grid-cols-3 bg-sec border-t-3 justify-center mt-6'}>
            <div className={'flex flex-col gap-1 items-center justify-center '}>
                <Link href={"mailto:contact@gaeltournier.dev"}>Me contacter</Link>
                <Link href={"www.linkedin.com/in/gael-tournier32"}>Linkedin</Link>
                <Link href={"https://github.com/FlyingCow31"}>Github</Link>
            </div>
            <Image src={"/logo"} alt={"Logo Gaël"} width={120} height={120} className={'mx-auto'}/>
            <div className={'flex flex-col gap-1 items-center justify-center '}>
                <Link href={"/mentions"}>Mentions Légales</Link>
                <Link href={"/cgv"}>Conditions Générales de Vente</Link>
            </div>
        </div>
    )
}