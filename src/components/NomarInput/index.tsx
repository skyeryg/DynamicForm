import React, { FC } from 'react';
import { InputItem } from 'antd-mobile';
import { InputItemPropsType } from 'antd-mobile/es/input-item/PropsType';
import { Rule } from 'rc-field-form/es/interface';
import Field from '../FieldItem';

import '../../styles/index.less';

export interface INomarInputProps extends InputItemPropsType {
  inputType?: InputItemPropsType['type'];
  coverStyle?: React.CSSProperties;
  title?: string;
  required?: boolean;
  fieldProps: string;
  rules?: Rule[];
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  positionType?: 'vertical' | 'horizontal';
  hasStar?: boolean;
  subTitle?: string | React.ReactNode;
  hidden?: boolean;
}

const NomarInput: FC<INomarInputProps> = props => {
  const {
    inputType = 'text',
    coverStyle,
    title = '',
    required = false,
    fieldProps,
    rules,
    positionType = 'horizontal',
    hasStar = true,
    extra,
    subTitle,
    hidden = false,
    onBlur,
    ...otherProps
  } = props;

  const isVertical = positionType === 'vertical';

  const inputOnBlur = (val: string | undefined) => {
    window.scrollTo(0, 0);
    if (onBlur) onBlur(val);
  };

  return (
    <>
      {!hidden && (
        <div className="alitajs-dform-input">
          <div className={`alitajs-dform${isVertical ? '-vertical' : ''}-input`}>
            <Field 
              name={fieldProps} 
              title={title}
              required={required}
              isVertical={isVertical}
              subTitle={subTitle}
              rules={rules}
              hasStar={hasStar}
            >
              <InputItem
                {...otherProps}
                type={inputType}
                style={{ textAlign: isVertical ? 'left' : 'right', ...coverStyle }}
                onBlur={val => {
                  inputOnBlur(val);
                }}
              >
                {required && hasStar && <span className="alitajs-dform-redStar">*</span>}
                {!isVertical && <span id={fieldProps} className="alitajs-dform-title">
                  {title}
                </span>}
              </InputItem>
            </Field>
          </div>
        </div>
      )}
    </>
  );
};

export default NomarInput;
