import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { People } from './components/People/People';

export const App: React.FC = () => {
  //const { name, born, died } = peopleFromServer[0];

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <People people={peopleFromServer} />
      </main>
    </div>
  );
};
