import React from 'react';
import { FaNewspaper, FaComments, FaMapMarkedAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DashboardOverview = ({ user, posts, comments, destinations }) => {
  const data = [
    { name: 'Posts', count: posts.length },
    { name: 'Comments', count: comments.length },
    { name: 'Destinations', count: destinations.length },
  ];

  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      <div className="overview-stats">
        <div className="stat-card">
          <FaNewspaper />
          <h3>Posts</h3>
          <p>{posts.length}</p>
        </div>
        <div className="stat-card">
          <FaComments />
          <h3>Comments</h3>
          <p>{comments.length}</p>
        </div>
        <div className="stat-card">
          <FaMapMarkedAlt />
          <h3>Saved Destinations</h3>
          <p>{destinations.length}</p>
        </div>
      </div>
      <div className="overview-chart">
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default DashboardOverview;
