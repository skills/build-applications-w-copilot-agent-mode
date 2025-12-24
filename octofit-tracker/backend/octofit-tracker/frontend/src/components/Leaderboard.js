import React, { useEffect, useState } from 'react';

function Leaderboard() {
  const [data, setData] = useState([]);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(json => {
        console.log('Leaderboard API endpoint:', endpoint);
        console.log('Fetched data:', json);
        setData(json.results || json);
      });
  }, [endpoint]);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4">Leaderboard</h2>
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th scope="col">User</th>
              <th scope="col">Points</th>
              <th scope="col">Rank</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>{item.user}</td>
                <td>{item.points}</td>
                <td>{item.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
