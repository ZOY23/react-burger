import React, { useEffect } from 'react';
import { AppHeader } from './components/app-header/';
import { BurgerIngredients } from './components/burger-ingredients/';
import { BurgerConstructor } from './components/burger-constructor/';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppDispatch, useAppSelector } from './services/store/store';
import { fetchIngredients } from './services/actions/ingredientsActions';
import styles from './App.module.css';

function App() {
  const dispatch = useAppDispatch();
  const { items: ingredients, loading, error } = useAppSelector(state => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

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