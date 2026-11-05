import { supabase } from "../lib/supabase";

export async function initializeGuest() {
    // check for existing session
    const { data: { session }, error } = await supabase.auth.getSession();

    if(error) {
        throw error;
    }

    if(session) {
        return session.user;
    }

    // create a new anonymous session if does not exist
    const { data, error: signInError } = await supabase.auth.signInAnonymously();

    if(signInError) {
        throw signInError;
    }

    // returns newly created guest user
    return data.user;
}