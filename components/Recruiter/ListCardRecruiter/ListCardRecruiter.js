import React, { useState, useEffect } from 'react';
import { fetch } from '@helper/fetch';
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


const ListCardRecruiter = (props) => {
    const [isToggle, setToggle] = useState(false);
    const [allParticipantAvailable, setAllParticipantAvailable] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAllParticipantTersisa = async () => {
        setIsLoading(true);
        const { cookieLogin, refetchStep } = props;
        try {
            const response = await fetch({
                url: 'recruiter/participant/available-to-assign',
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${cookieLogin}`,
                }, data: {
                    email: props.dataRecruiter.email
                }
            })

            const status = (response.data.status || false)

            if (!status) {
                message.error(response.data.message)
                setIsLoading(false);
            } else {
                // message.success(response.data.message)
                setAllParticipantAvailable(response.data.data)
            }

        } catch (error) {
            message.error("Server Error")
            setIsLoading(false);
        }
    }

    const fetchAllParticipantAssign = async () => {
        setIsLoading(true);
        const { cookieLogin, refetchStep } = props;
        try {
            const response = await fetch({
                url: 'recruiter/participant/to-assign',
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${cookieLogin}`,
                }, data: {
                    email: props.dataRecruiter.email
                }
            })

            const status = (response.data.status || false)

            if (!status) {
                message.error(response.data.message)
                setIsLoading(false);
            } else {
                // message.success(response.data.message)
                setSelectedParticipant(response.data.data)
            }

        } catch (error) {
            message.error("Server Error")
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isToggle) {
            fetchAllParticipantTersisa();
            fetchAllParticipantAssign();
        }
    }, [isToggle])


    const onTriggerAssign = async (e, ktp, emailRecruiter, TunnelId) => {

        e.preventDefault();

        const payload = {
            ktpNumberPeserta: ktp,
            emailRecruiter: emailRecruiter,
            TunnelId: TunnelId
        }

        // setIsLoading(true);
        const { cookieLogin, refetchStep } = props;
        try {
            const response = await fetch({
                url: 'recruiter/assign',
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
                // message.success(response.data.message)
                fetchAllParticipantTersisa();
                fetchAllParticipantAssign();
                // setAllParticipantAvailable(response.data.data)
            }

        } catch (error) {
            message.error("Server Error")
            // setIsLoading(false);
        }
    }


    const onUndoAssign = async (e, ktp, emailRecruiter, TunnelId) => {

        e.preventDefault();

        const payload = {
            ktpNumberPeserta: ktp,
            emailRecruiter: emailRecruiter,
            TunnelId: TunnelId
        }

        // setIsLoading(true);
        const { cookieLogin, refetchStep } = props;
        try {
            const response = await fetch({
                url: 'recruiter/participant/undo-assign',
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
                // message.success(response.data.message)
                fetchAllParticipantTersisa();
                fetchAllParticipantAssign();
                // setAllParticipantAvailable(response.data.data)
            }

        } catch (error) {
            message.error("Server Error")
            // setIsLoading(false);
        }
    }

    return (
        <>
            <div className="card-list-name" onClick={() => setToggle(!isToggle)}>
                <div className="name">
                    {props.dataRecruiter.email}
                </div>
                <div className="status">
                    {props.dataRecruiter.ktpNumber !== null ? "Active" : "-"}
                </div>
                <div className="counting">
                    0 / {selectedParticipant.length}
                </div>
            </div>

            {isToggle ? (
                <div className="list-peserta-wrapper">
                    <div className="all-peserta">
                        <h2>List Semua Peserta</h2>
                        {allParticipantAvailable.map((value, index) => {
                            if (value.Identity !== null) {
                                return <div className="peserta-card" onClick={(e) => onTriggerAssign(e, value.ktpNumber, props.dataRecruiter.email, value.TunnelId)}>
                                    <div className="nama">{value.Identity.name}</div>
                                    <div className="noKTP">{value.Tunnel.name} | <b>{value.ktpNumber}</b></div>
                                </div>
                            }
                        }
                        )}
                    </div>

                    <div className="all-peserta">
                        <h4>Peserta yang ditugaskan untuk dinilai kepada {props.dataRecruiter.name}</h4>
                        {selectedParticipant.map((value, index) => {
                            if (value.Identity !== null) {
                                return <div className="peserta-card" onClick={(e) => onUndoAssign(e, value.ktpNumber, props.dataRecruiter.email, value.TunnelId)}>
                                    <div className="nama">{value.Identity.name}</div>
                                    <div className="noKTP">{value.Tunnel.name}  |<b>{value.ktpNumber}</b></div>
                                </div>
                            }
                        }
                        )}
                    </div>
                </div>
            ) : null}


            <style jsx>{`
                    .add-list-recruiter-wrapper{                       
                        display:flex;
                        flex-direction:row;                        
                    }                     

                    .card-list-name{
                        display:felx;
                        flex-direction:row;
                        justify-content : space-between;
                        padding: 10px;
                        border: 1px solid grey;
                        margin-bottom: 5px;
                        cursor:pointer;
                    }                  

                    .list-peserta-wrapper{
                        background: gainsboro;
                        display: flex;
                        flex-direction: row;
                        padding:10px;
                    }

                    .list-peserta-wrapper .all-peserta{
                        width:50%;
                        border:1px solid grey;
                        padding:5px;
                        background:white;
                        height:300px;
                        overflow:scroll;
                    }

                    .list-peserta-wrapper .all-peserta .peserta-card{
                        display:flex;
                        flex-direction:row;
                        justify-content:space-between;
                        border-bottom: 1px solid #f1f1f1;
                        padding:3px;
                    }

                    .list-peserta-wrapper .all-peserta .peserta-card:hover{
                        background:gainsboro;
                        cursor:pointer;
                    }

                `}</style>
        </>
    )
}

export default ListCardRecruiter;