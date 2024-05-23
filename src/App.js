import './App.css';
import Home from './pages/Home'; // Asegúrate de que este componente exista
import AddEditUser from './pages/AddEditUser';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEditUser />} />
          <Route path="/edit/:id" element={<AddEditUser />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
