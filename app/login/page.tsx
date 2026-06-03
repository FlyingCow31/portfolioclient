


export default function Page() {
    return(
        <div>
            <div>
                <form>

                    <label>Identifiants</label>
                    <input type={"text"} />
                    <p>Vos identifiants vous ont étés envoyés par mail à la signature du devis.</p>

                    <label>Mot de passe</label>
                    <input type={"password"}/>
                    <p>Votre mot de passe a été envoyé dans le même mail.</p>

                    <button type={"submit"}>Se connecter</button>

                </form>
                <div>
                    <h1>&#34;Je n&#39;ai pas reçu mes identifiants&#34;</h1>
                    <p>Si vous n&#39;avez pas reçu vos identifiants, contactez contact@gaeltournier.dev.</p>
                </div>
            </div>
        </div>
    )
}

