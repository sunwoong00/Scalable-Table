import React from 'react';
import Table from './components/Table';

const App = () => {
  console.log('App component rendered');
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Scalable Table</h1>
      <Table rows={1000000} columns={3} rowHeight={30} height={600} />
    </div>
  );
};


export default App;
