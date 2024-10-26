import Navigation from './react_native/navigation';
import React from 'react';
import './global.css';
import { verifyInstallation } from 'nativewind';

export default function App() : React.JSX.Element {
  verifyInstallation();
  return <Navigation />;
}
