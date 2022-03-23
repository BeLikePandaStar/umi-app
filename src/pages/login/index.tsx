import React from 'react';
import { Button, Form, Input, message } from 'antd';
import './login.css';
import { useCookies } from 'react-cookie';
import moment from 'moment';
import { history } from 'umi';

const FormItem = Form.Item;
const rules = [
  { required: true, message: '密码不能为空' },
  {
    pattern: /^[a-zA-Z0-9.\-_]{6,8}$/g,
    message: '请输入6-8位的字母、数字或符号（.-_）',
    validateTrigger: 'onSubmit',
  },
];

// 登录
export default function Login() {
  const [form] = Form.useForm();
  const [cookie, setCookie] = useCookies();

  const onLogin = (values: { username: string; password: string | number }) => {
    const { username, password } = values;
    const expires = new Date(moment().add(3, 'minutes').format());
    console.log('expires:', expires);
    setCookie('account', { username, password }, { path: '/', expires });
    message.success('登录成功', 0.8).then(() => history.replace('/'));
  };

  return (
    <Form
      className={'loginForm'}
      form={form}
      name={'loginForm'}
      onFinish={onLogin}
    >
      <FormItem
        label={'账号'}
        name={'username'}
        rules={[{ required: true, message: '账号不能为空' }]}
      >
        <Input />
      </FormItem>
      <FormItem label={'密码'} name={'password'} rules={rules}>
        <Input.Password />
      </FormItem>
      <Button type={'primary'} htmlType={'submit'}>
        登录
      </Button>
    </Form>
  );
}
