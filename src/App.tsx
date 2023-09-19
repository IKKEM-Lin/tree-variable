import { useEffect, useState } from 'react';
import { Switch, Collapse, Input, Button } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Editor } from './component/Editor';
import './App.css';

async function getData() {
  const res = [
    { fileName: 'file1.json', code: 'uerwexcnlasfe', enviroment: {} },
    { fileName: 'file2.json', code: 'asdfwegfd123', enviroment: {} },
    { fileName: 'file3.json', code: '1231241vasdfa', enviroment: {} },
  ];
  return res;
}

const cache: any = {};

function App() {
  const [environmentCode, setEnvironmentCode] = useState('');
  const [environmentValidate, setEnvironmentValidate] = useState(false);
  const [advanceMode, setAdvanceMode] = useState(false);

  const [items, setItems] = useState<CollapseProps['items']>([]);
  const [itemsCode, setItemsCode] = useState<{ [key: string]: string }>({});

  cache.itemsCode = itemsCode;
  cache.items = items;

  useEffect(() => {
    getData().then((res) => {
      const newItemsCode: any = {};
      const data = res.map((item) => {
        const key = `${Math.random()}`;
        newItemsCode[key] = item.code;
        return {
          key: key,
          label: item.fileName,
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
                  cache.items[currentItemIndex].label = val;
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
    });
  }, []);

  const addItem = () => {
    const key = `${Math.random()}`;
    const defaultFileName = ""
    const newItem = {
      key: key,
      label: defaultFileName,
      children: (
        <>
          <Input
            defaultValue={defaultFileName}
            onChange={(evt) => {
              const val = evt.target.value;
              const currentItemIndex = cache.items.findIndex(
                (item) => item.key === key
              );
              // console.log({val, currentItemIndex})
              if (currentItemIndex === -1) {
                return;
              }
              cache.items[currentItemIndex].label = val;
              setItems([...cache.items]);
            }}
          />
          <div style={{ height: '40vh', width: '80vw', marginTop: '5px' }}>
            <Editor
              code={""}
              isDark={true}
              onChange={(code) =>
                setItemsCode({ ...cache.itemsCode, [key]: code })
              }
            />
          </div>
        </>
      ),
    };
    setItems([...items, newItem])
  }

  return (
    <>
      Advance Mode:{'  '}
      <Switch
        checked={advanceMode}
        onChange={(checked) => setAdvanceMode(checked)}
      />
      <div style={{ height: '20vh', width: '80vw' }}>
        <div style={{ height: '100%' }} hidden={!advanceMode}>
          <Editor
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
      <Button type="primary" shape="circle" icon={<PlusCircleFilled />} onClick={() => addItem()} />
      {Object.values(itemsCode).join(' ')}
    </>
  );
}

export default App;
