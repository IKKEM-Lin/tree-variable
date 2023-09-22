import { FC } from 'react';
import {
  Input,
  Button,
  Tooltip,
  Typography,
  Row,
  Col,
  Tree,
  Select,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { DeleteButton } from './DeleteButton';
import { getDetail } from '../service';

export interface IEnvironment {
  name: string;
  type: string;
  value: string;
  children?: IEnvironment[];
}

export interface IListItem {
  title: string;
  id: string;
  files?: string[];
}

export const NestedForm: FC<{
  data: IEnvironment[];
  refData: IListItem[];
  onChange: (newData: IEnvironment[]) => void;
}> = ({ data, onChange, refData }) => {
  const renderTreeData: (
    items: IEnvironment[],
    offset: number,
    parentKey?: string
  ) => DataNode[] = (items, offset, parentKey = '') => {
    return items.map((item, ind) => {
      const currentKey = `${parentKey}-${ind}`;
      return {
        key: currentKey,
        selectable: false,
        title: (
          <Row gutter={8}>
            <Col span={4}>
              <Input
                value={item.name}
                placeholder="Name"
                disabled={offset > 0}
                onChange={(e) => {
                  item.name = e.target.value;
                  onChange([...data]);
                }}
              />
            </Col>
            <Col span={6}>
              <Select
                value={item.type}
                style={{ width: '100%' }}
                onChange={(val) => {
                  item.type = val;
                  item.value = '';
                  item.children = [];
                  onChange([...data]);
                }}
                disabled={offset > 0}
                options={[
                  { value: 'constant', label: 'constant' },
                  { value: 'ref', label: 'ref' },
                  { value: 'path', label: 'path' },
                ]}
              />
            </Col>
            {item.type !== 'ref' && (
              <Col span={8}>
                <Input
                  value={item.value}
                  onChange={(e) => {
                    item.value = e.target.value;
                    onChange([...data]);
                  }}
                />
              </Col>
            )}
            {item.type === 'ref' && (
              <Col span={8}>
                <Select
                  value={item.value}
                  style={{ width: '100%' }}
                  onChange={async (val) => {
                    item.value = val;
                    const newChildren = await getDetail(val);
                    item.children = [...newChildren.enviroments];
                    onChange([...data]);
                  }}
                  disabled={offset > 0}
                  options={refData.map((item) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                />
              </Col>
            )}
            {offset === 0 && (
              <Col span={2}>
                <DeleteButton
                  onConfirm={() => onChange((data.splice(ind, 1), [...data]))}
                />
              </Col>
            )}
          </Row>
        ),
        children:
          (item?.children &&
            renderTreeData(item.children, offset + 1, currentKey)) ||
          [],
      };
    });
  };
  const treeData: DataNode[] = renderTreeData(data, 0);
  // console.log({ treeData });
  return (
    <>
      <Row gutter={8} align="bottom">
        <Col span={4} offset={1}>
          <Typography.Title level={5}>Name</Typography.Title>
        </Col>
        <Col span={6}>
          <Typography.Title level={5}>Type</Typography.Title>
        </Col>
        <Col span={8}>
          <Typography.Title level={5}>Value</Typography.Title>
        </Col>
        <Col span={4}>
          <Tooltip title="Add new variable">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              size="small"
              style={{ marginBottom: '8px' }}
              onClick={() =>
                onChange([...data, { name: '', type: 'constant', value: '' }])
              }
            />
          </Tooltip>
        </Col>
      </Row>
      <Tree
        showLine
        showIcon
        treeData={treeData}
        blockNode
        defaultExpandAll={true}
        autoExpandParent
      />
    </>
  );
};
