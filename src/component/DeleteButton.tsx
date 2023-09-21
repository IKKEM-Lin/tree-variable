import { FC } from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const DeleteButton: FC<{ onConfirm: (evt: any) => void }> = ({
  onConfirm,
}) => {
  return (
    <Popconfirm
      title="Delete the file"
      description="Are you sure to delete this file?"
      onConfirm={onConfirm}
      onCancel={(evt) => evt?.stopPropagation()}
      okText="Yes"
      cancelText="No"
    >
      <Button
        // type="second"
        danger
        shape="circle"
        icon={<DeleteOutlined color="#a00" />}
        onClick={(evt) => {
          evt?.stopPropagation();
        }}
      ></Button>
    </Popconfirm>
  );
};
