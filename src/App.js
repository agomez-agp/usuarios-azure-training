import React, { useState , useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {
  const baseUrl="https://localhost:44352/api";
  const [data, setData]=useState([]);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [usuarioSeleccionado, setGestorSeleccionado]=useState({
    name : "",
    lastName : "",
    email : "",
    isActive : false,
    avatar : ""
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setGestorSeleccionado({
      ...usuarioSeleccionado,
      [name]: value
    });
    console.log(usuarioSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

   const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl + "/usuarios")
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete usuarioSeleccionado.id;
    await axios.post(baseUrl + "/registro/usuario" , usuarioSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+"/actualizar/usuario/"+usuarioSeleccionado.id, usuarioSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(gestor=>{
        if(gestor.id===usuarioSeleccionado.id){
      
          gestor.name=respuesta.name;
          gestor.lastName=respuesta.lastName;
          gestor.email=respuesta.email;
        }
      });
      setData(response.data);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/eliminar/usuario/"+usuarioSeleccionado.id)
    .then(response=>{
     setData(response.data);
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarGestor=(gestor, caso)=>{
    setGestorSeleccionado(gestor);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div className="App">
      <br/><br/>
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Insertar nuevo usuario</button>
      <br/><br/>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>LastName</th>
            <th>Email</th>
            <th>IsActive</th>
            <th>RegisterDate</th>
            <th>Avatar</th>
          </tr>
        </thead>
        <tbody>
        {data.map(gestor=>(
          <tr key={gestor.id}>
            <td>{gestor.id}</td>
            <td>{gestor.name}</td>
            <td>{gestor.lastName}</td>
            <td>{gestor.email}</td>
            <td>{gestor.isActive}</td>
            <td>{gestor.registerDate}</td>
            <td>{gestor.avatar}</td>
            <td>
              <button className="btn btn-primary" onClick={()=>seleccionarGestor(gestor, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>seleccionarGestor(gestor, "Eliminar")}>Eliminar</button>
            </td>
            </tr>
        ))}
        </tbody>

      </table>

      <Modal isOpen={modalInsertar}>
      <ModalHeader>Nuevo usuario</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Name: </label>
          <br />
          <input type="text" className="form-control" name="name"  onChange={handleChange}/>
          <br />
          <label>LastName: </label>
          <br />
          <input type="text" className="form-control" name="lastName" onChange={handleChange}/>
          <br />
          <label>Email: </label>
          <br />
          <input type="text" className="form-control" name="email" onChange={handleChange}/>
          <br />
          <label>Avatar: </label>
          <br />
          <input type="text" className="form-control" name="avatar" onChange={handleChange}/>
          <br/>
          
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar usuario</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>Id: </label>
          <br />
          <input type="text" className="form-control" readOnly value={usuarioSeleccionado && usuarioSeleccionado.id}/>
          <br />
          <label>Name: </label>
          <br />
          <input type="text" className="form-control" name="name" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.name}/>
          <br />
          <label>LastName: </label>
          <br />
          <input type="text" className="form-control" name="lastName" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.lastName}/>
          <br />
          <label>Email: </label>
          <br />
          <input type="text" className="form-control" name="email" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.email}/>

          <label>Avatar</label>
          <input type="text" className="form-control" name="avatar" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.avatar}/>
          <br/>
          <input type="hidden" className="form-control" name="isActive" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.isActive}/>
          <input type="hidden" className="form-control" name="RegisterDate" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.registerDate}/>
          
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>


    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el usuario {usuarioSeleccionado && usuarioSeleccionado.name}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
