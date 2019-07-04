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
} from "antd";
import { fetch } from '@helper/fetch';

const { Option } = Select;
const { TextArea } = Input;
const AutoCompleteOption = AutoComplete.Option;


class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };

  componentDidMount = () => {
    const { form, dataUser: { Identity } } = this.props;

    if (Identity) {
      form.setFieldsValue({
        name: Identity.name,
        address: Identity.address,
        phone: Identity.phone
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
    const { address, name, phone, prefix } = values
    console.log("values: ", values)

    const response = await fetch({
      url: '/auth/save-profile',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${cookieLogin}`
      },
      data: {
        name: name,
        address: address,
        phone: `${prefix}${phone}`
      }
    })

    console.log("response: ", response)

    const status = (response.data.status || false)
    const messageAPI = (response.data.message || '')

    if (!status) {
      message.error(messageAPI);
    } else {
      message.success(messageAPI);
      refetchStep();
    }
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
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

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Name">
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "Please input your Name"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Address">
          {getFieldDecorator("address", {
            rules: [
              { required: true, message: "Please input your address!" }
            ]
          })(<TextArea rows={4} />)}
        </Form.Item>
        <Form.Item label="Phone Number">
          {getFieldDecorator("phone", {
            rules: [
              { required: true, message: "Please input your phone number!" }
            ]
          })(<Input addonBefore={prefixSelector} style={{ width: "100%" }} />)}
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
          <Button type="primary" htmlType="submit">
            Register
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
