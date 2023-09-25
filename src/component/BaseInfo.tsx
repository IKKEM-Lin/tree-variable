import { FC } from 'react';
import { Input, Form } from 'antd';

export interface IBaseInfo {
  title: string;
  description: string;
}

export const BaseInfo: FC<{
  data: IBaseInfo;
  onChange: (newData: IBaseInfo) => void;
}> = ({ data, onChange }) => {
  return (
    <Form layout="vertical">
      <Form.Item label="Title">
        <Input value={data.title} onChange={evt => onChange({...data, title: evt.target.value})} />
      </Form.Item>
      <Form.Item label="Description">
        <Input.TextArea rows={5} value={data.description} onChange={evt => onChange({...data, description: evt.target.value})} />
      </Form.Item>
    </Form>
  );
};
