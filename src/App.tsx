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
} from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Editor } from './component/Editor';
import './App.css';

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
      enviroment: [{ name: 'v2', type: 'ref', value: 'https://github.com' }],
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
  const [environmentCode, setEnvironmentCode] = useState<string>('');
  const [environmentValidate, setEnvironmentValidate] = useState(false);
  const [advanceMode, setAdvanceMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<CollapseProps['items']>([]);
  const [itemsCode, setItemsCode] = useState<{ [key: string]: string }>({});

  cache.itemsCode = itemsCode;
  cache.items = items;

  const genLabel = (label: string, key: string) => <Space>
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

  useEffect(() => {
    setLoading(true);
    getData().then((res) => {
      const newEnviroment = res.flatMap((item) => item.enviroment || []);
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
      setEnvironmentCode(JSON.stringify(newEnviroment, null, 2));
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
    <Space direction="vertical">
      <Typography.Title level={4} editable>{"Title"}</Typography.Title>
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
          <Editor
            code={environmentCode}
            isDark={true}
            language="json"
            onChange={(newCode, validate) => {
              setEnvironmentValidate(validate);
              setEnvironmentCode(newCode);
            }}
          />
        </div>
        {!advanceMode && environmentCode}
      </div>
      <Collapse accordion items={items} />
      <Button
        type="primary"
        shape="circle"
        icon={<PlusCircleOutlined />}
        onClick={() => addItem()}
      />
      {Object.values(itemsCode).join(' ')}
    </Space>
  );
}

export default App;
