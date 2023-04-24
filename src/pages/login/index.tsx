import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useCookies } from "react-cookie";
import moment from "moment";
import { history } from "umi";
// 引入样式
import styles from "./login.less";

const FormItem = Form.Item;
// 表单规则
const RULES = [
  { required: true, message: "密码不能为空" },
  {
    pattern: /^[a-zA-Z0-9.\-_]{6,8}$/g,
    message: "请输入6-8位的字母、数字或符号（.-_）",
    validateTrigger: "onSubmit"
  }
];

/**
 * 登录页面
 * @constructor
 */
export default function Login() {
  // 表单引用
  const [form] = Form.useForm();
  // 设置cookie的钩子
  const [cookie, setCookie] = useCookies();

  /**
   * 登录
   * @param values
   */
  const onLogin = (values: { username: string; password: string | number }) => {
    // 用户名密码
    const { username, password } = values;
    // 过期时间
    const expires = new Date(moment().add(3, "minutes").format());
    // 设置cookie
    setCookie("account", { username, password }, { path: "/", expires });
    // 提示并跳转路由
    message.success("登录成功", 0.8).then(() => history.replace("/custom"));
  };

  return (
    <Form
      className={styles.loginForm}
      form={form}
      name={"loginForm"}
      autoComplete={"off"}
      initialValues={{ username: "admin", password: "abc12345" }}
      onFinish={onLogin}
    >
      <FormItem
        label={"账号"}
        name={"username"}
        rules={[{ required: true, message: "用户名不能为空" }]}
      >
        <Input />
      </FormItem>
      <FormItem label={"密码"} name={"password"} rules={RULES}>
        <Input.Password autoComplete={"new-password"} />
      </FormItem>
      <Button type={"primary"} htmlType={"submit"}>
        登录
      </Button>
    </Form>
  );
}
