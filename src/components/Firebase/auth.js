import React, {useState, useEffect} from 'react';
import FirebaseApp from './base';
import * as CONSTANTS from '../../constants/constants';

export const AuthContext = React.createContext();

var db = FirebaseApp.firestore();

export const AuthProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [pending, setPending] = useState(true);



    useEffect(() => {
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                db
                .collection(CONSTANTS.ADMIN)
                .where(CONSTANTS.ADMIN_EMAIL, "==", FirebaseApp.auth().currentUser.email)
                .get()
                .then(function(querySnapshot) {
                    if (querySnapshot.docs.length === 0) {
                        FirebaseApp.auth().signOut().then(() => {
                            setCurrentUser(user);
                            setPending(false);
                            alert('User is not admin');
                        });
                    } 
                    else {
                setCurrentUser(user);
                        setPending(false)
                    }
                })
                .catch(function(error) {
                    alert(error);
                });
            } else {
                setCurrentUser(user);
                setPending(false)
            }
        });
    }, []);

    if(pending){
        return <>Loading...</>
    }

    return(
        <AuthContext.Provider value={{
            currentUser
        }} >
        
        {children}

        </AuthContext.Provider>
    );
};