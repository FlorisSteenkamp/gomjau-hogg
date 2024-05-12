import React from 'react';
import { createRoot } from 'react-dom/client.js';
import { Root } from './components/root.js';


const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<Root />);
