import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installLangHistory } from './utils/urlLang';

installLangHistory();

createRoot(document.getElementById('root')!).render(<App />);
