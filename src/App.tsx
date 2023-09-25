import { useEffect, useState } from 'react';
import {
  // Switch,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Radio,
  Popover,
} from 'antd';
import {
  DownOutlined,
} from '@ant-design/icons';
import {LayoutIcon} from "./component/LayoutIcon"
import { Editor } from './component/Editor';
import { NestedForm, IEnvironment, IListItem } from './component/NestedForm';
import { FileContent, IFile } from './component/FileContent';
import { BaseInfo, IBaseInfo } from './component/BaseInfo';
import { getList, getDetail } from './service';
import { MoveableContainer } from './component/MoveableContainer/MoveableContainer';
import { useParams, useNavigate } from "react-router-dom";
import "./App.css"

// const cache: any = {};


function App() {
  const params = useParams();
  const navigate = useNavigate();
  const currentId = params.id || ""
  const [baseInfo, setBaseInfo] = useState<IBaseInfo>({
    title: '',
    description: '',
  });
  const [refList, setRefList] = useState<IListItem[]>([]);
  const [environmentCode, setEnvironmentCode] = useState<IEnvironment[]>([]);
  const [files, setFiles] = useState<IFile[]>([]);
  const [environmentValidate, setEnvironmentValidate] = useState(false);
  const [advanceMode, _] = useState(false);
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState<'row' | 'col'>(localStorage.getItem("layout") as any || 'row');

  console.log(environmentValidate, currentId);
  useEffect(() => {
    setLoading(true);
    getList().then((res) => {
      setRefList(res);
    });
    getDetail(currentId).then(({ files, enviroments, title, description }) => {
      setBaseInfo({title, description})
      setFiles(files);
      setEnvironmentCode(enviroments);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("layout", layout)
  }, [layout])

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
          Environment Variable
          {/* Advance Mode:
          <Switch
            checked={advanceMode}
            onChange={(checked) => setAdvanceMode(checked)}
          /> */}
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

  const handleSave = () => {
    console.log(baseInfo, environmentCode, files);
  };
  const handleCancle = () => {
    navigate(-1)
    // console.log(baseInfo, environmentCode, files)
  };

  return (
    <>
      <Space direction="vertical" style={{ maxWidth: '1200px', width: '90vw' }}>
        <Row className="header-bar" align="bottom" justify="space-between">
          <Col>
            <Radio.Group
              value={layout}
              buttonStyle="solid"
              onChange={(evt) => setLayout(evt.target.value)}
            >
              <Radio.Button value="row">
                <LayoutIcon size={20} rotate={90} />
              </Radio.Button>
              <Radio.Button value="col">
                <LayoutIcon size={20} rotate={0} />
              </Radio.Button>
            </Radio.Group>
          </Col>
          <Col>
            <Popover
              trigger="click"
              content={
                <BaseInfo
                  data={baseInfo}
                  onChange={(newData) => setBaseInfo(newData)}
                />
              }
            >
              <Button type="text">
                <Typography.Text strong>
                  {baseInfo.title || '(Empty)'}
                </Typography.Text>
                <DownOutlined />
              </Button>
            </Popover>
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
              <Button onClick={handleCancle}>Cancel</Button>
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
