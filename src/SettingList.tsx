import { useEffect, useState } from 'react';
import {
  Space,
  Typography,
  Row,
  Col,
  List,
  Input,
} from 'antd';
// import { DownOutlined } from '@ant-design/icons';
import { IListItem } from './component/NestedForm';
import { getList } from './service';
import { Link  } from "react-router-dom";
import "./App.css"

// const cache: any = {};

function SettingList() {
  const [refList, setRefList] = useState<IListItem[]>([]);
  const [filteredList, setFilteredList] = useState<IListItem[]>([]);
  const [filterVal, setFilterVal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getList().then((res) => {
      setRefList(res);
      setFilteredList(res);
      setLoading(false);
    });
  }, []);

  // if (loading) {
  //   return <></>;
  // }

  return (
    <Row justify="center" style={{marginTop: "20vh"}}>
      <Space direction="vertical" style={{ maxWidth: '900px', width: '90vw' }}>
        <List
          itemLayout="horizontal"
          size="large"
          loading={loading}
          rootClassName="setting-list"
          header={
            <Row justify="center">
              <Col span={18} sm={12}>
                <Input.Search
                  placeholder="Input search text"
                  value={filterVal}
                  allowClear
                  enterButton="Search"
                  size="large"
                  onChange={(evt) => {
                    setFilterVal(evt.target.value);
                    if (evt.target.value === '') {
                      setFilteredList(refList);
                    }
                  }}
                  onSearch={(val) =>
                    setFilteredList(
                      refList.filter(
                        (v) =>
                          v.title.toLowerCase().includes(val.toLowerCase()) ||
                          v.description
                            .toLowerCase()
                            .includes(val.toLowerCase())
                      )
                    )
                  }
                />
              </Col>
            </Row>
          }
          dataSource={filteredList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Link key="list-edit" to={`/${item.id}`}>
                  Edit
                </Link>,
              ]}
            >
              <List.Item.Meta
                title={<Link to={`/${item.id}`}>{item.title}</Link>}
                description={
                  <Typography.Text style={{ color: 'inherit' }} ellipsis>
                    {item.description}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      </Space>
    </Row>
  );
}

export default SettingList;
