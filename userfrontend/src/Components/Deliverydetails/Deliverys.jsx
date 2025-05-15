import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import Delivery from "../Delivery/Delivery";

const URL = "http://localhost:5000/deliverys";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Deliverys() {
  const [deliverys, setDeliverys] = useState();
  useEffect(() => {
    fetchHandler().then((data) => setDeliverys(data.deliverys));
  }, []);

  return (
    <div>
      <Nav />
      <div>
        {deliverys &&
          deliverys.map((delivery, i) => (
            <div key={i}>
              <Delivery delivery={delivery} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Deliverys;
