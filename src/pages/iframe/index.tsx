import '@ant-design/v5-patch-for-react-19';
// 兼容react 19
import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { Button } from 'antd';
import { memo, useEffect, useState } from 'react';
import { Center } from 'react-layout-kit';

import Data from '@/components/DataRender';
import { fetchClothes } from '@/services/clothes';
import { ResponseData } from '@/type';

const Render = memo(() => {
  console.log('Render start...');
  // 初始化渲染状态
  const [data, setData] = useState<ResponseData>();
  // 初始化时从主应用同步状态
  useEffect(() => {
    console.log('初始化时从主应用同步状态');
    lobeChat.getPluginMessage().then(setData);
  }, []);

  // 记录请求参数
  const [payload, setPayload] = useState<any>();

  useEffect(() => {
    lobeChat.getPluginPayload().then((payload) => {
      if (payload?.name === 'recommendClothes') {
        setPayload(payload.arguments);
      }
    });
  }, []);

  const fetchData = async () => {
    const data = await fetchClothes(payload);
    console.log('[fetchData]', data);
    setData(data);
    lobeChat.setPluginMessage(data);
  };
  const cancelFetchData = async () => {
    let data = '用户取消了本次操作';
    setData(data);
    lobeChat.setPluginMessage(data);
  };
  const isDataString = typeof data === 'string';
  return !isDataString ? (
    <Data {...data} />
  ) : (
    <Center style={{ height: 180, position: 'relative', width: '100%' }}>
      <div
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 32,
          padding: '0 32px',
          width: '100%',
        }}
      >
        <div>
          <div style={{ alignItems: 'center', display: 'flex', marginBottom: 16 }}>
            <span style={{ fontSize: 18, fontWeight: 500, marginRight: 8 }}>查询方法：</span>
            <span style={{ color: '#555', fontSize: 18 }}>recommendClothes</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>查询参数：</div>
          <table style={{ borderCollapse: 'collapse', minWidth: 200 }}>
            <tbody>
              {payload ? (
                Object.entries(payload).map(([key, value]) => (
                  <tr key={key}>
                    <td
                      style={{
                        background: '#fafafa',
                        border: '1px solid #eee',
                        fontWeight: 500,
                        padding: '4px 12px',
                      }}
                    >
                      {key}
                    </td>
                    <td style={{ border: '1px solid #eee', color: '#555', padding: '4px 12px' }}>
                      {String(value)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} style={{ color: '#999', padding: '8px', textAlign: 'center' }}>
                    暂无参数
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Button disabled={!payload} onClick={fetchData} type="primary">
            执行
          </Button>
          <Button disabled={!payload} onClick={cancelFetchData}>
            取消
          </Button>
        </div>
      </div>
    </Center>
  );
});

export default Render;
