import React, { Component, Fragment } from 'react';
import {
  Button,
  Divider,
  Icon,
  Input,
  message,
  Modal,
  Tooltip,
  Upload,
} from 'antd';
import { fetch } from '@helper/fetch';
import { getCookie } from '@Cookie';
import CONSTANT from '@constant';

const { confirm } = Modal;

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('Image must smaller than 1MB!');
  }
  return isJPG && isLt2M;
}

class KTP extends Component {
  
  state = {
    noKtp: '',
    urlKtp: '',
    loading: false,
    loadingButton: false,
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'error') {
      message.error('Gagal Upload');
      this.setState({ loading: false });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({
        urlKtp: info.file.response.secure_url,
        loading: false,
      })
      message.success('Sukses Upload');
    }
  };

  changeState = (key, value) => {
    this.setState({ [key]: value })
  }

  renderInput = (currentValue, onChangeFn) => {
    return (<Fragment>
      <p>
        Mohon masukkan dengan nomor KTP anda yang asli. Hal ini berguna untuk Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.
      </p>
      <Input
        value={currentValue}
        onChange={onChangeFn}
        placeholder="Masukkan Nomor KTP Anda"
        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
        suffix={
          <Tooltip title="Nomor KTP">
            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
          </Tooltip>
        }
      />
    </Fragment>)
  }

  renderUpload = () => {

    const { urlKtp } = this.state;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (<Fragment>
      <p>
        Mohon Upload Foto KTP Asli anda. Hal ini berguna untuk Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.
      </p>
      <Upload
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://api.cloudinary.com/v1_1/fim-indonesia/image/upload"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        data={(file) => {
          return {
            upload_preset: 'ID_card',
            file,
            tags: 'browser_upload'
          }
        }}
      >
        {urlKtp ? <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={urlKtp} alt="avatar" /> : uploadButton}
      </Upload>
    </Fragment>)

  }

  onToggleLoaderButton = () => {
    this.setState(prevState => ({
      loadingButton: !prevState.loadingButton
    }))
  }

  handleSubmit = async () => {
    const { noKtp, urlKtp } = this.state;

    this.onToggleLoaderButton()

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

      const { data, statusText } = response

      if (data.status) {
        message.success(data.message);
      } else {
        message.error(data.message);
      }

      this.onToggleLoaderButton()

    } catch (error) {
      message.error("Gagal");
      console.log("error: ", error)
      this.onToggleLoaderButton()
    }

  }

  showConfirm = () => {
    confirm({
      title: 'Kamu Yakin akan mengirimkan data ini ?',
      content: 'Sekali anda mensubmit, tidak akan bisa diubah!',
      onOk: () => {
        this.handleSubmit()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  get isDisableButton() {
    const { noKtp, urlKtp } = this.state; 

    return Boolean(noKtp) && Boolean(urlKtp)
  }

  get buttonSubmitProps() {
    const { loadingButton } = this.state;

    return {
      ...!this.isDisableButton && {
        disabled: true
      },
      loading: loadingButton,
      onClick: this.showConfirm,
      type: "primary",
      size: 'large'
    }
  }

  render() {
    const { noKtp } = this.state; 

    return (<Fragment>
      <Divider>Nomor KTP</Divider>
      {this.renderInput(noKtp, (e) => {this.changeState('noKtp', e.target.value)})}
      <Divider>Upload Foto KTP</Divider>
      {this.renderUpload()}
      <Button {...this.buttonSubmitProps}>
        Submit
      </Button>
    </Fragment>)
  }
}

export default KTP;
