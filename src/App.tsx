import React from 'react';
import './App.css';

//import canvas component
import CanvasDraw from './component/canvas';

const App: React.FC = () => {
  return (
    <div className="App">
      <CanvasDraw />
    </div>
  );
};

export default App;
