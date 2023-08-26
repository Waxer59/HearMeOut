import { Theme } from '@radix-ui/themes';
import { AppRouter } from './router/AppRouter';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Theme appearance="dark" accentColor="iris" panelBackground="translucent">
        <AppRouter />
      </Theme>
    </BrowserRouter>
  );
}

export default App;
