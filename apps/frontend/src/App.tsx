import { Theme } from '@radix-ui/themes';
import { AppRouter } from './router/AppRouter';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Theme
        accentColor="gray"
        grayColor="slate"
        className="h-full"
        hasBackground={false}>
        <AppRouter />
      </Theme>
    </BrowserRouter>
  );
}

export default App;
