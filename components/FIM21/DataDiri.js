import React from "react";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  message,
  Radio,
  DatePicker,
  Upload,
} from "antd";
import { fetch } from '@helper/fetch';
import moment from 'moment';
import { sendPageview } from '@tracker';

const { Option } = Select;
const { TextArea } = Input;
const AutoCompleteOption = AutoComplete.Option;

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

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    loading: false,
    isLoadingButton: false,
  };

  componentDidMount = () => {
    const { form, dataUser: { Identity } } = this.props;

    sendPageview({ pathName: '/datadiri' })

    if (Identity) {
      this.setState({ urlKtp: Identity.photoUrl })
      form.setFieldsValue({
        profPic: Identity.photoUrl,
        name: Identity.name,
        address: Identity.address,
        phone: Identity.phone,
        religion: Identity.religion || '',
        bornPlace: Identity.bornPlace,
        institution: Identity.institution,
        gender: Identity.gender,
        cityAddress: Identity.cityAddress,
        provinceAddress: Identity.provinceAddress,
        hoby: Identity.hoby,
        bloodGroup: Identity.bloodGroup,
        emergencyPhone: Identity.emergencyPhone,
        expertise: Identity.expertise,
        headline: Identity.headline,
        otherReligion: Identity.otherReligion,
        bornDate: moment(Identity.bornDate || new Date(), 'YYYY-MM-DD'),
      })
    }

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.handleOnSubmit(values)
      }
    });
  };

  handleOnSubmit = async (values) => {
    const { cookieLogin, refetchStep } = this.props;
    const { urlKtp } = this.state;
    const { otherReligion, bloodGroup, headline, expertise, emergencyPhone, hoby, gender, provinceAddress, cityAddress, address, name, phone, prefix, religion, bornDate, bornPlace, institution } = values

    this.setState({ isLoadingButton: true })

    const response = await fetch({
      url: '/auth/save-profile',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${cookieLogin}`
      },
      data: {
        name: name,
        address: address,
        phone: phone,
        headline: 'headline',
        photoUrl: urlKtp,
        religion: religion,
        bornPlace: bornPlace,
        bornDate: moment(bornDate, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss'),
        cityAddress: cityAddress,
        provinceAddress: provinceAddress,
        emergencyPhone: emergencyPhone,
        gender: gender,
        bloodGroup: bloodGroup,
        hoby: hoby,
        expertise: expertise,
        institution: institution,
        otherReligion: otherReligion,

        // photoUrl: urlKtp,
        // name: name,
        // address: address,
        // phone: phone,
        // religion: religion,
        // bornDate: moment(bornDate, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss'),
      }
    })


    const status = (response.data.status || false)
    const messageAPI = (response.data.message || '')
    const nullData = (response.data.nullData || [])

    if (!status) {
      message.error(messageAPI);
    } else {
      message.success(`${messageAPI} ${nullData.length > 0 && nullData.toString()}`);
      refetchStep();
    }

    this.setState({ isLoadingButton: false })
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = [".com", ".org", ".net"].map(
        domain => `${value}${domain}`
      );
    }
    this.setState({ autoCompleteResult });
  };

  handleChange = info => {
    const { form } = this.props

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
      form.setFieldsValue({
        profPic: info.file.response.secure_url
      })

      this.setState({
        urlKtp: info.file.response.secure_url,
        loading: false,
      })
      message.success('Sukses Upload');
    }
  };

  renderUpload = () => {
    const { urlKtp, loading } = this.state;

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <Upload
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://api.cloudinary.com/v1_1/fim-indonesia/image/upload"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        data={(file) => {
          return {
            upload_preset: 'profile_photo',
            file,
            tags: 'browser_upload'
          }
        }}
      >
        {(urlKtp && !loading) ? <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={urlKtp} alt="avatar" /> : uploadButton}
      </Upload>
    )
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { autoCompleteResult, isLoadingButton } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "62"
    })(
      <Select style={{ width: 70 }}>
        <Option value="62">+62</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    const religionss = getFieldValue("religion") || ''

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Nama">
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "Please input your Name"
              }
            ]
          })(<Input placeholder="nama lengkap sesuai identitas" />)}
        </Form.Item>
        <Form.Item label="Alamat">
          {getFieldDecorator("address", {
            rules: [
              { required: true, message: "Please input your address!" }
            ]
          })(<TextArea placeholder="alamat domisili saat ini" rows={4} />)}
        </Form.Item>
        <Form.Item label="Kota">
          {getFieldDecorator("cityAddress", {
            rules: [
              { required: true, message: "Isi Kota Alamat Anda!" }
            ]
          })(<Input placeholder="kota domisili saat ini" />)}
        </Form.Item>
        <Form.Item label="Provinsi">
          {getFieldDecorator("provinceAddress", {
            rules: [
              { required: true, message: "Isi Provinsi Alamat Anda!" }
            ]
          })(<Input placeholder="provinsi domisili saat ini" />)}
        </Form.Item>
        <Form.Item label="Nomor Darurat">
          {getFieldDecorator("emergencyPhone", {
            rules: [
              { required: true, message: "Isi Nomor Darurat Anda!" }
            ]
          })(<Input placeholder="nomor telepon untuk dihubungi saat kejadian darurat, tuliskan pemilik nomor dan hubungannya dengan kamu. Misal: Budi (Ayah) 08123456789" />)}
        </Form.Item>
        <Form.Item label="Keahlian">
          {getFieldDecorator("expertise", {
            rules: [
              { required: true, message: "Isi Keahlian Anda!" }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Nomor Telpon">
          {getFieldDecorator("phone", {
            rules: [
              { required: true, message: "Please input your phone number!" }
            ]
          })(<Input placeholder="nomor telepon pribadi" style={{ width: "100%" }} />)}
        </Form.Item>
        <Form.Item label="Tempat Lahir">
          {getFieldDecorator("bornPlace", {
            rules: [
              { required: true, message: "Tolong isi tempat lahir anda!" }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Institusi">
          {getFieldDecorator("institution", {
            rules: [
              { required: true, message: "Tolong isi Institusi asal anda!" }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Hobi">
          {getFieldDecorator("hoby", {
            rules: [
              { required: true, message: "Tolong isi Hobi Anda!" }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Tanggal Lahir">
          {getFieldDecorator("bornDate", {
            rules: [
              { required: true, message: "Tolong isi tanggal lahir anda" }
            ]
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label="Jenis Kelamin">
          {getFieldDecorator("gender", {
            rules: [
              { required: true, message: "Pilih jenis kelamin anda" }
            ]
          })(
            <Select>
              <Option value="Pria">Pria</Option>
              <Option value="Wanita">Wanita</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Golongan Darah">
          {getFieldDecorator("bloodGroup", {
            rules: [
              { required: true, message: "Pilih Golongan Darah" }
            ]
          })(
            <Select>
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="AB">AB</Option>
              <Option value="O">O</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Agama">
          {getFieldDecorator("religion", {
            rules: [
              { required: true, message: "Please select your religion" }
            ]
          })(
            <Select>
              <Option value="Islam">Islam</Option>
              <Option value="Kristen Protestan">Kristen Protestan</Option>
              <Option value="Katolik">Katolik</Option>
              <Option value="Hindu">Hindu</Option>
              <Option value="Buddha">Buddha</Option>
              <Option value="Kong Hu Cu">Kong Hu Cu</Option>
              <Option value="Kepercayaan Lain nya">Kepercayaan Lain nya</Option>
            </Select>
          )}
        </Form.Item>
        {
          religionss.includes('Kepercayaan') && <Form.Item label="Kepercayaan Lain nya">
            {getFieldDecorator("otherReligion", {
              rules: [
                { required: false, message: "Tolong isi Kepercayaan Lain Anda!" }
              ]
            })(<Input />)}
          </Form.Item>
        }
        <Form.Item label="Foto Pribadi">
          {getFieldDecorator("profPic", {
            rules: [
              { required: true, message: "Please set your photo" }
            ]
          })(this.renderUpload())}
        </Form.Item>
        {/* <Form.Item label="Website">
          {getFieldDecorator("website", {
            rules: [{ required: true, message: "Please input website!" }]
          })(
            <AutoComplete
              dataSource={websiteOptions}
              onChange={this.handleWebsiteChange}
              placeholder="website"
            >
              <Input />
            </AutoComplete>
          )}
          </Form.Item> */}
        <Form.Item {...tailFormItemLayout}>
          <Button loading={isLoadingButton} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "register" })(
  RegistrationForm
);

export default WrappedRegistrationForm;
