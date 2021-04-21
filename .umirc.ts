import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  hash: true,
  history: { type: 'hash' },
  routes,
  fastRefresh: {},
  devServer: {
    port: 8000,
  },
  dva: {},
  antd: {},
});
