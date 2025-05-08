import React from 'react';
import { AppHeader } from './components/app-header/';
import { BurgerIngredients } from './components/burger-ingredients/';
import { BurgerConstructor } from './components/burger-constructor/';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './App.module.css';

function App() {
  return (
    <div className="App">
      <AppHeader />
      <main className={styles.main}>
        <DndProvider backend={HTML5Backend}>
          <div className={styles.container}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </DndProvider>
      </main>
    </div>
  );
}

export default App;