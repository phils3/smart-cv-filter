
import Content from './components/content';
import { AdatokProvider } from './components/adatok';
import Hatter from './components/Hatter';
import { useAdatok } from './components/adatok';
import How_it_work from './components/How_it_works';
function App() {
  return (
    <AdatokProvider>
      <MainContent />
    </AdatokProvider>
  )
}

// külön komponens a MainContent
function MainContent() {
  const { how_it_works_visible, appHeight } = useAdatok();

  return (
    <div style={{background: '#030F0F', height: appHeight, minHeight: '100vh', width:"100vw", paddingBottom:"3vh", position:"relative", overflow: 'visible'}}>
      
        <div>
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0}}>
             <Hatter />
          </div>
           {how_it_works_visible ? <How_it_work />: <Content/> }
        </div>
      
    </div>
  )
}


export default App
