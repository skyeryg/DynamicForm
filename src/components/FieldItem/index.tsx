/* eslint-disable no-unused-expressions */
import React, { FC } from 'react';
import Form, { Field, useForm } from 'rc-field-form';
import { FieldProps } from 'rc-field-form/es/Field';
import '../../styles/index.less';
import { warning } from '../../utils/warnning';
import { toArray } from '../../utils';

interface FieldItemProps extends FieldProps {
  name: string;
  title?: string;
  subTitle?: string | React.ReactNode;
  isVertical?: boolean;
  required?: boolean;
  hasStar?: boolean;
}
interface MemoInputProps {
  value: any;
  update: number;
  error: boolean;
  children: React.ReactNode;
}
const MemoInput = React.memo(
  ({ children }: MemoInputProps) => children as JSX.Element,
  (prev, next) => prev.value === next.value && prev.update === next.update && prev.error === next.error,
);

const FieldItem: FC<FieldItemProps> = props => {

  const {
    children,
    title,
    trigger = 'onChange',
    validateTrigger = 'onChange',
    isVertical = false,
    required = false,
    hasStar = true,
    subTitle,
    rules=[],
    ...restProps
  } = props;

  const { name } = restProps;

  const [valueFlag, setValueFlag] = React.useState(false);

  const shouldUpdate = (prevValue: any, nextValue: any) => {
    if (props.shouldUpdate && typeof props.shouldUpdate === 'function') {
      props.shouldUpdate(prevValue, nextValue, {});
    }
    setValueFlag(nextValue && nextValue[props.name as any]);
    return prevValue !== nextValue;
  };

  // Record for real component render
  const updateRef = React.useRef(0);
  updateRef.current += 1;

  const variables: Record<string, string> = {};
  if (typeof title === 'string') {
    variables.title = title;
  }

  const rulesHasRequired = rules &&
    rules.some(rule => {
      if (rule && typeof rule === 'object' && rule.required) {
        return true;
      }
      return false;
    });
  const isRequired =
    required !== undefined
      ? required
      : rulesHasRequired;
  if (isRequired && !rulesHasRequired) {
    rules.push({ required: true });
  }

  function renderLayout(
    baseChildren: React.ReactNode,
    hasError?: boolean,
    errorMsg?: string,
  ): React.ReactNode {
    return (
      <>
        <div className={`alitajs-dform-field-title ${hasError ? 'error' : ''}`}>
          {isVertical && (
            <div className="alitajs-dform-vertical-title">
              {isRequired && hasStar && <span className="alitajs-dform-redStar">*</span>}
              <span id={name} className="alitajs-dform-title">
                {title}
              </span>
              {hasError ? errorMsg : subTitle}
            </div>
          )}
        </div>
        {baseChildren}
      </>
    )
  }

  return (
    <div className={valueFlag ? 'alitajs-dform-value-content' : 'alitajs-dform-placeholder'}>
      <Field
        {...restProps}
        rules={rules}
        trigger={trigger}
        validateTrigger={validateTrigger}
        messageVariables={variables}
        shouldUpdate={shouldUpdate}
        onReset={() => {
          // TODO: resetError
        }}
      >
        {(control, meta) => {
          const { errors } = meta;
          const hasError = errors.length > 0;

          const mergedName = toArray(name).length && meta ? meta.name : [];

          const mergedControl: typeof control = {
            ...control,
          };

          let childNode: React.ReactNode = null;
          if (Array.isArray(children)) {
            warning(false, '[Field]:`children` is array of render props cannot have `name`.');
            childNode = children;
          } else if (React.isValidElement(children)) {
            warning(
              children.props.defaultValue === undefined,
              '[Field]:`defaultValue` will not work on controlled Field. You should use `initialValues` of Form instead.',
            );

            const childProps = { ...children.props, ...mergedControl, required: isRequired, error: hasError };

            // We should keep user origin event handler
            const triggers = new Set<string>([...toArray(trigger), ...toArray(validateTrigger)]);

            triggers.forEach(eventName => {
              childProps[eventName] = (...args: any[]) => {
                mergedControl[eventName]?.(...args);
                children.props[eventName]?.(...args);
              };
            });

            childNode = (
              <MemoInput
                value={mergedControl[props.valuePropName || 'value']}
                update={updateRef.current}
                error={hasError}
              >
                {React.cloneElement(children, childProps)}
              </MemoInput>
            );
          } else {
            warning(
              !mergedName.length,
              '[Field]:`name` is only used for validate React element. If you are using [Field] as layout display, please remove `name` instead.',
            );
            childNode = children;
          }
          return renderLayout(childNode, hasError, errors.join(','));
        }}
      </Field>
    </div>
  );
};

export { useForm, Form };

export default FieldItem;
