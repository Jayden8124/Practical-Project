"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    await axios.get('http://localhost:5000/user')
    .then(function (response){
      setData(response.data);
      console.log(data);
    })
    .catch(error => {
      console.error(error);
      setLoading(false); // Even on error, set loading to false
    }).finally(() => {
      setLoading(false);
    });
  }

  fetchData()

  if (loading) {
    return <div>Loading... {data.lenght}</div>;
  }

  return (
    <div>
      <h1>User List {data.lenght}</h1>
      {data && data.length > 0 ? (
        <ul>
          {data.map((datas, index) => (
            <li key={index}>
              <div><strong>Name:</strong> {datas.firstName} {datas.lastName}</div>
              <div><strong>Phone:</strong> {datas.phone}</div>
              <div><strong>Email:</strong> {datas.email}</div>
              <div><strong>Birth Date:</strong> {new Date(datas.birth).toLocaleDateString()}</div>
              <div><strong>Start Date:</strong> {new Date(datas.start).toLocaleDateString()}</div>
              <div><strong>Total:</strong> {datas.total}</div>
              <div><strong>Rate:</strong> {datas.rate}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}
