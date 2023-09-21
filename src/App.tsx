import { useEffect, useState } from 'react';
import {
  Switch,
  Collapse,
  Input,
  Button,
  Space,
  Tooltip,
  Typography,
  Row,
  Col,
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Editor } from './component/Editor';
import { DeleteButton } from './component/DeleteButton';
import { NestedForm, IEnvironment, IListItem } from './component/NestedForm';
import { getList, getDetail } from './service';
import { MoveableContainer } from './component/MoveableContainer/MoveableContainer';

const cache: any = {};

function App() {
  const [refList, setRefList] = useState<IListItem[]>([]);
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
    getList().then((res) => {
      setRefList(res);
    });
    getDetail().then(({ files, enviroments }) => {
      const newEnviroment: IEnvironment[] = enviroments;
      const newItemsCode: any = {};
      const data = files.map((item) => {
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
    <>
      <Space direction="vertical" style={{ maxWidth: '1200px', width: '90vw' }}>
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
        <div style={{ height: '80vh', width: '100%' }}>
          <MoveableContainer direction="col" defaultPosition={30}>
            <div style={{ height: 'calc(100% - 24px)' }}>
              <Space>
                Advance Mode:
                <Switch
                  checked={advanceMode}
                  onChange={(checked) => setAdvanceMode(checked)}
                />
              </Space>
              <div style={{ height: '100%' }}>
                <div style={{ height: '100%' }} hidden={!advanceMode}>
                  {advanceMode && environmentCode && (
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
                <div
                  style={{ height: '100%', overflowY: 'auto', width: '100%' }}
                >
                  {!advanceMode && (
                    <NestedForm
                      data={environmentCode}
                      refData={refList}
                      onChange={(newData) => {
                        setEnvironmentCode(newData);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div>
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
              {/* {JSON.stringify(environmentCode)} */}
            </div>
          </MoveableContainer>
        </div>
      </Space>
    </>
  );
}

export default App;
