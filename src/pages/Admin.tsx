import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import api from "../api/client";
import { getApiErrorMessage } from "../api/errorMessage";
import AdminReg from "../components/Authentication/AdminReg";
import { IUserModel } from "../interfaces/IAuthModel";
import AuthContext from "../store/auth-context";
import classes from "./Admin.module.css";

type UserFormState = {
  userName: string;
  email: string;
  role: string;
};

const getPrimaryRole = (user: IUserModel) => {
  if (user.roles?.includes("Admin")) {
    return "Admin";
  }

  if (user.roles?.includes("User")) {
    return "User";
  }

  return user.roles?.[0] ?? "User";
};

const getEmptyForm = (user: IUserModel): UserFormState => ({
  userName: user.userName,
  email: user.email,
  role: getPrimaryRole(user),
});

const AdminPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [users, setUsers] = useState<IUserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<UserFormState>({
    userName: "",
    email: "",
    role: "User",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<IUserModel[]>("/api/Admin/list-all-users");
      setUsers(response.data);
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, {
          fallback: "Could not load registered users.",
        })
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authContext.isAdmin) {
      fetchUsers();
    }
  }, [authContext.isAdmin, fetchUsers]);

  const startEdit = (user: IUserModel) => {
    setEditingId(user.id);
    setForm(getEmptyForm(user));
    setMessage("");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId("");
    setForm({
      userName: "",
      email: "",
      role: "User",
    });
  };

  const saveUser = async (id: string) => {
    setSavingId(id);
    setMessage("");
    setError("");

    try {
      const response = await api.put<IUserModel>(`/api/user/${id}`, form);
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === id ? response.data : user))
      );
      setMessage("User updated.");
      cancelEdit();
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, {
          fallback: "Could not update user.",
          statusMessages: {
            409: "This change would remove the last admin account.",
          },
        })
      );
    } finally {
      setSavingId("");
    }
  };

  const deleteUser = async (user: IUserModel) => {
    if (!window.confirm(`Delete ${user.userName}? This cannot be undone.`)) {
      return;
    }

    setSavingId(user.id);
    setMessage("");
    setError("");

    try {
      await api.delete(`/api/user/${user.id}`);
      setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== user.id));
      setMessage("User deleted.");
      if (editingId === user.id) {
        cancelEdit();
      }
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, {
          fallback: "Could not delete user.",
          statusMessages: {
            409: "You cannot delete the last admin account.",
          },
        })
      );
    } finally {
      setSavingId("");
    }
  };

  if (!authContext.isAdmin) {
    return (
      <Alert dismissible variant="danger">
        Not Found
      </Alert>
    );
  }

  const adminCount = users.filter((user) => user.roles?.includes("Admin")).length;
  const regularUserCount = users.length - adminCount;

  return (
    <main className={classes.page}>
      <AdminReg />

      <section className={classes.management}>
        <div className={classes.header}>
          <div>
            <p className={classes.eyebrow}>Admin</p>
            <h1>Registered users</h1>
          </div>
          <button type="button" className={classes.secondaryButton} onClick={fetchUsers} disabled={loading}>
            Refresh
          </button>
        </div>

        <div className={classes.stats}>
          <span>{users.length} total</span>
          <span>{adminCount} admins</span>
          <span>{regularUserCount} users</span>
        </div>

        {message && <p className={classes.message}>{message}</p>}
        {error && <p className={classes.error}>{error}</p>}

        {loading ? (
          <div className={classes.loadingState}>
            <Spinner animation="border" variant="dark" />
          </div>
        ) : (
          <div className={classes.tableWrap}>
            <table className={classes.userTable}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Id</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={classes.emptyCell}>
                      No registered users.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isEditing = editingId === user.id;
                    const role = getPrimaryRole(user);

                    return (
                      <tr key={user.id}>
                        <td>
                          {isEditing ? (
                            <input
                              value={form.userName}
                              onChange={(event) =>
                                setForm((current) => ({
                                  ...current,
                                  userName: event.target.value,
                                }))
                              }
                            />
                          ) : (
                            user.userName
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="email"
                              value={form.email}
                              onChange={(event) =>
                                setForm((current) => ({
                                  ...current,
                                  email: event.target.value,
                                }))
                              }
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <select
                              value={form.role}
                              onChange={(event) =>
                                setForm((current) => ({
                                  ...current,
                                  role: event.target.value,
                                }))
                              }
                            >
                              <option value="User">User</option>
                              <option value="Admin">Admin</option>
                            </select>
                          ) : (
                            <span className={role === "Admin" ? classes.adminRole : classes.userRole}>{role}</span>
                          )}
                        </td>
                        <td className={classes.idCell}>{user.id}</td>
                        <td>
                          <div className={classes.actions}>
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => saveUser(user.id)}
                                  disabled={savingId === user.id}
                                >
                                  Save
                                </button>
                                <button type="button" className={classes.secondaryButton} onClick={cancelEdit}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button type="button" onClick={() => startEdit(user)}>
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className={classes.dangerButton}
                                  onClick={() => deleteUser(user)}
                                  disabled={savingId === user.id}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminPage;
