import { useEffect, useState, FC } from 'react';
import {
  Switch,
  Collapse,
  Input,
  Button,
  Space,
  Tooltip,
  Typography,
  Popconfirm,
  Row,
  Col,
  Tree,
  Select,
} from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Editor } from './component/Editor';
import './App.css';

interface IEnvironment {
  name: string;
  type: string;
  value: string | IEnvironment[];
}

const NestedForm: FC<{
  data: IEnvironment[];
  onChange: (newData: IEnvironment[]) => void;
}> = ({ data, onChange }) => {
  const renderTreeData: (items: IEnvironment[], offset: number) => DataNode[] =
    (items, offset) => {
      return items.map((item, ind) => {
        return {
          key: `${offset}-${ind}`,
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
              {!Array.isArray(item.value) && (
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
            (Array.isArray(item.value) &&
              renderTreeData(item.value, offset + 1)) ||
            [],
        };
      });
    };
  const treeData: DataNode[] = renderTreeData(data, 0);

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
        <Col style={{ textAlign: 'right' }} span={5}>
          <Tooltip title="Add new variable">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusCircleOutlined />}
              size="small"
              style={{ marginBottom: '8px' }}
              onClick={() =>
                onChange([...data, { name: '', type: 'constant', value: '' }])
              }
            />
          </Tooltip>
        </Col>
      </Row>
      <Tree showLine showIcon treeData={treeData} blockNode defaultExpandAll />
    </>
  );
};

const DeleteButton: FC<{ onConfirm: (evt: any) => void }> = ({ onConfirm }) => {
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

async function getData() {
  const res = [
    {
      fileName: 'file1.json',
      code: 'uerwexcnlasfe',
      enviroment: [{ name: 'v1', type: 'constant', value: '123' }],
    },
    {
      fileName: 'file2.json',
      code: 'asdfwegfd123',
      enviroment: [
        {
          name: 'v2',
          type: 'ref',
          value: [{ name: 'v3', type: 'path', value: './local/temp.dump' }],
        },
      ],
    },
    {
      fileName: 'file3.json',
      code: '1231241vasdfa',
      enviroment: [{ name: 'v3', type: 'path', value: './local/temp.dump' }],
    },
  ];
  return res;
}

const cache: any = {};

function App() {
  const [environmentCode, setEnvironmentCode] = useState<IEnvironment[]>([]);
  const [environmentValidate, setEnvironmentValidate] = useState(false);
  const [advanceMode, setAdvanceMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<CollapseProps['items']>([]);
  const [itemsCode, setItemsCode] = useState<{ [key: string]: string }>({});

  cache.itemsCode = itemsCode;
  cache.items = items;

  const genLabel = (label: string, key: string) => (
    <Space>
      {label}
      <DeleteButton
        onConfirm={(evt) => {
          evt?.stopPropagation();
          setItems(cache.items.filter((item) => item.key !== key));
          const temp = { ...cache.itemsCode };
          delete temp[key];
          setItemsCode(temp);
        }}
      />
    </Space>
  );

  useEffect(() => {
    setLoading(true);
    getData().then((res) => {
      const newEnviroment: any[] = res.flatMap((item) => item.enviroment || []);
      const newItemsCode: any = {};
      const data = res.map((item) => {
        const key = `${Math.random()}`;
        newItemsCode[key] = item.code;
        return {
          key: key,
          label: genLabel(item.fileName, key),
          children: (
            <>
              <Input
                defaultValue={item.fileName}
                onChange={(evt) => {
                  const val = evt.target.value;
                  const currentItemIndex = cache.items.findIndex(
                    (item) => item.key === key
                  );
                  // console.log({val, currentItemIndex})
                  if (currentItemIndex === -1) {
                    return;
                  }
                  cache.items[currentItemIndex].label = genLabel(val, key);
                  setItems([...cache.items]);
                }}
              />
              <div style={{ height: '40vh', width: '80vw', marginTop: '5px' }}>
                <Editor
                  code={item.code}
                  isDark={true}
                  onChange={(code) =>
                    setItemsCode({ ...cache.itemsCode, [key]: code })
                  }
                />
              </div>
            </>
          ),
        };
      });
      setItems(data);
      setItemsCode(newItemsCode);
      setEnvironmentCode(newEnviroment);
      setLoading(false);
    });
  }, []);

  const addItem = () => {
    const key = `${Math.random()}`;
    const defaultFileName = '';
    const newItem = {
      key: key,
      label: genLabel(defaultFileName, key),
      children: (
        <>
          <Input
            defaultValue={''}
            onChange={(evt) => {
              const val = evt.target.value;
              const currentItemIndex = cache.items.findIndex(
                (item) => item.key === key
              );
              // console.log({val, currentItemIndex})
              if (currentItemIndex === -1) {
                return;
              }
              cache.items[currentItemIndex].label = genLabel(val, key);
              setItems([...cache.items]);
            }}
          />
          <div style={{ height: '40vh', width: '80vw', marginTop: '5px' }}>
            <Editor
              code={''}
              isDark={true}
              onChange={(code) =>
                setItemsCode({ ...cache.itemsCode, [key]: code })
              }
            />
          </div>
        </>
      ),
    };
    setItems([...items, newItem]);
  };

  if (loading) {
    return;
  }

  return (
    <Space direction="vertical" style={{ maxWidth: '1200px' }}>
      <Row align="bottom" justify="space-between">
        <Col>
          <Typography.Title level={4} editable>
            {'Title'}
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary">Save</Button>
            <Button>Cancel</Button>
          </Space>
        </Col>
      </Row>
      Description:
      <Input.TextArea rows={5} />
      <Space>
        Advance Mode:
        <Switch
          checked={advanceMode}
          onChange={(checked) => setAdvanceMode(checked)}
        />
      </Space>
      <div style={{ height: '20vh', width: '80vw' }}>
        <div style={{ height: '100%' }} hidden={!advanceMode}>
          {environmentCode && (
            <Editor
              code={JSON.stringify(environmentCode, null, 2)}
              isDark={true}
              language="json"
              onChange={(newCode, validate) => {
                setEnvironmentValidate(validate);
                setEnvironmentCode(JSON.parse(newCode));
              }}
            />
          )}
        </div>
        <div style={{ height: '100%', overflowY: 'auto' }}>
          {!advanceMode && (
            <NestedForm
              data={environmentCode}
              onChange={(newData) => {
                setEnvironmentCode(newData);
              }}
            />
          )}
        </div>
      </div>
      <Collapse accordion items={items} />
      <Row justify="end">
        <Tooltip title="Add new file">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusCircleOutlined />}
            onClick={() => addItem()}
          />
        </Tooltip>
      </Row>
      {/* {Object.values(itemsCode).join(' ')} */}
      {JSON.stringify(environmentCode)}
    </Space>
  );
}

export default App;
