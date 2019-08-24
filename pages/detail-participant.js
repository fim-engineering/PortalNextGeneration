import React from 'react';
import { withRouter } from 'next/router';
import { Result, Icon, Button, Divider, Card, List, Avatar, Carousel, Table, message, Descriptions } from 'antd';
import { fetch } from '@helper/fetch';
import PenilaianCard from '../components/Recruiter/ListCardRecruiter/PenilaianCard';
import ShowingAnswer from '../components/Recruiter/ListCardRecruiter/showingAnswer';



class DetailParticipant extends React.Component {
    state = {

    }

    static async getInitialProps({ query }) {
        console.log('SLUG initial Bagus', query);
        return {};
    }

    fetchDetailData = async () => {
        const payload = {
            ktpNumber: this.props.router.query.slug,
            tunnelId: this.props.router.query.tunnel
        }

        // setIsLoading(true);
        const { cookieLogin, refetchStep } = this.props;
        try {
            const response = await fetch({
                url: '/recruiter/participant/detail',
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${cookieLogin}`,
                }, data: {
                    ...payload
                }
            })

            const status = (response.data.status || false)

            if (!status) {
                message.error(response.data.message)
                // setIsLoading(false);
            } else {
                message.success(response.data.message)
                this.setState({ ...response.data.data })
                // console.log(response.data.data)           
            }

        } catch (error) {
            message.error("Server Error")

            // setIsLoading(false);
        }
    }

    componentDidMount() {
        this.fetchDetailData();
    }

    render() {
        console.log(this.state)
        const { router: { query } } = this.props
        return (
            <>
                <h1>{this.state.name ? this.state.name : 'loading...'}  |  {this.state.Summaries ? this.state.Summaries[0].Tunnel.name : 'loading...'}</h1>
                <div>
                    <Descriptions
                        // title="Responsive Descriptions"
                        bordered
                        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                    >

                        <Descriptions.Item label="Foto">
                            <Avatar shape="square" src={this.state.photoUrl ? this.state.photoUrl : null} size={128} icon="user" />
                        </Descriptions.Item>

                        <Descriptions.Item label="Nama Lengkap">{this.state.name ? this.state.name : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Nomor HP">{this.state.phone ? this.state.phone : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Email">{this.state.email ? this.state.email : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Alamat">{this.state.address ? this.state.address : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Kota">{this.state.cityAddress ? this.state.cityAddress : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Provinsi">{this.state.provinceAddress ? this.state.provinceAddress : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Batch FIM">{this.state.batchFim ? this.state.batchFim : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Golongan Darah">{this.state.bloodGroup ? this.state.bloodGroup : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Agama">{this.state.religion ? this.state.religion : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Tanggal Lahir">{this.state.bornPlace ? this.state.bornPlace : 'loading...'}, {this.state.bornDate ? this.state.bornDate : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Nomor HP Darurat">{this.state.emergencyPhone ? this.state.emergencyPhone : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Spesialisasi">{this.state.expertise ? this.state.expertise : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Jenis Kelamin">{this.state.gender ? this.state.gender : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Hobi">{this.state.hoby ? this.state.hoby : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Institusi">{this.state.institution ? this.state.institution : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Nomor KTP">{this.state.ktpNumber ? this.state.ktpNumber : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label="Gambar KTP">
                            <img style={{ width: '100%' }} src={this.state.ktpUrl ? this.state.ktpUrl : null} />
                        </Descriptions.Item>
                    </Descriptions>


                    <h2>Pertanyaan dan Jawaban {this.state.Summaries ? this.state.Summaries[0].Tunnel.name : 'loading...'}</h2>

                    {this.state.Answers ? (
                        <>
                            {this.state.Answers.map((value, index) => (
                                <Card key={index}
                                    title={value.Question.question}
                                >
                                   
                                        <ShowingAnswer
                                            question={value.Question.question}
                                            answer={value.answer ? value.answer : {}}
                                        />
                                    
                                </Card>
                            ))}
                        </>
                    ) : null}


                    {this.state.Summaries ? (
                        <PenilaianCard scoreUpdated={this.state.Summaries ? this.state.Summaries[0] : undefined} tunnelId={query.tunnel} ktpNumber={query.slug} />
                    ) : null}

                </div>

                <style jsx>{`
                    
                `}</style>
            </>
        )
    }
}

export default withRouter(DetailParticipant);