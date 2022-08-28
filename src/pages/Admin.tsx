import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/auth-context";
import { IRoleModel, IUserModel, IUserProps } from "../interfaces/IAuthModel";
import { Table } from "react-bootstrap";
import classes from "./Admin.module.css";

const AdminPage: React.FC = () => {
  const [roles, setRoles] = useState<IRoleModel[]>([]);
  const [role, setRole] = useState<IRoleModel>({
    id: "",
    name: "",
  });
  const [users, setUsers] = useState<IUserModel[]>([]);
  const [loading, setLoading] = useState(false);
  // const usernameInputRef = useRef<HTMLInputElement>(null);
  // const passwordInputRef = useRef<HTMLInputElement>(null);
  // const emailInputRef = useRef<HTMLInputElement>(null);

  const authContext = useContext(AuthContext);
  const token = authContext.token;

  const roleInputRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get<IRoleModel[]>("https://poodlesvonapalusso.dog/api/Admin/allroles", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        const loadedData: IRoleModel[] = [];

        for (let i = 0; i < response.data.length; i++) {
          loadedData.push({
            id: response.data[i].id,
            name: response.data[i].name,
          });
        }
        setRoles(loadedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [authContext.isAdmin, token]);

  useEffect(() => {
    setLoading(true);
    axios
      .get<IUserModel[]>(
        "https://poodlesvonapalusso.dog/api/Admin/list-users",
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        const loadedData: IUserModel[] = [];
        for (let i = 0; i < response.data.length; i++) {
          loadedData.push({
            userName: response.data[i].userName,
            email: response.data[i].email,
            id: response.data[i].id,
          });
        }
        console.log(loadedData);
        setUsers(loadedData);
        setLoading(false);
      });
  }, [authContext.isAdmin, token]);

  const UsersList: React.FC<IUserProps> = (props) => {
    return (
      <Table variant="dark">
        <thead>
          <tr>
            <th>Username </th>
            <th>email</th>
            <th>id</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((user) => (
            <tr key={user.userName}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const RolesList = () => {
    return (
      <div className={classes.adminPage}>
        <label htmlFor="roleName">Available roles</label>
        <select
          id="roleName"
          name="roleName"
          ref={roleInputRef}
          value={role.id}
          onChange={(e) =>
            setRole({ id: e.target.value, name: e.target.value })
          }
        >
          {roles.map((role) => (
            <option id={role.id} key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
    );
  };
  if (!authContext.isAdmin) {
    return <div>You are not admin</div>;
  }

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <>
      <RolesList />
      <UsersList users={users} />
    </>
  );
};

export default AdminPage;
