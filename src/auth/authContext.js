import {auth} from '../firebase.config';
import { createContext, useContext, useEffect, useState } from 'react';
import {setPersistence, localStoragePersistence , createUserWithEmailAndPassword, signInWithEmailAndPassword,GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail, browserLocalPersistence } from 'firebase/auth';
import { Firestore, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
export const authContext=createContext()
const firestore=getFirestore();

export const useAuth=()=>{
const context=useContext(authContext)



    if(!context){

        throw new Error(context);
    }  
    return context;
}



export function AuthProvider({children}){
    const[user, setUser]=useState(null);
    
    const getInfo=async(uid)=>{
        const docRef=doc(firestore, `users/${uid}`)
        const docSnap=await getDoc(docRef)
        const infoFinal=docSnap.data().username;
        return infoFinal;

    }



      const setUserWithUsername = (currentUser) => {
        if (currentUser) {
          getInfo(currentUser.uid).then((username, rol) => {
            const userData = {
              uid: currentUser.uid,
              email: currentUser.email,
              username: username,
              photoURL: currentUser.photoURL, 
              rol: rol
            }
            updateProfile(currentUser, { photoURL: currentUser.photoURL }) 
              .then(() => {
                setUser(userData); 
              })
              .catch((error) => {
                console.error(error);
              });
          });
        } else {
          setUser(null);
        }
      }
      
      useEffect(() => {
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
              if (!currentUser) {
                setUser(null);
              } else {
                setUserWithUsername(currentUser);
              }
            });
            return unsubscribe;
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

 


    const register=async (email, password, username)=>{

        try{
            const response= await createUserWithEmailAndPassword(auth, email, password)

           const docuRef=await doc(firestore, `users/${response.user.uid}`)
            setDoc(docuRef, {username: username, email: email})

            

        }
        catch(error){  
            if(error.code==="auth/email-already-in-use"){
                throw new Error("Este email ya está en uso")
            } else if  (error.code==="auth/weak-password"){
                throw new Error("La contraseña tiene al menos 8 caracteres y contener al menos un carácter especial.")
            }   else if (error.code==="auth/invalid-email"){
                throw new Error("El email no es válido. Asegúrate de que no hay espacios en blanco")
            } else if (error.code==="auth/operation-not-allowed"){
                throw new Error("Este nombre de usuario ya está en uso")
            } 
            else{
                throw new Error("No se ha podido registrar. Inténtalo más tarde")
            }



        }

    }

    //resetar contraseña 
    
    const resetPassword=async(email)=>{
        try{
            const response= await sendPasswordResetEmail(auth, email)

            signOut(auth)

        } catch(error){
            if(error.code==="auth/user-not-found"){
                throw new Error("No se ha encontrado ningún usuario con este email. Asegúrate de que lo has escrito bien")
            } else if (error.code==="auth/invalid-email"){
                throw new Error("El email no es válido. Asegúrate de que no hay espacios en blanco")
            } else{
                throw new Error("No se ha podido enviar el email. Inténtalo más tarde")
            }
        }
    }

    


    

            


    const login=async(email, password)=>{
        try{
            const response= await signInWithEmailAndPassword(auth, email, password)

        } catch(error){
            if(error.code==="auth/wrong-password"){
                throw new Error("La contraseña es incorrecta")
            } else if(error.code==="auth/wrong-email"){
                throw new Error("El email es incorrecto. Inténtalo de nuevo")
            }else if (error.code === "auth/user-disabled"){
                throw new Error("Tu cuenta está inhabilitada. Ponte en contacto con el administrador")
            } 
            else if (error.code==="auth/user-not-found"){
                throw new Error("No se ha encontrado ningún usuario con este email. Asegúrate de que lo has escrito bien")
            }else if (error.code==="auth/invalid-email"){
                throw new Error("El email no es válido. Asegúrate de que no hay espacios en blanco")
            }
            
            else{
                throw new Error("No se ha podido iniciar sesión. Inténtalo de nuevo")
            }
        }
       
    }


            
    const logout=async()=>
    {
        try{
            const response=await signOut(auth);
  
        } catch(error){
            if (error.code==="auth/no-current-user"){
                throw new Error("No se ha iniciado sesión")
            } else{
                throw new Error("No se ha podido cerrar sesión. Inténtalo de nuevo")
            }


    }
}


  
    

    return (
        <authContext.Provider value={{user,  updateProfile, register, login, resetPassword, logout}}>
          {children}
        </authContext.Provider>
      );
    }