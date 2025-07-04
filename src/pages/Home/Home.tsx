import React from 'react'
import styles from './Home.module.css'
import { BurgerIngredients } from '../../components/burger-ingredients/BurgerIngredients'
import { BurgerConstructor } from '../../components/burger-constructor/BurgerConstructor'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useAppSelector } from '../../services/store/hooks'

const Home: React.FC = () => {
  const { loading } = useAppSelector(state => state.ingredients)

  if (loading) {
    return (
      <div className={styles.container} data-testid="loading-indicator">
        <p className="text text_type_main-medium">Загрузка ингредиентов...</p>
      </div>
    )
  }

  return (
    <div className={styles.container} data-testid="home-page">
      <main className={styles.main}>
        <DndProvider backend={HTML5Backend}>
          <BurgerIngredients />
          <BurgerConstructor />
        </DndProvider>
      </main>
    </div>
  )
}

export default Home