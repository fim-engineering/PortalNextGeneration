import React, { Component, Fragment } from 'react';
import { Input, Tooltip, Icon, Upload, Modal, message, Button } from 'antd';
import { fetch } from '@helper/fetch';
import { getCookie } from '@Cookie';
import CONSTANT from '@constant';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class KTP extends Component {
  
  state = {
    noKtp: '',
    urlKtp: 'http://xxx.sss.com/img/1.jpg',
    loading: false
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  changeState = (key, value) => {
    this.setState({ [key]: value })
  }

  renderInput = (currentValue, onChangeFn) => {
    return <Input
      value={currentValue}
      onChange={onChangeFn}
      placeholder="Enter your username"
      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
      suffix={
        <Tooltip title="Extra information">
          <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
        </Tooltip>
      }
    />
  }

  renderUpload = () => {

    const { imageUrl } = this.state;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    )
  }

  handleSubmit = async () => {
    const { noKtp, urlKtp } = this.state;

    try {

      const tokenName = CONSTANT.TOKEN_NAME

      const response = await fetch({
        url: '/auth/savektp',
        method: 'post',
        data: {
          noKtp,
          urlKtp
        },
        headers: {
          'Authorization': `Bearer ${getCookie(tokenName)}`
        },
      })
  
      console.log("response: ", response)
      // setCookie(CONSTANT.TOKEN_NAME, response.data.token)
      // this.openNotificationWithIcon('success')
      // this.redirectAfterSuccess()
      // this.onToggleLoader();
    } catch (error) {
      // this.onToggleLoader();
      console.log("error: ", error)
    }

  }

  render() {
    const { noKtp, urlKtp } = this.state; 

    return (<Fragment>
      <h1>Silahkan Isi KTP Anda</h1>
      {this.renderInput(noKtp, (e) => {this.changeState('noKtp', e.target.value)})}
      {this.renderUpload()}
      <Button onClick={this.handleSubmit} type="primary" size={'large'}>
        Primary
      </Button>
    </Fragment>)
  }
}

export default KTP;
