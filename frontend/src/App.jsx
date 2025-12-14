
import Content from './components/content';
import { AdatokProvider } from './components/adatok';
import Hatter from './components/Hatter';

function App() {
  

  return (
    <>
    <div style={{background: '#030F0F', height: '100%',width:"100vw",paddingBottom:"3vh",position:"relative", overflow: 'visible'}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0}}>
        <Hatter />
      </div>
      <AdatokProvider>
        <Content/>
      </AdatokProvider>

    </div>
      
    </>
  )
}

export default App
