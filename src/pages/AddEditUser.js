import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Loader, GridRow } from 'semantic-ui-react';
import { storage, db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'; // Importa las funciones necesarias desde firestore

const initialState = {
    nombre: "",
    edad: "",
};

const AddEditUser = () => {
    const [data, setData] = useState(initialState);
    const { nombre, edad } = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams(); // Obtén el ID del usuario desde los parámetros de la URL

    // Cargar datos del usuario si hay un ID presente
    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                const docRef = doc(db, "users", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(docSnap.data());
                }
            };
            fetchUser();
        }
    }, [id]);

    useEffect(() => {
        const uploadFile = () => {
            const nombreArchivo = new Date().getTime() + file.name;
            const storageRef = ref(storage, nombreArchivo);
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Carga en pausa");
                        break;
                    case "running":
                        console.log("Cargando");
                        break;
                    default:
                        break;
                }
            }, (error) => {
                console.log(error);
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setData((prev) => ({...prev, img: downloadURL}));
                });
            });
        };
        if (file) uploadFile();
    }, [file]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let errors = {};
        if (!nombre) {
            errors.nombre = "El nombre es obligatorio";
        }
        if (!edad) {
            errors.edad = "La edad es obligatoria";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = validate();
        if (Object.keys(errors).length) return setErrors(errors);
        setIsSubmit(true);
        try {
            if (id) {
                // Actualizar usuario existente
                const userRef = doc(db, "users", id);
                await updateDoc(userRef, {
                    ...data,
                    timestamp: serverTimestamp()
                });
            } else {
                // Añadir nuevo usuario
                await addDoc(collection(db, "users"), {
                    ...data,
                    timestamp: serverTimestamp()
                });
            }
            navigate("/");
        } catch (error) {
            console.error("Error al guardar el documento: ", error);
        }
    };

    return (
        <div>
            <Grid centered verticalAlign="middle" columns="3" style={{ height: '80vh' }}>
                <GridRow>
                    <Grid.Column textAlign="center">
                        <div>
                            {isSubmit ? (
                                <Loader active inline="centered" size="huge" />
                            ) : (
                                <>
                                    <h2>{id ? "Editar Usuario" : "Añadir Usuario"}</h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Input
                                            label="Nombre"
                                            error={errors.nombre ? { content: errors.nombre } : null}
                                            placeholder="Introducir Nombre"
                                            name="nombre"
                                            onChange={handleChange}
                                            value={nombre}
                                        />
                                        <Form.Input
                                            label="Edad"
                                            error={errors.edad ? { content: errors.edad } : null}
                                            placeholder="Introducir Edad"
                                            name="edad"
                                            onChange={handleChange}
                                            value={edad}
                                        />
                                        <Form.Input
                                            type="file"
                                            label="Imagen"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        <Button primary type="submit" disabled={progress !== null && progress < 100}>
                                            {id ? "Actualizar" : "Añadir"}
                                        </Button>
                                    </Form>
                                </>
                            )}
                        </div>
                    </Grid.Column>
                </GridRow>
            </Grid>
        </div>
    );
};

export default AddEditUser;
