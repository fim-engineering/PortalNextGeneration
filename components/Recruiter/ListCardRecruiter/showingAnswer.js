import React, { useState } from 'react';
import { Descriptions } from 'antd';

const ShowingAnswer = (props) => {
    const theAswer = JSON.parse(props.answer);
    const theKey = Object.keys(theAswer);
    // const [answer, setAnswer]=useState(theKey)


    return (
        <Descriptions
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        >
            {theKey.map((value, index) => (
                // <>
                <Descriptions.Item label={value}>
                    {theAswer[value]}
                </Descriptions.Item>

                //     {/* <Descriptions
                //         bordered
                //         column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                //     >
                //         <Descriptions.Item label={value}></Descriptions.Item>
                //     </Descriptions > */}
                // </>
            ))}
        </Descriptions>
    )

}

export default ShowingAnswer;