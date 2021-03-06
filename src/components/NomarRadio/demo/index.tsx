/**
 * title: 基础 单选框
 * desc: 表单使用 demo
 */
import React, { FC } from 'react';
import { Button, WhiteSpace } from 'antd-mobile';
import DynamicForm, { IFormItemProps, useForm, Store, ValidateErrorEntity } from '@alitajs/dform';

const radioList = [
  {
    label: '是',
    value: 'yes',
  },
  {
    label: '否',
    value: 'no',
  },
];

const dayList = [
  {
    label: '晴',
    value: '晴',
  },
  {
    label: '阴',
    value: '阴',
  },
  {
    label: '雨',
    value: '雨',
  },
];

const foodList = [
  {
    label: '宫保鸡丁',
    value: '宫保鸡丁',
  },
  {
    label: '可乐鸡翅',
    value: '可乐鸡翅',
  },
  {
    label: '爆炒虾仁',
    value: '爆炒虾仁',
  },
  {
    label: '清蒸小黄鱼',
    value: '清蒸小黄鱼',
  },
  {
    label: '红烧肉',
    value: '红烧肉',
  },
];

interface PageProps {}

const Page: FC<PageProps> = () => {
  const [form] = useForm();
  const onFinish = (values: Store) => {
    // eslint-disable-next-line no-console
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };
  const formsData = [
    {
      type: 'radio',
      fieldProps: 'userRadio1',
      required: true,
      data: radioList,
      title: '发票',
    },
    {
      type: 'radio',
      fieldProps: 'userRadio2',
      required: true,
      data: dayList,
      positionType: 'vertical',
      title: '天气情况',
    },
    {
      type: 'radio',
      fieldProps: 'userRadio3',
      required: true,
      data: radioList,
      title: '发票(只读)',
      disabled: true,
    },
    {
      type: 'radio',
      fieldProps: 'userRadio4',
      required: true,
      data: foodList,
      title: '喜欢的食物',
      radioType: 'vertical',
    },
  ] as IFormItemProps[];
  const formsValues = {
    userRadio1: 'yes',
    userRadio2: '晴',
    userRadio3: 'no',
  };
  const formProps = {
    data: formsData,
    formsValues,
    form,
    onFinishFailed,
    onFinish,
    isDev: true,
  };
  return (
    <>
      <DynamicForm {...formProps} />
      <WhiteSpace size="sm" />
      <Button type="primary" onClick={() => form.submit()}>
        Submit
      </Button>
    </>
  );
};

export default Page;
