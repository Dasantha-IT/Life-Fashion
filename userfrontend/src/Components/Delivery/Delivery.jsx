import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Delivery(props) {
  const {
    _id,
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zipcode,
    country,
    phone,
  } = props.delivery;

  const history = useNavigate();

  const deleteHandler = async () => {
    await axios
      .delete(`http://localhost:5000/deliverys/${_id}`)
      .then((res) => res.data)
      .then(() => history("/"))
      .then(() => history("/mainhome"));
  };

  return (
    <div>
      <h1>Delivery ID : {_id}</h1>
      <h1>First Name : {firstName}</h1>
      <h1>Last Name : {lastName}</h1>
      <h1>Email : {email}</h1>
      <h1>Street : {street}</h1>
      <h1>City : {city}</h1>
      <h1>State : {state}</h1>
      <h1>Zipcode : {zipcode}</h1>
      <h1>Country : {country}</h1>
      <h1>Phone : {phone}</h1>

      <br></br>

      <Link to={`/deliverydetails/${_id}`}>Update</Link>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
}

export default Delivery;
