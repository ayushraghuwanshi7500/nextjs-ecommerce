import React, { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import baseUrl from '../helpers/baseUrl';
const UserRoles = () => {
  const [users, setUsers] = useState([]);
  const cookie = parseCookies();
  const token = cookie.token;
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      headers: {
        Authorization: token
      }
    });
    const res2 = await res.json();
    setUsers(res2);
    console.log(res2);
  };
  const handleRoleChange = async (uid, role) => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ uid: uid, role: role })
    });
    const res2 = await res.json();
    console.log(res2);
    setUsers(res2);
  };
  return (
    <div>
      <h4> User Roles </h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td onClick={() => handleRoleChange(user._id, user.role)}>
                {user.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoles;
