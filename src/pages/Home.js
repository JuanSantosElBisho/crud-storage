import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from "../firebase";
import { Button, Card, Grid, Container, Image } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
            setUsers(list);
            setLoading(false);
        });

        return () => {
            unsub(); // Limpiar la suscripción cuando el componente se desmonte
        };
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "users", id));
            setUsers(users.filter(user => user.id !== id)); // Opcional: actualizar el estado local inmediatamente
        } catch (err) {
            console.error("Error deleting document: ", err);
        }
    };

    return (
        <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <Card.Group>
                                {users.map((user) => (
                                    <Card key={user.id}>
                                        <Card.Content>
                                            <Card.Header>{user.nombre}</Card.Header>
                                            <Image
                                                centered
                                                size='medium'
                                                src={user.img}
                                                style={{ marginTop: '1em', marginBottom: '1em' }}
                                            />
                                            <Card.Meta>{user.edad} años</Card.Meta>
                                            <Card.Description>
                                                {user.nombre} es un usuario registrado.
                                            </Card.Description>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <div className='ui two buttons'>
                                                <Button basic color='green' onClick={() => navigate(`/edit/${user.id}`)}>
                                                    Editar
                                                </Button>
                                                <Button basic color='red' onClick={() => handleDelete(user.id)}>
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </Card.Group>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default Home;
