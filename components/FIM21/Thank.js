import react, { Component } from 'react';
import {
  Divider,
  Empty,
  notification,
  Skeleton,
  Steps,
  Result,
  Button,
} from 'antd';

class Thank extends Component {
  render() {
    const { onChangeStep } = this.props
    
    return (
      <Result
        status="success"
        title="Data Kamu sudah masuk, silahkan tunggu!"
        subTitle="Silahkan Menunggu Pengumuman"
        extra={[
          <Button type="primary" key="console">
            Kembali Ke Beranda
          </Button>,
          <Button onClick={() => { onChangeStep(1) }} key="buy">Memilih Jalur Lain</Button>,
        ]}
      />
    )
  }
}

export default Thank;