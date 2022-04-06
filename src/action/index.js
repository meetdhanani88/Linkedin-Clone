
import db, { auth, provider, storage } from "../firebase";



export async function SignInAPI() {
    try {
        const data = await auth.signInWithPopup(provider)
        return data.user;
    } catch (error) {

        return error;
    }

}
