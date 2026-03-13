import { PropsWithChildren, useEffect } from 'react';
import VConsole from 'vconsole';
import '@/network'; // 导入网络请求库
import '@/app.css';
import { Preset } from './presets';

const App = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    // 初始化 vconsole 调试工具
    // 可选：只在开发环境或特定条件下启用
    const enableVConsole = localStorage.getItem('enable-vconsole') === 'true';

    if (enableVConsole) {
      const vconsole = new VConsole({
        defaultPlugins: ['system', 'network', 'element', 'storage'],
      });

      return () => {
        vconsole.destroy();
      };
    }
  }, []);

  return <Preset>{children}</Preset>;
};

export default App;
