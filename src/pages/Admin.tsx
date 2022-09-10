import React, { useEffect, useState, useRef, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import AuthContext from "../store/auth-context";
import { IRoleModel, IUserModel, IUserProps } from "../interfaces/IAuthModel";
import { Table, Button } from "react-bootstrap";
import classes from "./Admin.module.css";
import { validEmail, validPassword } from "../components/Authentication/Regex";

const AdminPage: React.FC = () => {
  const [roles, setRoles] = useState<IRoleModel[]>([]);
  const [role, setRole] = useState<IRoleModel>({
    id: "",
    name: "",
  });
  const [users, setUsers] = useState<IUserModel[]>([]);
  const [admins, setAdmins] = useState<IUserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

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
    return () => {};
  }, [authContext.isAdmin, token]);

  const removeHandler = (id: string) => {
    axios
      .delete(`https://poodlesvonapalusso.dog/api/user/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      await axios
        .get<IUserModel[]>(
          "https://poodlesvonapalusso.dog/api/Admin/list-admins",
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
          setUsers(loadedData);
        });
      setLoading(false);
      return () => {};
    };
    fetchUsers();
  }, [authContext.isAdmin, token]);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      await axios
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
          setAdmins(loadedData);
        });
      setLoading(false);
      return () => {};
    };
    fetchUsers();
  }, [authContext.isAdmin, token]);

  const UsersList: React.FC<IUserProps> = (props) => {
    return (
      <>
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
            {props.users.map((user) => (
              <tr key={user.userName}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.id}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => props.onRemove(user.id)}
                  >
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
            {props.admins.map((admin) => (
              <tr key={admin.userName}>
                <td>{admin.userName}</td>
                <td>{admin.email}</td>
                <td>{admin.id}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => props.onRemove(admin.id)}
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

  const AdminReg: React.FC = () => {
    const submitHandler = async (event: React.FormEvent) => {
      event.preventDefault();
      const enteredUsername = usernameInputRef.current!.value;
      const enteredPassword = passwordInputRef.current!.value;
      const enteredEmail = emailInputRef.current!.value;
      if (
        !validEmail.test(enteredEmail) ||
        !validPassword.test(enteredPassword)
      ) {
        alert(
          "entered values must be valid, password must contain at least 1 number, 1 uppercase and one special character"
        );
        setLoading(false);
        return;
      }
      const config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      };

      await axios
        .post<AxiosResponse>(
          "https://poodlesvonapalusso.dog/api/Admin/register-admin",
          {
            username: enteredUsername,
            password: enteredPassword,
            email: enteredEmail,
          },
          config
        )
        .then(() => {
          alert("admin registration successful");
          setLoading(false);
        })
        .catch((error: string) => {
          setLoading(false);
          alert(error);
        });
    };
    return (
      <section>
        <h1>Register admin account</h1>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor="email">E-mail address</label>
            <input type="email" id="email" required ref={emailInputRef} />
          </div>

          <div className={classes.control}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" required ref={usernameInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              ref={passwordInputRef}
            />
          </div>
          <br></br>
          <div className="col-md-12 text-center">
            <Button
              type="submit"
              variant="dark"
              style={{
                color: "#ffe2ed",
                fontSize: "1.6rem",
              }}
            >
              Create account
            </Button>
            {loading && <div>Loading...</div>}
            <br />
          </div>
        </form>
      </section>
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
      <AdminReg />
      <br></br>
      <UsersList users={users} onRemove={removeHandler} admins={admins} />
    </>
  );
};

export default AdminPage;
