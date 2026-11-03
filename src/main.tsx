import { installHumanCheck } from './utils/turnstile';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installLangHistory } from './utils/urlLang';

installLangHistory();
installHumanCheck();

createRoot(document.getElementById('root')!).render(<App />);
