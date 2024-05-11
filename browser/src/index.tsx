import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from './components/root';


const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<Root />);
