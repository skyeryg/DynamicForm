/* eslint-disable no-param-reassign */
import React, { FC, useEffect } from 'react';
import { List, Card, WhiteSpace } from 'antd-mobile';
import { InputItemPropsType } from 'antd-mobile/es/input-item/PropsType';
import { DatePickerPropsType } from 'antd-mobile/es/date-picker/PropsType';
import { CardHeaderPropsType } from 'antd-mobile/es/card/PropsType';
import Form from 'rc-field-form';
import { Store, FormInstance, ValidateErrorEntity, Rule } from 'rc-field-form/es/interface';
import { getByteLen } from './utils';

import {
  NomarInput,
  NomarPicker,
  NomarSwitch,
  NomarTextArea,
  NomarDatePicker,
  ExtraInput,
  RangeDatePicker,
  NomarRadio,
  NomarCheckBox,
  CoverRadio,
  NomarImagePicker,
  NomarCustom,
  MultiplePicker,
  AddressPicker,
} from './components';
import errorMessages from './utils/message';

import NewFieldPicker from './components/NewFieldPicker/NewFieldPicker';

const FormItemType = {
  input: NomarInput,
  select: NomarPicker,
  area: NomarTextArea,
  date: NomarDatePicker,
  switch: NomarSwitch,
  radio: NomarRadio,
  extraInput: ExtraInput,
  rangeDatePicker: RangeDatePicker,
  checkbox: NomarCheckBox,
  coverRadio: CoverRadio,
  image: NomarImagePicker,
  custom: NomarCustom,
  multiplePicker: MultiplePicker,
  addressPicker: AddressPicker,
};

export interface IFormItemProps {
  type:
    | 'input'
    | 'select'
    | 'area'
    | 'date'
    | 'switch'
    | 'extraInput'
    | 'radio'
    | 'rangeDatePicker'
    | 'coverRadio'
    | 'image'
    | 'custom'
    | 'multiplePicker'
    | 'addressPicker'
    | 'checkbox';
  title: string;
  fieldProps: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  data?: any[];
  inputType?: InputItemPropsType['type'];
  modeType?: DatePickerPropsType['mode'];
  fieldProps2?: string;
  placeholder2?: string;
  rules?: Rule[];
  extraType?: 'input' | 'select';
  editable?: boolean;
  rows?: number;
  labelNumber?: number;
  positionType?: 'vertical' | 'horizontal';
  hasStar?: boolean;
  firstProps?: any;
  secondProps?: any;
  radioType?: 'vertical' | 'horizontal';
  selectable?: boolean;
  limitSize?: number;
  CustomDom?: any;
  customDomProps?: any;
  subTitle?: string | React.ReactNode;
  maxValueLength?: number;
  onBlur?: (value?: string) => void;
  level?: number;
  onChangeLevel?: (val: any) => void;
  placeholderList?: string[];
  chunk?: number;
  leftContent?: string | React.ReactNode;
  rightContent?: string | React.ReactNode;
  onClick?: any;
}

interface CardDForm extends CardHeaderPropsType {
  data: IFormItemProps[];
  type?: 'list' | 'card' | 'fullcard';
}

export type DFormData = IFormItemProps[][] | IFormItemProps[] | CardDForm | CardDForm[];
type DFormType = 'NORMAL' | 'NORMALLIST' | 'CARD' | 'CARDLIST';

// 'NORMAL':[{type,title,fieldProps}]
// 'NORMALLIST':[[{type,title,fieldProps}],[{type,title,fieldProps}]]
// 'CARD':{title,data:[]}
// 'CARDLIST':[{title,data:[]}]

export interface IDynamicFormProps {
  data: DFormData; // 动态表单数据
  form: FormInstance; // 表单对象
  formsValues?: Store;
  allDisabled?: boolean; // 全部不可交互，展示状态
  onFinish?: (values: Store) => void;
  onFinishFailed?: (errorInfo: ValidateErrorEntity) => void;
  isDev?: boolean; // 手动声明是开发模式
  onValuesChange?: (values: any) => void; // 字段改变时抛出事件
  autoLineFeed?: boolean; // 当 title 过长自动增加 positionType 为 vertical
}

const nodeEnvIsDev = process.env.NODE_ENV === 'development';

export const getFormItem = (formItem: IFormItemProps, allDisabled: boolean) => {
  const { type, disabled = allDisabled, ...otherProps } = formItem;
  const FormItemComponent = FormItemType[formItem.type];
  return <FormItemComponent {...otherProps} key={formItem.fieldProps} disabled={disabled} />;
};

export const defaultFailed = (
  errorInfo: ValidateErrorEntity,
  onFinishFailed?: (errorInfo: ValidateErrorEntity) => void,
) => {
  if (!errorInfo || !errorInfo.errorFields || errorInfo.errorFields.length === 0) {
    if (onFinishFailed) onFinishFailed(errorInfo);
    return;
  }
  const scrollToField = (fieldKey: any) => {
    const labelNode = document.getElementById(`aliat-dform-${fieldKey}`);
    if (labelNode) {
      labelNode.scrollIntoView(true);
    }
  };
  scrollToField(errorInfo.errorFields[0].name[0]);
  if (onFinishFailed) onFinishFailed(errorInfo);
};

/**
 * 根据传进来的数据判断 DForm 的类型
 * @param data
 */
export const getDFormType = (data: DFormData): DFormType => {
  if (data instanceof Array) {
    let isTwoDimensional = false;
    let isCardListType = false;
    data.forEach((item: IFormItemProps[] | IFormItemProps | CardDForm) => {
      if (item instanceof Array) {
        isTwoDimensional = true;
      } else {
        isCardListType = !(item as IFormItemProps).fieldProps;
      }
    });
    if (isTwoDimensional) {
      return 'NORMALLIST';
    }
    return isCardListType ? 'CARDLIST' : 'NORMAL';
  }
  return 'CARD';
};

const changeData = (oldData: IFormItemProps[], autoLineFeed: boolean) =>
  oldData.map(item => {
    if (item.positionType === 'vertical' || !autoLineFeed) return item;
    if (item.title) {
      const titleSize = getByteLen(item.title);
      if (titleSize >= 16) {
        item.positionType = 'vertical';
      } else if (item.type === 'input' || item.type === 'extraInput') {
        if (titleSize > 8) {
          item.labelNumber = titleSize / 2 + 1;
        } else {
          item.labelNumber = 5;
        }
      }
    }
    return item;
  });

const renderListMain = (formData: DFormData, allDisabled: boolean, autoLineFeed: boolean, title?: React.ReactNode) => (
  <React.Fragment key={`cardlist-${title}-${formData[0].fieldProps}`}>
    <List renderHeader={() => title}>
      {changeData(formData as IFormItemProps[], autoLineFeed).map(item =>
        getFormItem(item, allDisabled),
      )}
    </List>
  </React.Fragment>
);

const renderCardMain = (formData: DFormData, allDisabled: boolean, autoLineFeed: boolean) => {
  const { data, type, ...otherData } = formData as CardDForm;
  const {title} = otherData;
  if (type === 'list') {
    return renderListMain(data, allDisabled, autoLineFeed, title);
  }
  const full = type==='fullcard';
  return (
    <React.Fragment key={`cardlist-${type}-${title}-${data[0].fieldProps}`}>
      <Card
        full={full}
        style={{
          paddingBottom: 0,
        }}
      >
        {Object.keys(otherData).length !== 0 && <Card.Header {...otherData} />}
        <List>
          {changeData(data as IFormItemProps[], autoLineFeed).map(item =>
            getFormItem(item, allDisabled),
          )}
        </List>
      </Card>
      <WhiteSpace size="sm"></WhiteSpace>
    </React.Fragment>
  );
};



const renderMainList = (
  type: DFormType,
  formData: DFormData,
  allDisabled: boolean,
  autoLineFeed: boolean,
) => {
  if (type === 'CARD') {
    return renderCardMain(formData, allDisabled, autoLineFeed);
  }
  if (type === 'CARDLIST') {
    return (formData as CardDForm[]).map(item => renderCardMain(item, allDisabled, autoLineFeed));
  }
  if (type === 'NORMALLIST') {
    return (formData as IFormItemProps[][]).map(item => renderListMain(item, allDisabled, autoLineFeed));
  }
  return renderListMain(formData, allDisabled, autoLineFeed);
};

const DynamicForm: FC<IDynamicFormProps> = ({
  children,
  data = [],
  form,
  allDisabled = false,
  formsValues = {},
  onFinish,
  onFinishFailed,
  onValuesChange,
  isDev,
  autoLineFeed = true,
}) => {
  useEffect(() => {
    form.setFieldsValue(formsValues as Store);
  }, [formsValues]);

  const dFormType = getDFormType(data);

  // 开启条件是开发模式，并且data没有传，或者data传空数组[]
  const showAddItem =
    isDev || (nodeEnvIsDev && (!data || (data instanceof Array && data.length === 0)));

  const rederChildren = renderMainList(dFormType, data, allDisabled, autoLineFeed);
  return (
    <>
      <Form
        form={form}
        initialValues={formsValues}
        onFinish={onFinish}
        onFinishFailed={(errorInfo: ValidateErrorEntity) =>
          defaultFailed(errorInfo, onFinishFailed)
        }
        onValuesChange={onValuesChange}
        validateMessages={errorMessages}
      >
        {rederChildren}
        {children}
      </Form>
      {showAddItem && <NewFieldPicker />}
    </>
  );
};

export default DynamicForm;
