import { useState, useEffect } from "react";
import Canvas from "./canvas";

function App() {
  const [data, setData] = useState({ members: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("/members");
      const body = await result.json();
      setData(body);
    };
    fetchData();
  }, []);

  // if (data.members.length === 0) {
  //   return <p>Loading...</p>;
  // }

  return (
    <div className="bg-gradient-to-b from-sky-700 to-sky-900 w-full h-screen">
      {/* {data.members.map((member: any) => (
        <div key={member}>
          <h1 className="text-sm text-blue-500">{member}</h1>
        </div>
      ))} */}
      <Canvas />
    </div>
  );
}

export default App;
