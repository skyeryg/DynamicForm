import React, { FC, useState } from 'react';
import Field from '../Field';
import AddressPickerGroup from './AddressPickerGroup';
import { IAddressPickerProps } from './interface';
import '../../styles/index.less';

const AddressPicker: FC<IAddressPickerProps> = props => {
  const [initValue, setInitValue] = useState([]);

  const {
    fieldProps,
    rules,
    required = false,
    title,
    hasStar = true,
    positionType = 'horizontal',
    subTitle,
    hidden = false,
  } = props;

  const isVertical = positionType === 'vertical';

  return (
    <>
      {!hidden && (
        <React.Fragment>
          <div className="alitajs-dform-input-title">
            {isVertical && (
              <div className="alitajs-dform-vertical-title">
                {required && hasStar && <span className="alitajs-dform-redStar">*</span>}
                <span id={fieldProps} className="alitajs-dform-title">
                  {title}
                </span>
                {subTitle}
              </div>
            )}
          </div>
          <Field
            name={fieldProps}
            rules={rules || [{ required, message: `请选择${title}` }]}
            shouldUpdate={(prevValue: any, nextValue: any) => {
              setInitValue(nextValue && nextValue[fieldProps as any]);
              return prevValue !== nextValue;
            }}
          >
            <AddressPickerGroup {...props} initValue={initValue} />
          </Field>
        </React.Fragment>
      )}
    </>
  );
};

export default AddressPicker;
