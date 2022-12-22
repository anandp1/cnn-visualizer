import { useState, useEffect } from "react";

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

  if (data.members.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {data.members.map((member: any) => (
        <div key={member}>
          <h1 className="text-sm text-blue-500">{member}</h1>
        </div>
      ))}
    </div>
  );
}

export default App;
