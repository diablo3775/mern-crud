import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Axios from "axios";
import "./App.css";

function TodoApp() {
  const [users, setUsers] = useState([]);
  const [lu, setLu] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const [editUserId, setEditUserId] = useState("");
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const getUsers = () => {
    Axios.get("http://localhost:3001/getUsers")
      .then((response) => {
        setLu(response.data);
      })
      .catch((error) => {
        console.log("Backend error:", error);
      });
  };

  const createUser = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("username", username);
    formData.append("image", selectedImage);

    Axios.post("http://localhost:3001/createUser", formData)
      .then((response) => {
        const newUser = response.data;
        setUsers([...users, newUser]);
        setName("");
        setAge("");
        setUsername("");
        setSelectedImage(null);

        getUsers();
      })
      .catch((error) => {
        console.log("Backend error:", error);
      });
  };

  const editUser = async (userId) => {
    const user = lu.find((user) => user._id === userId);
    if (user) {
      setEditUserId(userId);
      setNewName(user.name);
      setNewAge(user.age);
      setNewUsername(user.username);
      setSelectedImage(user.image);
    }
  };

  const saveEditedUser = () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("age", newAge);
    formData.append("username", newUsername);
    formData.append("image", selectedImage);

    Axios.put(`http://localhost:3001/editUser/${editUserId}`, formData)
      .then(() => {
        setEditUserId("");
        setNewName("");
        setNewAge("");
        setNewUsername("");
        setSelectedImage(null);
        getUsers();
      })
      .catch((error) => {
        console.log("Backend error:", error);
      });
  };


  const deleteUser = (userId) => {
    Axios.delete(`http://localhost:3001/deleteUser/${userId}`)
      .then(() => {
        setLu((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      })
      .catch((error) => {
        console.log("Backend error:", error);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);
  
  return (
    <div className="App row p-4 text-center d-flex justify-items-center">
      <div className="col-lg-4 mt-5 text-white">
        <h2>MERN TODO APP</h2>
        <h4 className="mt-5">ADD USERS</h4>
        <div className="inpCent">
          <input
            type="file"
            className="form-control text-center w-50 p-0 m-3"
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
          <input
            className="form-control text-center w-50 p-0"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            className="form-control text-center w-50 p-0"
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <br />
          <input
            className="form-control text-center w-50 p-0"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="btn bg-primary text-white mt-3"
            onClick={createUser}
          >
            Create User
          </button>
        </div>
      </div>

      {/* EDIT CODE */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Edit User
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="file"
                className="form-control text-center w-50 p-0 m-3"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              <input
                className="form-control text-center"
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <br />
              <input
                className="form-control text-center"
                type="number"
                placeholder="Age"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
              />
              <br />
              <input
                className="form-control text-center"
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={saveEditedUser}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-8">
        {lu.map((user) => (
          <div className="card w-100 m-2" key={user._id}>
            <div className="row">
              <div className="col-8">
                <table className="table table-success table-striped table-bordered">
                  <thead>
                    <tr>
                      <th style={{ width: "15px" }}>Profile</th>
                      <th style={{ width: "25px" }}>Name</th>
                      <th style={{ width: "25px" }}>Age</th>
                      <th style={{ width: "25px" }}>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {user.image && (
                          <img
                            // src={require(`./assets/${user.image}`)}
                            src={`./assets/${user.image}`}
                            alt="Profile"
                            style={{ width: "auto", height: "80px" }}
                          />
                        )}
                      </td>
                      <td>{user.name}</td>
                      <td>{user.age}</td>
                      <td>{user.username}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-4 d-flex align-items-center justify-content-center">
                <button
                  className="btn btn-warning m-2"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  onClick={() => editUser(user._id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger m-2"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoApp;

