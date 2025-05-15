import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

function UpdateDelivery() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/deliverys/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.delivery));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/deliverys/${id}`, {
        firstName: String(inputs.firstName),
        lastName: String(inputs.lastName),
        email: String(inputs.email),
        street: String(inputs.street),
        city: String(inputs.city),
        state: String(inputs.state),
        zipcode: Number(inputs.zipcode),
        country: String(inputs.country),
        phone: Number(inputs.phone),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/deliverydetails"));
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "inline-block",
            textAlign: "left",
            padding: "20px",
            border: "1px solid black",
            borderRadius: "8px",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={inputs.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={inputs.lastName}
              onChange={handleChange}
              placeholder="Enter Last Name"
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Email Address:</label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              placeholder="Enter Email"
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Street:</label>
            <input
              type="text"
              name="street"
              value={inputs.street}
              onChange={handleChange}
              placeholder="Enter Street"
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={inputs.city}
              onChange={handleChange}
              placeholder="Enter City"
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={inputs.state}
              onChange={handleChange}
              placeholder="Enter State"
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Zip Code:</label>
            <input
              type="number"
              name="zipcode"
              value={inputs.zipcode}
              onChange={handleChange}
              placeholder="Enter Zip Code"
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={inputs.country}
              onChange={handleChange}
              placeholder="Enter Country"
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Phone:</label>
            <input
              type="number"
              name="phone"
              value={inputs.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              style={{ marginLeft: "10px" }}
            />
          </div>

          <button
            style={{
              marginTop: "10px",
              padding: "5px 15px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateDelivery;
