import React, { Component } from 'react';
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
import '../../static/sass/AddListRecruiter.scss';
import ListCardRecruiter from './ListCardRecruiter/ListCardRecruiter';
import { fetch } from '@helper/fetch';


class AddListRecruiter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isLoading: false,
            recruiters: []
        }
    }

    componentDidMount() {
        this.fetchRecruiter();
    }

    fetchRecruiter = async () => {
        const { cookieLogin, refetchStep } = this.props;
        try {
            const response = await fetch({
                url: '/recruiter/lists',
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${cookieLogin}`
                }
            })

            const status = (response.data.status || false)

            if (!status) {
                message.error(response.data.message)
                this.setState({ isLoading: false })
            } else {
                message.success(response.data.message)
                this.setState({
                    isLoading: false,
                    recruiters: response.data.data
                })
            }

        } catch (error) {
            message.error("Server Error")
            this.setState({ isLoading: false })
        }
    }

    submitRecruiter = async (email) => {
        const { cookieLogin, refetchStep } = this.props;
        try {
            const response = await fetch({
                url: '/recruiter/recruiter/add',
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${cookieLogin}`
                },
                data: {
                    email: email
                }
            })

            const status = (response.data.status || false)

            if (!status) {
                message.error(response.data.message)
                this.setState({ isLoading: false })
            } else {
                message.success(response.data.message)
                this.fetchRecruiter();
            }

        } catch (error) {
            message.error("Server Error")
            this.setState({ isLoading: false })
        }
    }

    onSubmitAddRecruiterHandler(e) {
        e.preventDefault();
        const email = this.state.email;
        // message.error("Server Error")
        this.submitRecruiter(email);
    }

    render() {
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

        return (
            <>
                <div className="add-list-recruiter-wrapper">
                    <form onSubmit={(e) => this.onSubmitAddRecruiterHandler(e)}>
                        <div className="add-recruiter-wrapper">
                            <label>Tambah Recruiter</label>
                            <Input onChange={(e) => { this.setState({ email: e.target.value }) }} type="email" placeholder="Tambahkan e-mail recruiter di sini"></Input>
                            <Button type="submit" onClick={(e) => this.onSubmitAddRecruiterHandler(e)} >Add</Button>
                        </div>
                    </form>
                </div>

                <div className="list-recruiter-wrapper">
                    <div className="list-name-wrapper">
                        {this.state.recruiters.map((value, index) => (
                            <ListCardRecruiter dataRecruiter={value} key={index} />
                        ))}
                    </div>
                </div>


                <style jsx>{`
                    .add-list-recruiter-wrapper{                       
                        display:flex;
                        flex-direction:row;
                    }  
                    .list-name-wrapper{
                        margin-top:20px;
                    }
             
                `}</style>
            </>
        )
    }
}

export default AddListRecruiter;