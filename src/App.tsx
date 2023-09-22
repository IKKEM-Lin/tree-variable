import { useEffect, useState } from 'react';
import {
  Switch,
  Input,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Radio,
  Popover,
} from 'antd';
import { ColumnHeightOutlined, ColumnWidthOutlined, DownOutlined } from '@ant-design/icons';
import { Editor } from './component/Editor';
import { NestedForm, IEnvironment, IListItem } from './component/NestedForm';
import { FileContent, IFile } from './component/FileContent';
import { BaseInfo, IBaseInfo } from './component/BaseInfo';
import { getList, getDetail } from './service';
import { MoveableContainer } from './component/MoveableContainer/MoveableContainer';

// const cache: any = {};

function App() {
  const [baseInfo, setBaseInfo] = useState<IBaseInfo>({title: "", description: ""});
  const [refList, setRefList] = useState<IListItem[]>([]);
  const [environmentCode, setEnvironmentCode] = useState<IEnvironment[]>([]);
  const [files, setFiles] = useState<IFile[]>([]);
  const [environmentValidate, setEnvironmentValidate] = useState(false);
  const [advanceMode, setAdvanceMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState<'row' | 'col'>('row');

  useEffect(() => {
    setLoading(true);
    getList().then((res) => {
      setRefList(res);
    });
    getDetail().then(({ files, enviroments }) => {
      const newEnviroment: IEnvironment[] = enviroments;
      setFiles(files);
      setEnvironmentCode(newEnviroment);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <></>;
  }

  const content = (
    <MoveableContainer
      direction={layout}
      defaultPosition={layout === 'col' ? 30 : undefined}
    >
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
          <div style={{ height: '100%', overflowY: 'auto', width: '100%' }}>
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
      <div style={{ padding: '10px 0 0 4px', height: '100%' }}>
        <FileContent
          data={files}
          onChange={(newdata) => setFiles(newdata)}
          mode={layout === 'row' ? 'top' : undefined}
        />
      </div>
    </MoveableContainer>
  );

  return (
    <>
      <Space direction="vertical" style={{ maxWidth: '1200px', width: '90vw' }}>
        <Row align="bottom" justify="space-between">
          <Col>
              <Radio.Group
                value={layout}
                buttonStyle="solid"
                onChange={(evt) => setLayout(evt.target.value)}
              >
                <Radio.Button value="row">
                  <ColumnWidthOutlined />
                </Radio.Button>
                <Radio.Button value="col">
                  <ColumnHeightOutlined />
                </Radio.Button>
              </Radio.Group>
          </Col>
          <Col>
            <Popover trigger="click" content={<BaseInfo data={baseInfo} onChange={newData => setBaseInfo(newData)}  />}>
              <Button type="text">
                <Typography.Text strong>{baseInfo.title || '(Empty)'}</Typography.Text>
                <DownOutlined />
              </Button>
            </Popover>
          </Col>
          <Col>
            <Space>
              <Button type="primary">Save</Button>
              <Button>Cancel</Button>
            </Space>
          </Col>
        </Row>
        {/* Description:
        <Input.TextArea rows={5} /> */}
        <div style={{ height: '80vh', width: '100%' }}>
          {layout === 'col' && content}
          {layout === 'row' && content}
        </div>
      </Space>
    </>
  );
}

export default App;
