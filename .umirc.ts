import {defineConfig} from 'umi';
import {config} from './config/config';
import routes from './routes';

export default defineConfig({
  // layout: config.layout,
  nodeModulesTransform: {
    type: 'none',
  },
  hash: true,
  history: {type: 'hash'},
  routes,
  fastRefresh: {},
  devServer: {
    port: 8000
  },
});
