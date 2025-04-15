import React from 'react';
import { AppHeader } from './components/app-header';
import { BurgerIngredients } from './components/burger-ingredients';
import { BurgerConstructor } from './components/burger-constructor';
import { ingredientsData } from './utils/data';

function App() {
  return (
    <div className="App">
      <AppHeader />
      <main style={{ marginTop: '88px' }}>
        <div className="container">
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '40px',
            maxWidth: '1240px',
            margin: '0 auto'
          }}>
            <BurgerIngredients ingredients={ingredientsData} />
            <BurgerConstructor ingredients={ingredientsData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;