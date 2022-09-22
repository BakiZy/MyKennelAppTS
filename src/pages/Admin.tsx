import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/auth-context";
import { IUserModel } from "../interfaces/IAuthModel";
import { Alert, Table, Button, Spinner } from "react-bootstrap";
import AdminReg from "../components/Authentication/AdminReg";

//import { validEmail, validPassword } from "../components/Authentication/Regex";

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<IUserModel[]>([]);
  const [admins, setAdmins] = useState<IUserModel[]>([]);
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const token = authContext.token;

  const removeHandler = (id: string) => {
    setLoading(true);
    axios
      .delete(`https://poodlesvonapalusso.dog/api/user/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
        setAdmins(admins.filter((admin) => admin.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const loadedData: IUserModel[] = [];
      await axios
        .get<IUserModel[]>(
          "https://poodlesvonapalusso.dog/api/Admin/list-users",
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            loadedData.push({
              userName: response.data[i].userName,
              email: response.data[i].email,
              id: response.data[i].id,
            });
          }
          setUsers(loadedData);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    fetchUsers();
  }, [token]);

  useEffect(() => {
    setLoading(true);
    const loadedData: IUserModel[] = [];
    const fetchAdmins = () => {
      axios
        .get<IUserModel[]>(
          "https://poodlesvonapalusso.dog/api/Admin/list-admins",
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            loadedData.push({
              userName: response.data[i].userName,
              email: response.data[i].email,
              id: response.data[i].id,
            });
          }
          setAdmins(loadedData);
        });
      setLoading(false);
    };
    fetchAdmins();
  }, [token]);

  if (!authContext.isAdmin) {
    return (
      <Alert dismissible variant="danger">
        Not Found
      </Alert>
    );
  }

  if (loading) {
    return (
      <Spinner animation="border" variant="info">
        Load
      </Spinner>
    );
  }

  return (
    <>
      <AdminReg />
      <br></br>
      <h1>List of users</h1>
      <Table variant="dark">
        <thead>
          <tr>
            <th>Username </th>
            <th>email</th>
            <th>id</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userName}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.id}</td>
              <td>
                <Button variant="danger" onClick={() => removeHandler(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h1>List of admins</h1>
      <Table variant="dark">
        <thead>
          <tr>
            <th>Username </th>
            <th>email</th>
            <th>id</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.userName}>
              <td>{admin.userName}</td>
              <td>{admin.email}</td>
              <td>{admin.id}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => removeHandler(admin.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default AdminPage;
