import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/auth-context";
import { IRoleModel } from "../interfaces/IAuthModel";

const AdminPage: React.FC = () => {
  const [roles, setRoles] = useState<IRoleModel[]>([]);
  const [role, setRole] = useState<IRoleModel>({
    id: "",
    name: "",
  });
  const authContext = useContext(AuthContext);
  const token = authContext.token;

  const roleInputRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    axios
      .get<IRoleModel[]>(
        "http://bakisan-001-site1.ctempurl.com/api/Admin/allroles",
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        const loadedData: IRoleModel[] = [];
        // console.log(roles);

        for (let i = 0; i < response.data.length; i++) {
          loadedData.push({
            id: response.data[i].id,
            name: response.data[i].name,
          });
        }
        setRoles(loadedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [authContext.isAdmin, token]);

  const RolesList = () => {
    return (
      <div>
        <label htmlFor="roleName">Select role to update account</label>
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
  return (
    <>
      <RolesList />
    </>
  );
};

export default AdminPage;
