import '@/network'; // 导入网络请求库
import { PropsWithChildren } from 'react';
import '@/app.css';
import { Preset } from './presets';

const App = ({ children }: PropsWithChildren) => {
  return <Preset>{children}</Preset>;
};

export default App;
