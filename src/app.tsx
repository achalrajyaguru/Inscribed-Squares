import { Tabs } from './components/Tabs';
import { LinkedInBar } from './components/LinkedInBar';
import './styles.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Inscribed Squares</h1>
        <p>Draw a closed loop and discover inscribed squares</p>
      </header>
      <main className="app-main">
        <Tabs />
      </main>
      <LinkedInBar />
    </div>
  );
}

export default App;
