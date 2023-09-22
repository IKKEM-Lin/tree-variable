import { FC } from 'react';
import { Button, Popconfirm } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

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
        type="text"
        size="small"
        rootClassName="delete-btn"
        danger
        shape="circle"
        icon={<CloseOutlined />}
        onClick={(evt) => {
          evt?.stopPropagation();
        }}
      ></Button>
    </Popconfirm>
  );
};
