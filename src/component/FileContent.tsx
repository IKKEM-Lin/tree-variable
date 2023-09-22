import { FC } from 'react';
import { Input, Button, Tooltip, Tabs, Space } from 'antd';
import type { TabsProps } from 'antd/es/tabs';
import { DeleteButton } from './DeleteButton';
import { Editor } from './Editor';
import { PlusOutlined } from '@ant-design/icons';
import './FileContent.css';

export interface IFile {
  fileName: string;
  code: string;
  id?: string;
}

export const FileContent: FC<{
  data: IFile[];
  onChange: (newData: IFile[]) => void;
  mode?: TabsProps['tabPosition'];
}> = ({ data, onChange, mode }) => {
  const tabPosition = mode || 'left';
  const items = data.map((item, ind) => ({
    label: (
      <Space>
        {item.fileName}
        <DeleteButton
          onConfirm={() => {
            onChange((data.splice(ind, 1), [...data]));
          }}
        />
      </Space>
    ),
    // closeIcon: ,
    key: `${item.id}, ${ind}`,
    children: (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div>
          <Input
            defaultValue={item.fileName}
            onChange={(evt) => {
              const val = evt.target.value;
              item.fileName = val;
              onChange([...data]);
            }}
          />
        </div>
        <div style={{ width: '100%', marginTop: '5px', flexGrow: 1 }}>
          <Editor
            code={item.code}
            isDark={true}
            onChange={(code) => {
              item.code = code;
              onChange([...data]);
            }}
          />
        </div>
      </div>
    ),
  }));
  return (
    <Tabs
      // defaultActiveKey={items[0]?.key}
      type="line"
      rootClassName="file-content-tabs"
      size="small"
      tabBarStyle={{ width: (tabPosition == 'left' && '150px') || '100%' }}
      tabPosition={tabPosition}
      items={items}
      hideAdd
      tabBarGutter={12}
      tabBarExtraContent={{
        right: (
          <Tooltip title="Add new file">
            <Button
              type="primary"
              shape="circle"
              size="small"
              icon={<PlusOutlined />}
              onClick={() =>
                onChange([
                  ...data,
                  { id: `${data.length}`, fileName: 'new_file.ext', code: '' },
                ])
              }
            />
          </Tooltip>
        ),
      }}
    />
  );
};
