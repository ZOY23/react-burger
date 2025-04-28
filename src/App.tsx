import React, { useEffect } from 'react';
import { AppHeader } from './components/app-header/';
import { BurgerIngredients } from './components/burger-ingredients/';
import { BurgerConstructor } from './components/burger-constructor/';
import styles from './App.module.css';
import { useAppDispatch } from './services/store/hooks';
import { getIngredients } from './services/ingredients/actions';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  return (
    <div className="App">
      <AppHeader />
      <main className={styles.main}>
        <div className={styles.container}>
          <BurgerIngredients />
          <BurgerConstructor />
        </div>
      </main>
    </div>
  );
}

export default App;