import React, { FC, useState } from 'react';
import { Rule } from 'rc-field-form/es/interface';
import { ImagePicker, Toast } from 'antd-mobile';
import { ImagePickerPropTypes } from 'antd-mobile/es/image-picker/PropsType';
import Field from '../FieldItem';
import '../../styles/index.less';

export interface INomarImagePickerProps extends ImagePickerPropTypes {
  coverStyle?: React.CSSProperties;
  title?: string;
  required?: boolean;
  fieldProps: string;
  rules?: Rule[];
  hasStar?: boolean;
  limitSize?: number;
  subTitle?: string | React.ReactNode;
  hidden?: boolean;
}

const NomarImagePicker: FC<INomarImagePickerProps> = props => {
  const {
    coverStyle,
    title,
    required = false,
    fieldProps,
    rules,
    hasStar = true,
    limitSize = 0,
    subTitle,
    hidden = false,
    ...otherProps
  } = props;
  const [fileList, setFileList] = useState([]);

  return (
    <React.Fragment>
      {!hidden && (
        <div className="alitajs-dform-image-picker">
          <Field
            name={fieldProps} 
            title={title}
            required={required}
            isVertical
            subTitle={subTitle}
            rules={rules}
            hasStar={hasStar}
            shouldUpdate={(prevValue: any, nextValue: any) => {
              const files = nextValue[fieldProps] || [];
              if (files && files.length > fileList.length) {
                const lastFile = files[files.length - 1];
                const { file = {} } = lastFile;
                if (limitSize && file && file.size && file.size > limitSize) {
                  Toast.fail('图片过大', 1);
                  return false;
                }
              }
              setFileList((nextValue && nextValue[fieldProps as any]) || []);
              return prevValue !== nextValue;
            }}
          >
            <ImagePicker {...otherProps} files={fileList} />
          </Field>
        </div>
      )}
    </React.Fragment>
  );
};

export default NomarImagePicker;
