/* eslint-disable no-template-curly-in-string */
import { ValidateMessages } from 'rc-field-form/lib/interface';

const typeTemplate = '${title}不是一个有效的${type}';

const messages: ValidateMessages = {
  default: '字段验证错误${title}',
  required: '请输入${title}',
  enum: '${title}必须是其中一个[${enum}]',
  whitespace: '${title}不能为空字符',
  date: {
    format: '${title}日期格式无效',
    parse: '${title}不能转换为日期',
    invalid: '${title}是一个无效日期',
  },
  types: {
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    number: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    email: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate,
  },
  string: {
    len: '${title}须为${len}个字符',
    min: '${title}最少${min}个字符',
    max: '${title}最多${max}个字符',
    range: '${title}须在${min}-${max}字符之间',
  },
  number: {
    len: '${title}必须等于${len}',
    min: '${title}最小值为${min}',
    max: '${title}最大值为${max}',
    range: '${title}须在${min}-${max}之间',
  },
  array: {
    len: '须为${len}个${title}',
    min: '最少${min}个${title}',
    max: '最多${max}个${title}',
    range: '${title}数量须在${min}-${max}之间',
  },
  pattern: {
    mismatch: '${title}格式错误',
  },
};

export default messages;
