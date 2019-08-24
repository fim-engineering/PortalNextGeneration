import React from 'react';
import { withRouter } from 'next/router';
import { Result, Icon, Button, Divider, List, Avatar, Carousel, Table, message, Descriptions } from 'antd';
import { fetch } from '@helper/fetch';
import PenilaianCard from '../components/Recruiter/ListCardRecruiter/PenilaianCard';



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
        const { router: { query } } = this.props
        return (
            <>
                <h1>Menampilkan Data {query.slug} |  {query.tunnel}</h1>
                <div>

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